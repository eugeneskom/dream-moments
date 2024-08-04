jqueryDatepicker($);
$.datepicker.regional["ru"] = {
    closeText: "Закрыть",
    prevText: "Предыдущий месяц",
    nextText: "Следующий месяц",
    currentText: "Сегодня",
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
	'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
	'Июл','Авг','Сен','Окт','Ноя','Дек'],
    dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
    dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    weekHeader: "Не",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ""
};


$('[data-toggle][data-target]').each(function () {
	$(this).click(function () {
		var targetQuery = this.getAttribute('data-target');
		if (targetQuery.length == 0) {
			return;
		}
		
		var elements = $(targetQuery);
		if (elements.length == 0) {
			return;
		}
		
		var active = this.getAttribute('data-toggle') === 'true';
		if (active) {
			elements.each(function () {
				$(this).attr('data-navmenu', 'unactive');
			});
			} else {
			elements.each(function (target) {
				$(this).attr('data-navmenu', 'active');
			});
		}
		
		this.setAttribute('data-toggle', (!active).toString());
	});
});

function scrollToTop() {
	$('html, body').stop().scrollTop(100).animate({ scrollTop: 0 }, 100);
}

$('.page__to-top').click(function () {
	scrollToTop();
});

function addSeparatorsNF(nStr, inD, outD, sep)
{
	nStr += '';
	var dpos = nStr.indexOf(inD);
	var nStrEnd = '';
	if (dpos != -1) {
		nStrEnd = outD + nStr.substring(dpos + 1, nStr.length);
		nStr = nStr.substring(0, dpos);
	}
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(nStr)) {
		nStr = nStr.replace(rgx, '$1' + sep + '$2');
	}
	return nStr + nStrEnd;
}

$(document).ready(function () {
	var filter = $('#filter'),
	filter_top = filter.find('.filter-top'),
	filter_url = filter_top.attr('action'),
	filter_select = filter_top.find('select'),
	filter_bottom = filter.find('.filter-bottom'),
	keyword = $('#filter-keyword'),
	top_cart = $('#top-cart'),
	side_cart = $('#side-cart'),
	cart_offset = filter.length > 0 ? filter.offset().top - 50 : 0,
	gift_img = $('#gift-img'),
	write_mail_popup = $('#write-mail-popup'),
	wmf = $("#write-mail-form"),
	wmf_loading = wmf.find(".send-btn"),
	wmf_xhr,
	is_wmf_xhr = false,
	wmf_err = false,
	animation_class = 'flash',
	widgetSid = document.getElementById('widgetSid')?.value || '';
	
	$('#f-search').click(function () {
		filter.toggleClass('filter-open');
	});
	
	filter_select.change(function () {
		var form_data = {},
		is_category = false,
		f_category = '';
		
		if ($(this).val().indexOf('section-') != -1) {
			window.location = '/' + $(this).val().substring(8);
			return false;
		}
		
		filter_select.each(function () {
			var filter_val = $(this).val(),
			filter_name = $(this).attr('name');
			
			if (filter_val != '') {
				form_data[filter_name] = filter_val;
				
				if (filter_name == 'who' || filter_name == 'theme') {
					is_category = true;
					f_category = filter_val;
				}
			}
		});
		
		var filter_obj_size = Object.keys(form_data).length;
		
		if (filter_obj_size > 1) {
			window.location = filter_url + '?' + $.param(form_data);
			} else if (filter_obj_size == 1 && is_category) {
			window.location = filter_url + '/' + f_category;
			} else if (filter_obj_size == 1 && !is_category) {
			window.location = filter_url + '?' + $.param(form_data);
			} else {
			window.location = filter_url;
		}
	});
	
	filter_bottom.submit(function () {
		if ($.trim(keyword.val()) == '') {
			keyword.val('').focus();
			
			return false;
		}
	});
	
	if ($('#show-pros').length) {
		var show_pros = $('#show-pros'),
		pros = $('#pros');
		
		show_pros.click(function () {
			pros.toggleClass('hidden');
			
			return false;
		});
	}
	
	if ($('#constructor').length) {
		var constructor = $('#constructor'),
		box_head = $('#box-head'),
		box_head_is_changed = false,
		box_items = $('#box-items'),
		box_tooltips = constructor.find('.box-item > a'),
		is_box_del_xhr = false,
		box_cart_xhr = false,
		box_items_empty_html = '',
		box_head_empty_html = '<p class="box-amount">0 <span>т</span></p><p class="box-amount-tip">Стоимость вашего набора</p><p class="box-buy"><button class="btn" disabled>Купить набор</button></p>';
		
		for (var i = 1; i <= 8; i++) {
			box_items_empty_html += '<div class="box-item"><span>' + i + '</span></div>';
		}
		
		$(document).on('click', '#icp-close', function () {
			//$.magnificPopup.close();
			
			return false;
		});
		
		$(document).scroll(function () {
			
			if ($(window).scrollTop() + $(window).height() >= $('.footer').offset().top) {
				constructor.css('bottom', $(window).scrollTop() + $(window).height() - $('.footer').offset().top + 'px');
				} else if (constructor.css('bottom') != 0) {
				constructor.css('bottom', 0);
			}
		});
		
		box_tooltips.tooltip({
			container: 'body'
		});
		
		box_head.on('click', 'button', function () {
			if (box_cart_xhr) {
				return false;
			}
			
			add_to_box_xhr = $.ajax({ type: "POST", url: "/ajax/addboxtocart", data: {}, cache: false, dataType: "json", success: function success(arr) {
				box_cart_xhr = false;
				
				box_items.find('.box-item').addClass('box-item-del').children('a').tooltip('destroy');
				box_head.addClass('box-head-empty').html(box_head_empty_html);
				
				if (Modernizr.csstransitions) {
					setTimeout(function () {
						box_items.html(box_items_empty_html);
					}, 300);
					} else {
					box_items.html(box_items_empty_html);
				}
				
				if (arr.cartTotal) {
					side_cart.removeClass('empty');
					} else {
					side_cart.addClass('empty');
				}
				
				if (Modernizr.cssanimations) {
					top_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
						$(this).removeClass('animated ' + animation_class); // flash pulse
					}).addClass('animated ' + animation_class).text(arr.cartTotal);
					side_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
						$(this).removeClass('animated ' + animation_class); // pulse
					}).addClass('animated ' + animation_class).text(arr.cartTotal);
					} else {
					top_cart.find('.cart-total').text(arr.cartTotal);
					side_cart.find('.cart-total').text(arr.cartTotal);
				}
				
				if (arr.error == "Y") {
					showNotification(arr.errorCode, 'error');
					} else {
					window.location = '/cart';
				}
				
				if ($('#catalog-list').length) {
					$('#catalog-list').find('.in-box').removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
				}
				
				if ($('#gift-buy').length && $('#gift-buy').hasClass('in-box')) {
					$('#gift-buy').removeClass('in-box').find('.btn-box').prop('disabled', false).text('Добавить в набор');
				}
				}, error: function error(jqXHR, textStatus, errorThrown) {
				box_cart_xhr = false;
				
				showNotification('Ошибка!<br>Обновите страницу, затем повторите действие.', 'error');
			}
			});
			
			return false;
		});
		
		box_items.on('click', '.box-del', function () {
			if (is_box_del_xhr) {
				return false;
			}
			
			var form_data = {
				pid: $(this).data('id')
			};
			
			is_box_del_xhr = true;
			
			var box_item_del = $(this).parent().parent(),
			del_pid = $(this).data('id');
			box_item_del.addClass('box-item-del').children('a').tooltip('destroy');
			
			$.ajax({ type: "POST", url: "/ajax/removefrombox", data: form_data, cache: false, dataType: "json",
				success: function success(arr) {
					if (Modernizr.csstransitions) {
						setTimeout(function () {
							is_box_del_xhr = false;
						}, 300);
						} else {
						is_box_del_xhr = false;
					}
					
					if ($('#gift-' + del_pid).length) {
						$('#gift-' + del_pid).removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
					}
					
					var $current_gift_buy = $('#gift-buy[data-pid="' + del_pid + '"]');
					if ($current_gift_buy.length) $current_gift_buy.removeClass('in-box').find('.btn-box').prop('disabled', false).text('Добавить в набор');
					
					if (arr.error == "Y") {
						if (Modernizr.csstransitions) {
							setTimeout(function () {
								box_item_del.remove();
								box_items.append('<div class="box-item"><span>8</span></div>').find('.box-item').each(function (index) {
									$(this).find('span').text(index + 1);
								});
							}, 300);
							
							if (!box_items.find('.box-item > a').length) {
								box_head.addClass('box-head-empty').html(box_head_empty_html);
							}
							
							showNotification(arr.errorCode, 'error');
							} else {
							box_item_del.remove();
							box_items.append('<div class="box-item"><span>8</span></div>').find('.box-item').each(function (index) {
								$(this).find('span').text(index + 1);
							});
							
							if (!box_items.find('.box-item > a').length) {
								box_head.addClass('box-head-empty').html(box_head_empty_html);
							}
							
							showNotification(arr.errorCode, 'error');
						}
						} else {
						showNotification(arr.msg);
						
						if (arr.total) {
							if (Modernizr.csstransitions) {
								setTimeout(function () {
									box_head.html(arr.head).removeClass('box-head-empty');
								}, 300);
								} else {
								box_head.html(arr.head).removeClass('box-head-empty');
							}
							
							if ($('#catalog-list').length) {
								$('#catalog-list').find('.in-box').each(function () {
									if (!arr.gifts[$(this).data('pid')]) {
										$(this).removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
									}
								});
							}
							
							if ($('#gift-buy').length && !arr.gifts[$('#gift-buy').data('pid')] && $('#gift-buy').hasClass('in-box')) {
								$('#gift-buy').removeClass('in-box').find('.btn-box').prop('disabled', false).text('Добавить в набор');
							}
							
							$.each(arr.gifts, function (index, value) {
								var elem = $('#gift-buy');
								
								if (elem.data('pid') == value && !elem.hasClass('in-box')) {
									elem.addClass('in-box').find('.btn-box').prop('disabled', true).text('Добавлен в набор');
								}
							});
							} else {
							if (Modernizr.csstransitions) {
								setTimeout(function () {
									box_head.addClass('box-head-empty').html(box_head_empty_html);
								}, 300);
								} else {
								box_head.addClass('box-head-empty').html(box_head_empty_html);
							}
							
							if ($('#catalog-list').length) {
								$('#catalog-list').find('.in-box').removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
							}
							
							if ($('#gift-buy').length && $('#gift-buy').hasClass('in-box')) {
								$('#gift-buy').removeClass('in-box').find('.btn-box').prop('disabled', false).text('Добавить в набор');
							}
						}
						
						if (Modernizr.csstransitions) {
							setTimeout(function () {
								box_tooltips.tooltip('destroy');
								box_items.html(arr.content);
								box_tooltips = constructor.find('.box-item > a');
								
								// update tooltips
								box_tooltips.tooltip({
									container: 'body'
								});
							}, 300);
							} else {
							box_tooltips.tooltip('destroy');
							box_items.html(arr.content);
							box_tooltips = constructor.find('.box-item > a');
							
							// update tooltips
							box_tooltips.tooltip({
								container: 'body'
							});
						}
					}
					}, error: function error(jqXHR, textStatus, errorThrown) {
					if (Modernizr.csstransitions) {
						setTimeout(function () {
							is_box_del_xhr = false;
							box_item_del.remove();
							box_items.append('<div class="box-item"><span>8</span></div>').find('.box-item').each(function (index) {
								$(this).find('span').text(index + 1);
							});
							
							if (!box_items.find('.box-item > a').length) {
								box_head.addClass('box-head-empty').html(box_head_empty_html);
							}
						}, 300);
						} else {
						is_box_del_xhr = false;
						box_item_del.remove();
						box_items.append('<div class="box-item"><span>8</span></div>').find('.box-item').each(function (index) {
							$(this).find('span').text(index + 1);
						});
						
						if (!box_items.find('.box-item > a').length) {
							box_head.addClass('box-head-empty').html(box_head_empty_html);
						}
					}
					
					if ($('#gift-' + del_pid).length) {
						$('#gift-' + del_pid).removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
					}
					
					if ($('#gift-buy').length && $('#gift-buy').data('pid') == del_pid) {
						$('#gift-buy').removeClass('in-box').find('.btn-box').prop('disabled', false).text('Добавить в набор');
					}
					
					var arr = $.parseJSON(jqXHR.responseText);
					
					showNotification(arr.errorCode + '<br>Обновите страницу, затем повторите действие.', 'error');
					
					// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
				}
			});
			
			return false;
		});
	}
	
	if ($('#home-gift-boxes').length) {
		var hbx_container = $('#home-gift-boxes'),
		is_hbx_xhr = false;
		
		$(document).on('click', '#icp-close', function () {
			//$.magnificPopup.close();
			
			return false;
		});
		
		hbx_container.on('submit', '.p-buy', function () {
			if (is_hbx_xhr) {
				return false;
			}
			
			var p_buy = $(this),
			catalog_active_btn = $(this).find('button');
			cart_total = parseInt(side_cart.find('.cart-total').text());
			
			var form_data = {
				pid: $(this).data('pid')
			};
			
			is_hbx_xhr = true;
			catalog_active_btn.addClass("anim").prop('disabled', true).text('Добавляю в корзину...');
			
			add_to_box_xhr = $.ajax({ type: "POST", url: "/ajax/addtocart", data: form_data, cache: false, dataType: "json", success: function success(arr) {
				is_hbx_xhr = false;
				
				if (cart_total != arr.total) {
					if (arr.total) {
						side_cart.removeClass('empty');
						} else {
						side_cart.addClass('empty');
					}
					
					if (Modernizr.cssanimations) {
						top_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$(this).removeClass('animated ' + animation_class); // flash pulse
						}).addClass('animated ' + animation_class).text(arr.total);
						side_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$(this).removeClass('animated ' + animation_class); // pulse
						}).addClass('animated ' + animation_class).text(arr.total);
						} else {
						top_cart.find('.cart-total').text(arr.total);
						side_cart.find('.cart-total').text(arr.total);
					}
				}
				
				if (arr.error == "Y") {
					catalog_active_btn.removeClass("anim").prop('disabled', false).text('Купить');
					showNotification(arr.errorCode, 'error');
					} else {
					p_buy.addClass('in-cart');
					catalog_active_btn.removeClass("anim").text('В корзине');
					
					window.location = '/cart';
				}
				
				if (Object.keys(arr.gifts).length > 0) {
					hbx_container.find('.p-buy').each(function () {
						if ($(this).hasClass('in-cart') && !arr.gifts[$(this).data('pid')]) {
							$(this).removeClass('in-cart').find('button').prop('disabled', false).text('В корзину');
							} else if (!$(this).hasClass('in-cart') && arr.gifts[$(this).data('pid')]) {
							$(this).addClass('in-cart').find('button').prop('disabled', true).text('Уже в корзине');
						}
					});
					} else {
					hbx_container.find('.in-cart').removeClass('in-cart').find('button').prop('disabled', false).text('В корзину');
				}
				}, error: function error(jqXHR, textStatus, errorThrown) {
				is_hbx_xhr = false;
				catalog_active_btn.removeClass("anim").prop('disabled', false).text('Купить');
				
				var arr = $.parseJSON(jqXHR.responseText);
				
				showNotification(arr.errorCode, 'error');
				
				// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
			}
			});
			
			return false;
		});
	}
	
	if ($('#catalog-list').length) {
		var container = $('#catalog-list'),
		is_catalog_xhr = false,
		load_more = $('#load-more'),
		current_page = 1,
		is_loading = false;
		
		container.on('submit', '.p-buy', function () {
			var p_buy = $(this),
			catalog_active_btn = $(this).find('button');
			
			if (is_catalog_xhr || catalog_active_btn.hasClass('inbox')) {
				return false;
			}
			
			var form_data = {
				pid: $(this).data('pid')
			};
			
			is_catalog_xhr = true;
			catalog_active_btn.addClass("anim").prop('disabled', true).text('Добавляю...');
			
			add_to_box_xhr = $.ajax({ type: "POST", url: "/ajax/addtobox", data: form_data, cache: false, dataType: "json", success: function success(arr) {
				is_catalog_xhr = false;
				
				if (arr.total) {
					box_head.html(arr.head).removeClass('box-head-empty');
					
					$('#catalog-list').find('.in-box').each(function () {
						if (!arr.gifts[$(this).data('pid')]) {
							$(this).removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
						}
					});
					} else {
					box_head.addClass('box-head-empty').html(box_head_empty_html);
					
					$('#catalog-list').find('.in-box').removeClass('in-box').children('.p-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('Добавить');
				}
				
				box_tooltips.tooltip('destroy');
				box_items.html(arr.content);
				box_tooltips = constructor.find('.box-item:not(.box-item-new) > a');
				
				// update tooltips
				box_tooltips.tooltip({
					container: 'body'
				});
				
				if (arr.error == "Y") {
					catalog_active_btn.removeClass("anim").prop('disabled', false).text('Добавить');
					showNotification(arr.errorCode, 'error');
					} else {
					p_buy.parent().addClass('in-box').find('.p-img').addClass('grayscale').find('img');
					catalog_active_btn.removeClass("anim").text('Добавлен');
					showNotification(arr.msg);
					
					if (box_items.find('.box-item-new').length) {
						var box_item_new = box_items.find('.box-item-new'),
						box_item_new_img = box_item_new.find('img');
						
						box_item_new_img.on("load error", function () {
							box_item_new_img.off("load error");
							
							if (Modernizr.csstransitions) {
								setTimeout(function () {
									box_item_new.removeClass('box-item-new');
								}, 16);
								} else {
								box_item_new.removeClass('box-item-new');
							}
							
							box_item_new.children('a').tooltip({
								container: 'body'
							});
							
							box_tooltips = constructor.find('.box-item > a');
						}).attr("src", box_item_new_img.data('img'));
					}
				}
				
				if (Object.keys(arr.gifts).length > 0) {
					$.each(arr.gifts, function (index, value) {
						var elem = $('#gift-' + value);
						
						if (!elem.hasClass('in-box')) {
							elem.addClass('in-box').find('.p-img').addClass('grayscale').find('img');
							elem.find('button').prop('disabled', true).text('Уже добавлен');
						}
					});
				}
				}, error: function error(jqXHR, textStatus, errorThrown) {
				is_catalog_xhr = false;
				catalog_active_btn.removeClass("anim").prop('disabled', false).text('Добавить');
				
				var arr = $.parseJSON(jqXHR.responseText);
				
				showNotification(arr.errorCode, 'error');
				
				// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
			}
			});
			
			return false;
		});
		
		/*load_more.waypoint(function(direction) {
        	is_loading = true;
        	$(this).addClass('loading');
        	
        	$(this).waypoint('disable');
        	
        	var form_data = $(this).data();
        	form_data.page = ++current_page;
        	
        	$.ajax({type:"GET", url: "/ajax/loaddata", data: form_data, cache: false, dataType: "json", success: function(arr) {
			is_loading = false;
			load_more.removeClass("loading");
			
			container.append(arr.html);
			current_page = arr.page;
			
			$(document.body).trigger("sticky_kit:recalc");
			initQuickBuyHandler();
			if(arr.last == "Y") {
			load_more.waypoint('destroy');
			// load_more.remove();
			}
			else {
			$.waypoints('refresh');
			load_more.waypoint('enable');
			}
			},
			error: function(){
			is_loading = false;
			load_more.removeClass("loading").waypoint('destroy');
			
			current_page = -1;
			// load_more.remove();
			}
        	});
			}, {
			offset: function() {
            return $.waypoints('viewportHeight') - 50;
			}
		});*/
	}
	
	if ($('#gift-boxes').length) {
		var container = $('#gift-boxes'),
		is_gbx_xhr = false,
		load_more = $('#load-more'),
		current_page = 1,
		is_loading = false;
		
		$(document).on('click', '#icp-close', function () {
			//$.magnificPopup.close();
			
			return false;
		});
		
		container.find('.grayscale').find('img');
		
		container.on('submit', '.p-buy', function () {
			if (is_gbx_xhr) {
				return false;
			}
			
			var p_buy = $(this),
			catalog_active_btn = $(this).find('button');
			cart_total = parseInt(side_cart.find('.cart-total').text());
			
			var form_data = {
				pid: $(this).data('pid')
			};
			
			is_gbx_xhr = true;
			catalog_active_btn.addClass("anim").prop('disabled', true).text('Добавляю в корзину...');
			
			add_to_box_xhr = $.ajax({ type: "POST", url: "/ajax/addtocart", data: form_data, cache: false, dataType: "json", success: function success(arr) {
				is_gbx_xhr = false;
				
				if (cart_total != arr.total) {
					if (arr.total) {
						side_cart.removeClass('empty');
						} else {
						side_cart.addClass('empty');
					}
					
					if (Modernizr.cssanimations) {
						top_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$(this).removeClass('animated ' + animation_class); // flash pulse
						}).addClass('animated ' + animation_class).text(arr.total);
						side_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$(this).removeClass('animated ' + animation_class); // pulse
						}).addClass('animated ' + animation_class).text(arr.total);
						} else {
						top_cart.find('.cart-total').text(arr.total);
						side_cart.find('.cart-total').text(arr.total);
					}
				}
				
				if (arr.error == "Y") {
					catalog_active_btn.removeClass("anim").prop('disabled', false).text('Купить');
					showNotification(arr.errorCode, 'error');
					} else {
					p_buy.parent().parent().addClass('in-cart').find('.gbp-img').addClass('grayscale').find('img');
					catalog_active_btn.removeClass("anim").text('В корзине');
					
					window.location = '/cart';
				}
				
				if (Object.keys(arr.gifts).length > 0) {
					container.find('.gift-box-preview').each(function () {
						if ($(this).hasClass('in-cart') && !arr.gifts[$(this).data('pid')]) {
							$(this).removeClass('in-cart').find('.gbp-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('В корзину');
							} else if (!$(this).hasClass('in-cart') && arr.gifts[$(this).data('pid')]) {
							$(this).addClass('in-cart').find('.gbp-img').addClass('grayscale').find('img');
							$(this).find('button').prop('disabled', true).text('Уже в корзине');
						}
					});
					} else {
					container.find('.in-cart').removeClass('in-cart').find('.gbp-img').removeClass('grayscale').parent().find('button').prop('disabled', false).text('В корзину');
				}
				}, error: function error(jqXHR, textStatus, errorThrown) {
				is_gbx_xhr = false;
				catalog_active_btn.removeClass("anim").prop('disabled', false).text('Купить');
				
				var arr = $.parseJSON(jqXHR.responseText);
				
				showNotification(arr.errorCode, 'error');
				
				// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
			}
			});
			
			return false;
		});
		
		/*load_more.waypoint(function(direction) {
        	is_loading = true;
        	$(this).addClass('loading');
        	
        	$(this).waypoint('disable');
        	
        	var form_data = $(this).data();
        	form_data.page = ++current_page;
        	
        	$.ajax({type:"GET", url: "/ajax/loaddata", data: form_data, cache: false, dataType: "json", success: function(arr) {
			is_loading = false;
			load_more.removeClass("loading");
			
			container.append(arr.html);
			current_page = arr.page;
			
			if(arr.last == "Y") {
			load_more.waypoint('destroy');
			// load_more.remove();
			}
			else {
			$.waypoints('refresh');
			load_more.waypoint('enable');
			}
			initQuickBuyHandler();
			},
			error: function(){
			is_loading = false;
			load_more.removeClass("loading").waypoint('destroy');
			
			current_page = -1;
			// load_more.remove();
			}
        	});
			}, {
			offset: function() {
            return $.waypoints('viewportHeight') - 50;
			}
		});*/
	}
	
	if ($('#giftbox-buy').length) {
		var is_gbx_xhr = false,
		giftbox_buy = $('#giftbox-buy'),
		gb_active_btn = giftbox_buy.find('button');
		
		$(document).on('click', '#icp-close', function () {
			//$.magnificPopup.close();
			
			return false;
		});
		
		giftbox_buy.on('submit', function () {
			if (is_gbx_xhr) {
				return false;
			}
			
			var cart_total = parseInt(side_cart.find('.cart-total').text());
			
			var form_data = {
				pid: $(this).data('pid')
			};
			
			is_gbx_xhr = true;
			gb_active_btn.addClass("anim").prop('disabled', true).text('Добавляю...');
			
			add_to_box_xhr = $.ajax({ type: "POST", url: "/ajax/addtocart", data: form_data, cache: false, dataType: "json", success: function success(arr) {
				is_gbx_xhr = false;
				
				if (cart_total != arr.total) {
					if (arr.total) {
						side_cart.removeClass('empty');
						} else {
						side_cart.addClass('empty');
					}
					
					if (Modernizr.cssanimations) {
						top_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$(this).removeClass('animated pulse'); // flash pulse
						}).addClass('animated pulse').text(arr.total);
						side_cart.find('.cart-total').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$(this).removeClass('animated pulse'); // pulse
						}).addClass('animated pulse').text(arr.total);
						} else {
						top_cart.find('.cart-total').text(arr.total);
						side_cart.find('.cart-total').text(arr.total);
					}
				}
				
				if (arr.error == "Y") {
					gb_active_btn.removeClass("anim").prop('disabled', false).text('Купить');
					showNotification(arr.errorCode, 'error');
					} else {
					giftbox_buy.addClass('in-box');
					gb_active_btn.removeClass("anim").text('В корзине');
					
					window.location = '/cart';
				}
				}, error: function error(jqXHR, textStatus, errorThrown) {
				is_gbx_xhr = false;
				gb_active_btn.removeClass("anim").prop('disabled', false).text('Купить');
				
				var arr = $.parseJSON(jqXHR.responseText);
				
				showNotification(arr.errorCode, 'error');
				
				// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
			}
			});
			
			return false;
		});
	}
	
	if ($('#gbi').find('.gbi-more').length) {
		$('#gbi').find('.gbi-more').click(function () {
			$(this).next().removeClass('hidden').end().remove();
			
			return false;
		});
	}
	
	if ($("#gift-tabs").length) {
		var tabs = $("#gift-tabs");
		var panes = $("#gift-panes");
		var boxes = panes.find(".gift-pane");
		
		tabs.find("a").on("click", null, function () {
			if ($(this).hasClass('current')) {
				return false;
			}
			
			$(this).addClass("current").parent().siblings().children().removeClass("current");
			boxes.removeClass("visible");
			boxes.eq($(this).parent().index()).addClass("visible");
			
			$(document.body).trigger("sticky_kit:recalc");
			
			return false;
		});
	}
	
	if ($('#gift-form').length) {
		var gift_form = $('#gift-form'),
		gf_loading = gift_form.find('.send-btn'),
		gf_xhr,
		is_gf_xhr = false,
		gf_err = false;
		
		$('#gf-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
		
		$('#gift-form-pane').on('click', '#gf-more', function () {
			$(this).parent().remove();
			gf_err = false;
			gift_form.show();
			gift_form.find('input:not([type=hidden]), textarea').val('');
			gift_form.find('.popup-msg').remove();
			$('#gf-name').focus();
			
			return false;
		});
		
		gift_form.submit(function () {
			if (is_gf_xhr) return false;
			
			$(this).find('input, textarea').blur();
			
			var gf_name_input = $(this).find("#gf-name"),
			gf_phone_input = $(this).find("#gf-phone"),
			gf_mail_input = $(this).find("#gf-mail"),
			gf_msg_ta = $(this).find("#gf-msg"),
			gf_name = $.trim(gf_name_input.val()),
			gf_phone = $.trim(gf_phone_input.val()),
			gf_mail = $.trim(gf_mail_input.val()),
			gf_msg = $.trim(gf_msg_ta.val());
			
			if (gf_name == "") gf_name_input.val("");
			
			if (gf_phone == "") gf_phone_input.val("");
			
			if (gf_mail == "") gf_mail_input.val("");
			
			if (gf_msg == "") gf_msg_ta.val("");
			
			var gf_has_err = false,
			gf_err_msg = '';
			
			if (gf_name == "" || gf_msg == "" || gf_phone == "" && gf_mail == "") {
				gf_has_err = true;
				gf_err_msg = messages.validate.required;
				} else if (gf_phone != "" && !patterns.phone.test(gf_phone)) {
				gf_has_err = true;
				gf_err_msg = messages.validate.phone;
				} else if (gf_mail != "" && !patterns.email.test(gf_mail)) {
				gf_has_err = true;
				gf_err_msg = messages.validate.email;
			}
			
			if (gf_has_err) {
				if (gf_err) {
					$(this).children(".gift-msg").html(gf_err_msg);
					} else {
					gf_err = true;
					$('<p class="gift-msg error">' + gf_err_msg + '</p>').prependTo($(this));
				}
				} else {
				is_gf_xhr = true;
				gf_loading.addClass("anim").prop('disabled', true).text('Отправляю...');
				
				var form = $(this);
				var form_data = $(this).serialize();
				
				gf_xhr = $.ajax({ type: "POST", url: "/ajax/ask", data: form_data, cache: false, dataType: "json", success: function success(arr) {
					is_gf_xhr = false;
					gf_loading.removeClass("anim").prop('disabled', false).text('Отправить');
					
					if (arr.error == "Y") {
						if (gf_err) {
							form.children(".gift-msg").html(arr.errorCode);
							} else {
							gf_err = true;
							$('<p class="gift-msg error">' + arr.errorCode + '</p>').prependTo(form);
						}
						} else {
						gf_err = false;
						form.hide().children(".gift-msg").remove();
						form.before('<p class="gift-msg success">' + arr.msg + '</p>');
					}
					}, error: function error(jqXHR, textStatus, errorThrown) {
					is_gf_xhr = false;
					gf_loading.removeClass("anim").prop('disabled', false).text('Отправить');
					
					if (gf_err) {
						form.children(".gift-msg").text(messages.errors.ajax);
						} else {
						gf_err = true;
						$('<p class="gift-msg error">' + messages.errors.ajax + '</p>').prependTo(form);
					}
					
					// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
				}
				});
			}
			
			return false;
		});
	}
	
	if ($('#write-review').length) {
		var write_review = $('#write-review'),
		review_form = $('#review-form'),
		review_loading = review_form.find('.send-btn'),
		review_xhr,
		is_review_xhr = false,
		review_err = false;
		
		write_review.click(function () {
			review_err = false;
			review_form.find('input:not([type=hidden]), textarea').val('');
			review_form.find('.review-msg').remove();
			review_form.next('.review-msg').remove();
			review_form.toggleClass('hidden');
			
			return false;
		});
		
		if (window.location.hash == '#review') {
			write_review.click();
			$(document).scrollTop(write_review.offset().top - 10);
		}
		
		review_form.submit(function () {
			if (is_review_xhr) return false;
			
			$(this).find('input, textarea').blur();
			
			var review_giftid_input = $(this).find("#rf-giftid"),
			review_name_input = $(this).find("#rf-author"),
			review_mail_input = $(this).find("#rf-mail"),
			review_msg_ta = $(this).find("#rf-review"),
			review_giftid = parseInt(review_giftid_input.val()),
			review_name = $.trim(review_name_input.val()),
			review_mail = $.trim(review_mail_input.val()),
			review_msg = $.trim(review_msg_ta.val());
			
			if (review_name_input.parent().is(':hidden')) {
				var review_scenario = 'auth';
				} else {
				var review_scenario = 'default';
			}
			
			if (review_name == "") review_name_input.val("");
			
			if (review_mail == "") review_mail_input.val("");
			
			if (review_msg == "") review_msg_ta.val("");
			
			var review_has_err = false,
			review_err_msg = '';
			
			if (!(review_giftid > 0)) {
				review_has_err = true;
				review_err_msg = messages.errors.ajax;
				} else if (review_scenario == 'default' && (review_name == "" || review_mail == "" || review_msg == "")) {
				review_has_err = true;
				review_err_msg = messages.validate.required;
				} else if (review_scenario == 'auth' && review_msg == "") {
				review_has_err = true;
				review_err_msg = messages.validate.required;
				} else if (review_mail != "" && !patterns.email.test(review_mail)) {
				review_has_err = true;
				review_err_msg = messages.validate.email;
			}
			
			if (review_has_err) {
				if (review_err) {
					$(this).children(".review-msg").html(review_err_msg);
					} else {
					review_err = true;
					$('<p class="review-msg error">' + review_err_msg + '</p>').prependTo($(this));
				}
				} else {
				is_review_xhr = true;
				review_loading.prop('disabled', true).text('Отправляю...');
				
				var form = $(this);
				var form_data = $(this).serialize();
				
				review_xhr = $.ajax({ type: "POST", url: "/ajax/review", data: form_data, cache: false, dataType: "json", success: function success(arr) {
					is_review_xhr = false;
					review_loading.prop('disabled', false).text('Отправить');
					
					if (arr.error == "Y") {
						if (review_err) {
							form.children(".review-msg").html(arr.errorCode);
							} else {
							review_err = true;
							$('<p class="review-msg error">' + arr.errorCode + '</p>').prependTo(form);
						}
						
						if (arr.scenario == 'default') {
							form.find('p').show();
							} else {
							review_name_input.parent().hide();
							review_mail_input.parent().hide();
						}
						} else {
						review_err = false;
						form.addClass('hidden').children(".review-msg").remove();
						form.after('<p class="review-msg success">' + arr.msg + '</p>');
					}
					}, error: function error(jqXHR, textStatus, errorThrown) {
					is_review_xhr = false;
					review_loading.prop('disabled', false).text('Отправить');
					
					if (review_err) {
						form.children(".review-msg").text(messages.errors.ajax);
						} else {
						review_err = true;
						$('<p class="review-msg error">' + messages.errors.ajax + '</p>').prependTo(form);
					}
					
					//console.log('Loader Error:\n' + errorThrown + ' ' + textStatus );
				}
				});
			}
			
			return false;
		});
	}
	
	if ($('#reviews').length) {
		var container = $('#reviews'),
		load_more = $('#load-more'),
		current_page = 1,
		is_loading = false;
		
		/*load_more.waypoint(function(direction) {
        	is_loading = true;
        	$(this).addClass('loading');
        	
        	$(this).waypoint('disable');
        	
        	var form_data = $(this).data();
        	form_data.page = ++current_page;
        	
        	$.ajax({type:"GET", url: "/ajax/loaddata", data: form_data, cache: false, dataType: "json", success: function(arr) {
			is_loading = false;
			load_more.removeClass("loading");
			
			container.append(arr.html);
			current_page = arr.page;
			
			if(arr.last == "Y") {
			load_more.waypoint('destroy');
			// load_more.remove();
			}
			else {
			$.waypoints('refresh');
			load_more.waypoint('enable');
			}
			},
			error: function(){
			is_loading = false;
			load_more.removeClass("loading").waypoint('destroy');
			
			current_page = -1;
			// load_more.remove();
			}
        	});
			}, {
			offset: function() {
            return $.waypoints('viewportHeight') - 50;
			}
		});*/
	}
	
	if ($('#news').length) {
		var container = $('#news'),
		load_more = $('#load-more'),
		current_page = 1,
		is_loading = false;
		
		/*load_more.waypoint(function(direction) {
        	is_loading = true;
        	$(this).addClass('loading');
        	
        	$(this).waypoint('disable');
        	
        	var form_data = $(this).data();
        	form_data.page = ++current_page;
        	
        	$.ajax({type:"GET", url: "/ajax/loaddata", data: form_data, cache: false, dataType: "json", success: function(arr) {
			is_loading = false;
			load_more.removeClass("loading");
			
			container.append(arr.html);
			current_page = arr.page;
			
			if(arr.last == "Y") {
			load_more.waypoint('destroy');
			// load_more.remove();
			}
			else {
			$.waypoints('refresh');
			load_more.waypoint('enable');
			}
			},
			error: function(){
			is_loading = false;
			load_more.removeClass("loading").waypoint('destroy');
			
			current_page = -1;
			// load_more.remove();
			}
        	});
			}, {
			offset: function() {
            return $.waypoints('viewportHeight') - 50;
			}
		});*/
	}
	
	if ($('#make-order').length || $('#activate-wrap').length) {
		/*$.datepicker.regional["ru"] = {
        	closeText: "Закрыть",
        	prevText: "Предыдущий месяц",
        	nextText: "Следующий месяц",
        	currentText: "Сегодня",
        	monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
			'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        	monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
			'Июл','Авг','Сен','Окт','Ноя','Дек'],
        	dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        	dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        	dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        	weekHeader: "Не",
        	firstDay: 1,
        	isRTL: false,
        	showMonthAfterYear: false,
        	yearSuffix: ""
			};
			$.extend($.datepicker,{
        	_checkOffset: function(inst,offset,isFixed){
			offset.top += 10;
			return offset;
        	}
		});*/
	}
	
	if ($('#make-order').length) {
		var emailCertificateDirect = function emailCertificateDirect() {
			if ($('#order_send_directly').prop('checked')) {
				$('.mail_direct').hide();
				} else {
				$('.mail_direct').show();
			}
		};
		
		var changeDelivery = function changeDelivery(id) {
			$('.delivery__hidden').hide();
			$('.delivery__show-' + id).show();
			
			reg_xhr = $.ajax({
				type: "POST",
				url: "/ajax/setDelivery",
				data: { id: id, widSid: widgetSid },
				cache: false,
				dataType: "json",
				success: function success(arr) {
					$('.js-order-delivery-price').text(arr.delivery);
					$('.mo-total-amount').text(arr.total);
				}
			});
		};
		
		var changeCover = function changeCover(id) {
			reg_xhr = $.ajax({
				type: "POST",
				url: "/ajax/setCover",
				data: { id: id, widSid: widgetSid  },
				cache: false,
				dataType: "json",
				success: function success(arr) {
					$('.js-order-cover-price').text(arr.cover);
					$('.mo-total-amount').text(arr.total);
				}
			});
		};
		
		var cartAjax = function cartAjax(form_data) {
			is_mo_xhr = true;
			
			//mo_timer = setTimeout(function() {
			mo_loading.addClass('visible').children().addClass('loading');
		//}, 65);
		
		mo_xhr = $.ajax({ type: "POST", url: "/ajax/cart", data: form_data, cache: false, dataType: "json", success: function success(arr) {
			is_mo_xhr = false;
			//if (mo_timer) {
			//clearTimeout(mo_timer);
			mo_loading.removeClass('visible').children().removeClass('loading');
			//window.location.reload();
			//mo_timer = null;
		//}
		
		top_cart.find('.cart-total').text(arr.total);
		
		if (arr.total == 0) {
			mo.after(arr.cart);
			mo.remove();
			} else {
			mo_cart.html(arr.cart);
			mo_total_amount.text(arr.amount);
			
			/*
				$('#delivery-' + arr.delivery).prop('checked', true);
				//$('#pay-' + arr.payment).prop('checked', true);
				$('#pay-1').prop('checked', true);
				
				$.each(arr.user, function(field, value) {
				mo_personal.find('[name="'+ field +'"]').val(value);
				});
			*/
		}
		
		if (arr.msg != '') {
			showNotification(arr.msg);
		}
		}, error: function error(jqXHR, textStatus, errorThrown) {
		is_mo_xhr = false;
		//if (mo_timer) {
		//clearTimeout(mo_timer);
		mo_loading.removeClass('visible').children().removeClass('loading');
		//mo_timer = null;
		//}
		
		var arr = $.parseJSON(jqXHR.responseText);
		
		showNotification(arr.errorCode, 'error');
		
		// console.log('Loader Error:\n' + textStatus + ' ' + errorThrown );
		}
	});
};

var enterHandler = function enterHandler(e) {
	if (e.which == 13) {
		$(this).blur();
		
		return false;
	}
};

var focusHandler = function focusHandler(e) {
	prev_qty = parseInt($(this).val());
};

var cartHandler = function cartHandler(e) {
	if (is_mo_xhr) {
		return false;
	}
	
	var type,
	index = $(this).parent().data('index'),
	ci_wrap = $(this).parent().parent().parent();
	
	mo_loading.children().css({ top: ci_wrap.position().top + 20 + ci_wrap.height() / 2 - 18 });
	
	if (e.type == 'change') {
		type = 'change';
		} else if ($(this).hasClass('ci-qty-minus')) {
		type = 'minus';
		} else if ($(this).hasClass('ci-qty-plus')) {
		type = 'plus';
		} else if ($(this).hasClass('ci-del')) {
		type = 'del';
	}
	
	if (type == 'minus' || type == 'plus') {
		var current_input = $(this).parent().find('input'),
		current_qty = parseInt(current_input.val()),
		qty = 0;
		
		if (type == 'minus') {
			qty = --current_qty;
			} else {
			qty = ++current_qty;
		}
		
		if (current_qty == 99 && qty > 99) {
			return false;
			} else if (qty < 0) {
			qty = 1;
			} else if (qty == 0) {
			current_input.val(qty.toString());
			$(this).parent().find('.ci-del').click();
			
			return false;
		}
		
		current_input.val(qty.toString());
		
		var form_data = { type: 'update', index: index, qty: qty };
		} else if (type == 'del') {
		var form_data = { type: 'remove', index: index };
		
		ci_wrap.addClass('hidden');
		
		if (Modernizr.csstransitions) {
			del_timer = true;
			
			setTimeout(function () {
				ci_wrap.remove();
				cartAjax(form_data);
				del_timer = false;
			}, 300);
			} else {
			ci_wrap.remove();
		}
		} else if (type == 'change') {
		var qty = parseInt($(this).val()),
		tmp_total = 0;
		
		if (isNaN(qty) || qty < 0) {
			qty = 1;
			} else if (qty > 99) {
			qty = 99;
		}
		
		if (prev_qty == 99 && qty > 99) {
			return false;
			} else if (qty < 0) {
			qty = 1;
			} else if (qty == 0) {
			$(this).val(qty.toString());
			$(this).parent().find('.ci-del').click();
			
			return false;
		}
		
		$(this).val(qty.toString());
		
		var form_data = { type: 'update', index: index, qty: qty };
		
		// showNotification('del ' + index, 'error');
	}
	
	if (!del_timer) {
		cartAjax(form_data);
	}
	
	return false;
};

var mo = $('#make-order'),
is_mo_xhr = false,
mo_cart = $('#mo-cart'),
mo_form_mail = $('#emailCert'),
mo_form_box = $('#boxCert'),
mo_form = $('#mo-form'),
mo_personal = $('#mo-personal-data'),
mo_delivery = $('#mo-delivery'),
mo_pay = $('#mo-pay-data'),
mo_total_amount = $('.mo-total-amount'),
mo_loading = $('#mo-loading'),
mo_timer;

// set placeholders
mo_personal.find('input, textarea').attr('placeholder');
$('input[type="tel"]').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });

/*$('#delivery-date, #delivery-date-mail').datepicker({
	showAnim: "",
	minDate: 0,
	defaultDate: +1,
	showOtherMonths: true,
	selectOtherMonths: false,
	changeMonth: false,
	changeYear: false,
	numberOfMonths: 1,
	dateFormat: 'dd.mm.yy'
}).datepicker("option", $.datepicker.regional['ru']);*/

mo.on('change', '.js-order-delivery', function () {
	changeDelivery($(this).val());
});
mo.on('change', '.js-order-cover', function () {
	changeCover($(this).val());
});

mo.on('change', '#order_send_directly', function () {
	emailCertificateDirect();
});

$('.js-select-cert-email').click(function () {
	changeCover(0);
	changeDelivery(4);
});
$('.js-select-cert-box').click(function () {
	var currentDelivery = $('.js-order-delivery:checked').val();
	if (currentDelivery == undefined) {
		$('.js-order-delivery').first().prop('checked', true);
		currentDelivery = $('.js-order-delivery:checked').val();
	}
	
	var currentCover = $('.js-order-cover:checked').val();
	if (currentCover == undefined) {
		$('.js-order-cover').first().prop('checked', true);
		currentCover = $('.js-order-cover:checked').val();
	}
	
	console.log(currentDelivery);
	console.log(currentCover);
	
	changeDelivery(currentDelivery);
	changeCover(currentCover);
});

if ($('.js-select-cert-box').hasClass('active')) {
	var currentDelivery = $('.js-order-delivery:checked').val();
	var currentCover = $('.js-order-cover:checked').val();
	if (currentCover == undefined) {
		$('.js-order-cover').first().prop('checked', true);
		currentCover = $('.js-order-cover:checked').val();
	}
	
	console.log(currentDelivery);
	console.log(currentCover);
	
	changeDelivery(currentDelivery);
	changeCover(currentCover);
	} else {
	changeCover(0);
	changeDelivery(4);
	emailCertificateDirect();
}

mo_delivery.on('change', 'input', function () {
	if ($(this).val() == 1 || $(this).val() == 2) {
		mo_personal.find('.mo-address').show().find('input, select').prop('disabled', false);
		} else if ($(this).val() == 3 || $(this).val() == 4) {
		mo_personal.find('.mo-address').hide().find('input, select').prop('disabled', true);
	}
});

mo_delivery.find('input:checked').change();

var prev_qty,
del_timer = false;

mo_cart.on('click', '.btn', cartHandler);
mo_cart.on('change', 'input', cartHandler);
mo_cart.on('focus', 'input', focusHandler);
mo_cart.on('keypress', 'input', enterHandler);

mo_form_box.on('submit', function (event) {
	event.preventDefault();
	if (is_mo_xhr) return false;
	
	is_mo_xhr = true;
	var $loadBar = mo_form_mail.find('.load-bar');
	$loadBar.addClass('active');
	
	mo_xhr = $.ajax({
		type: "POST",
		url: "/ajax/order",
		data: $(this).serialize(),
		cache: false,
		dataType: "json",
		success: function success(arr) {
			is_mo_xhr = false;
			$loadBar.removeClass('active');
			
			if (arr.thankYou == 'Y') {
				window.location.replace(`/thank-you${widgetSid ? `?widSid=${widgetSid}`: ''}`);
			}
			
			top_cart.find('.cart-total').text(arr.total);
			
			if (arr.total == 0) {
				mo.after(arr.cart);
				mo.remove();
				} else {
				mo_cart.html(arr.cart);
				mo_total_amount.text(arr.amount);
				
				if (arr.error == 'Y') {
					mo_form_box.find('.error').remove();
					mo_form_box.append(arr.errorCode);
					
					if (arr.errorFields.length > 0) {
						for (var i = 0; i < arr.errorFields.length; i++) {
							mo_form_box.find('[name="order[' + arr.errorFields[i] + ']"]').addClass('error_field');
						}
					}
				}
			}
		},
		error: function error(jqXHR, textStatus, errorThrown) {
			is_mo_xhr = false;
			$loadBar.removeClass('active');
			
			var arr = $.parseJSON(jqXHR.responseText);
			
			showNotification(arr.errorCode, 'error');
		}
	});
});
mo_form_mail.on('submit', function (event) {
	event.preventDefault();
	mo_form_mail.find('.error_field').removeClass('error_field');
	if (is_mo_xhr) return false;
	
	is_mo_xhr = true;
	var $loadBar = mo_form_mail.find('.load-bar');
	$loadBar.addClass('active');
	
	mo_xhr = $.ajax({
		type: "POST",
		url: "/ajax/order",
		data: $(this).serialize(),
		cache: false,
		dataType: "json",
		success: function success(arr) {
			is_mo_xhr = false;
			if (arr.thankYou == 'Y') {
				window.location.replace(`/thank-you${widgetSid ? `?widSid=${widgetSid}`: ''}`);
				} else {
				$loadBar.removeClass('active');
			}
			
			top_cart.find('.cart-total').text(arr.total);
			
			if (arr.total == 0) {
				mo.after(arr.cart);
				mo.remove();
				} else {
				mo_cart.html(arr.cart);
				mo_total_amount.text(arr.amount);
				
				if (arr.error == 'Y') {
					mo_form_mail.find('.error').remove();
					mo_form_mail.append(arr.errorCode);
					
					if (arr.errorFields.length > 0) {
						for (var i = 0; i < arr.errorFields.length; i++) {
							mo_form_mail.find('[name="order[' + arr.errorFields[i] + ']"]').addClass('error_field');
						}
					}
				}
			}
		},
		error: function error(jqXHR, textStatus, errorThrown) {
			is_mo_xhr = false;
			$loadBar.removeClass('active');
			
			var arr = $.parseJSON(jqXHR.responseText);
			
			showNotification(arr.errorCode, 'error');
		}
	});
});
}

if ($('#activate-wrap').length) {
	var activateAjax = function activateAjax(form_data, step) {
		is_a_xhr = true;
		a_loading.addClass('visible').children().addClass('loading');
		
		$.ajax({ type: "POST", url: "/ajax/activate", data: form_data, cache: false, dataType: "json", success: function success(arr) {
			is_a_xhr = false;
			a_loading.removeClass('visible').children().removeClass('loading');
			
			if (arr.error == 'Y') {
				if (typeof arr.html != 'undefined') {
					a_wrap.find(':first').remove();
					a_wrap.prepend(arr.html);
					a_step.html('шаг ' + arr.step + ' из 3');
					
					var offset = a_wrap.offset().top - 90;
					
					if ($(document).scrollTop() != offset) {
						$('html, body').animate({ scrollTop: offset }, 300);
					}
					
					if (arr.step == 1) {
						a_certificate = null;
						a_gift = null;
						//$('#activate-num').inputmask({ 'mask': '999 999 999 999', showMaskOnHover: false });
					}
					
					if (a_wrap.find('.error').length) {
						a_error = true;
						} else {
						a_error = true;
					}
					} else {
					if (a_error) {
						a_wrap.find('.error').html(arr.errorCode);
						} else {
						a_error = true;
						if (arr.step == 1) {
							a_wrap.find('.activate-num').prepend('<div class="error">' + arr.errorCode + '</div>');
							} else if (arr.step == 3) {
							a_wrap.find('.activate-client').prepend('<div class="error">' + arr.errorCode + '</div>');
							
							var offset = a_wrap.offset().top - 90;
							
							if ($(document).scrollTop() != offset) {
								$('html, body').animate({ scrollTop: offset }, 300);
							}
							} else {
							a_wrap.find(':first').prepend('<div class="error">' + arr.errorCode + '</div>');
							
							var offset = a_wrap.offset().top - 90;
							
							if ($(document).scrollTop() != offset) {
								$('html, body').animate({ scrollTop: offset }, 300);
							}
						}
					}
				}
				} else {
				if (arr.thankYou == 'Y') {
					window.location.replace('/activate-thank-you');
					return;
				}
				
				a_error = false;
				
				a_wrap.find(':first').remove();
				a_wrap.prepend(arr.html);
				a_step.html('шаг ' + arr.step + ' из 3');
				
				var offset = a_wrap.offset().top - 90;
				
				if ($(document).scrollTop() != offset) {
					$('html, body').animate({ scrollTop: offset }, 300);
				}
				
				if (arr.step == 1) {
					a_certificate = null;
					a_gift = null;
					//$('#activate-num').inputmask({ 'mask': '999 999 999 999', showMaskOnHover: false });
					} else if (arr.step == 2) {
					a_certificate = arr.certificate;
					a_gift = null;
					} else if (arr.step == 3) {
					a_certificate = arr.certificate;
					a_gift = arr.gift;
					
					$('#activate-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
					
					// disable first five dates
					var disabled_dates = [],
					today = new Date();
					
					for (var i = 0; i <= 5; i++) {
						if (i > 0) {
							var disabled_day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
							} else {
							var disabled_day = today;
						}
						
						var dd = disabled_day.getDate();
						var mm = disabled_day.getMonth() + 1;
						var yyyy = disabled_day.getFullYear();
						
						if (dd < 10) {
							dd = '0' + dd;
						}
						
						if (mm < 10) {
							mm = '0' + mm;
						}
						
						disabled_dates.push(dd + '.' + mm + '.' + yyyy);
					}
					
					// attach datepicker
					/*$('#date-1, #date-2, #date-3').datepicker({
						showAnim: "",
						minDate: 0,
						defaultDate: +6,
						showOtherMonths: true,
						selectOtherMonths: false,
						changeMonth: false,
						changeYear: false,
						numberOfMonths: 1,
						dateFormat: 'dd.mm.yy'/*,
						beforeShowDay: function(date){
						var string = $.datepicker.formatDate('dd.mm.yy', date);
						return [ disabled_dates.indexOf(string) == -1 ]
						}
						});
					$('#date-1, #date-2, #date-3').datepicker("option", $.datepicker.regional['ru']);*/
					
					$('#time-1, #time-2, #time-3').inputmask({ 'mask': 'h:s', 'repeat': 0, showMaskOnHover: false });
				}
				
				//showNotification(arr.msg);
			}
			}, error: function error(jqXHR, textStatus, errorThrown) {
			is_a_xhr = false;
			a_loading.removeClass('visible').children().removeClass('loading');
			
			var arr = $.parseJSON(jqXHR.responseText);
			
			if (a_error) {
				a_wrap.find('.error').html(arr.errorCode);
				} else {
				a_error = true;
				if (step == 1) {
					a_wrap.find('.activate-num').prepend('<div class="error">' + arr.errorCode + '</div>');
					} else if (step == 3) {
					a_wrap.find('.activate-client').prepend('<div class="error">' + arr.errorCode + '</div>');
					} else {
					a_wrap.find(':first').prepend('<div class="error">' + arr.errorCode + '</div>');
				}
			}
		}
		});
	};
	
	var a_wrap = $('#activate-wrap'),
	a_step = a_wrap.prev(),
	a_error = false,
	is_a_xhr = false,
	a_loading = $('#a-loading'),
	a_timer,
	a_certificate,
	a_gift;
	
	//date & time aliases
	Inputmask.extendDefinitions({
		'h': { //hours
			validator: '[01][0-9]|2[0-3]',
			cardinality: 2,
			prevalidator: [{ validator: '[0-2]', cardinality: 1 }]
		},
		's': { //seconds || minutes
			validator: '[0-5][0-9]',
			cardinality: 2,
			prevalidator: [{ validator: '[0-5]', cardinality: 1 }]
		}
	});
	
	//$('#activate-num').inputmask({ 'mask': '999 999 999 999', showMaskOnHover: false });
	
	a_wrap.on('submit', '#activate-1', function () {
		if (is_a_xhr) {
			return false;
		}
		
		$(this).find('input, textarea, select').blur();
		
		if (!patterns.certificate.test($(this).find('input[type=tel]').val())) {
			if (a_error) {
				a_wrap.find('.error').html(messages.validate.certificate);
				} else {
				a_error = true;
				a_wrap.find('.activate-num').prepend('<div class="error">' + messages.validate.certificate + '</div>');
			}
			
			return false;
		}
		
		activateAjax($(this).serialize() + '&step=1', 1);
		
		return false;
	});
	
	a_wrap.on('click', '#activate-gifts a.btn', function () {
		if (is_a_xhr) {
			return false;
		}
		
		var form_data = {
			activate: {
				certificate: a_certificate,
				gift: $(this).data('id')
			},
			step: 2
		};
		
		activateAjax(form_data, 2);
		
		return false;
	});
	
	a_wrap.on('click', '#ag-back', function () {
		if (is_a_xhr) {
			return false;
		}
		
		var form_data = {
			activate: {
				certificate: a_certificate,
				gift: a_gift
			},
			step: 4
		};
		
		activateAjax(form_data, 4);
		
		return false;
	});
	
	a_wrap.on('submit', '#activate-3', function () {
		if (is_a_xhr) {
			return false;
		}
		
		activateAjax($(this).serialize() + '&' + $.param({ activate: { certificate: a_certificate, gift: a_gift } }) + '&step=3', 3);
		
		return false;
	});
}

if ($("#map").length) {
	var map = $("#map"),
	myMap,
	map_lat = parseFloat(map.data("lat")),
	map_lng = parseFloat(map.data("lng")),
	map_title = map.data("title"),
	map_tip = map.data("tip"),
	ya_init = function ya_init() {
		ymaps.ready(function () {
			myMap = new ymaps.Map('map', {
				center: [map_lat, map_lng],
				zoom: 15,
				controls: ['geolocationControl', 'fullscreenControl']
			});
			
			myMap.controls.add(new ymaps.control.TypeSelector(['yandex#map', 'yandex#satellite', 'yandex#hybrid', 'yandex#publicMap']));
			myMap.controls.add(new ymaps.control.ZoomControl({ options: { size: 'small' } }));
			
			myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
				balloonContentBody: ['<strong>' + map_title + '</strong>', '<br>', map_tip].join('')
				}, {
				preset: 'islands#icon',
				iconColor: '#e21c8e'
			});
			
			myMap.geoObjects.add(myPlacemark);
		});
	};
	
	$.getScript("http://api-maps.yandex.ru/2.1/?lang=ru_RU", ya_init);
	
	$('#print').click(function () {
		window.print();
		
		return false;
	});
}

if ($('#pass-msg').length) {
	var offset = $('#pass-msg').offset().top - 50;
	
	if ($(document).scrollTop() != offset) {
		$('html, body').animate({ scrollTop: offset }, 300);
	}
}

if ($('#partnerModal').length) {
	/*$.datepicker.regional["ru"] = {
		closeText: "Закрыть",
		prevText: "Предыдущий месяц",
		nextText: "Следующий месяц",
		currentText: "Сегодня",
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: "Не",
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ""
	};*/
	
	/*$.extend($.datepicker,{
		_checkOffset: function(inst,offset,isFixed){
		offset.top += 10;
		return offset;
		}
	});*/
	
	/*$('#partnerRoomDateStart').datepicker({
		showAnim: "",
		defaultDate: +1,
		showOtherMonths: true,
		selectOtherMonths: false,
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		dateFormat: 'dd.mm.yy'
        }).datepicker("option", $.datepicker.regional['ru']);
		$('#partnerRoomDateEnd').datepicker({
		showAnim: "",
		defaultDate: +1,
		showOtherMonths: true,
		selectOtherMonths: false,
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		dateFormat: 'dd.mm.yy'
	}).datepicker("option", $.datepicker.regional['ru']);*/
	
	$('#certificateConfirmationCode').inputmask({ 'mask': '999', showMaskOnHover: false });
	$('#partnerActivationDate').inputmask({ 'mask': '99.99.9999', showMaskOnHover: false });
}

$('#partnerModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget); // Button that triggered the modal
	var id = button.data('id'); // Extract info from data-* attributes
	var code = button.data('code'); // Extract info from data-* attributes
	// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
	var modal = $(this);
	modal.find('.modal-body #activationId').val(id);
	modal.find('.modal-body #activationCode').text(code);
});
});

function getScreenSize() {
	return {
		x: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		y: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	};
}
var screenSize = getScreenSize();

/*function setFooterContactsPosition() {
	var footerNode = $('.footer'),
	contactsNode = $('.footer__contacts'),
	beforeNode = $('.footer__right');
	
	if (screenSize.x > 767 && screenSize.x < 1024) {
		footerNode.insertBefore(contactsNode, beforeNode);
	}
}
setFooterContactsPosition();*/

window.addEventListener('resize', function () {
	screenSize = getScreenSize();
}, true);


var messages = {
	validate: {
		required: 'Поля обязательные для заполнения.',
		stringMaxLength: 'Длинна поля {0} не должна превышать {1} символ{2}.',
		stringMinLength: 'Длинна поля {0} должна быть не менее {1} символ{2}.',
		stringRange: 'Длинна поля {0} должна быть от {1} до {2} символ{3}.',
		compare: 'Поля {0} и {1} не совпадают.',
		phone: 'Вы ввели телефон в неверном формате, корректный формат +7 (111) 111-11-11.',
		email: 'Вы ввели e-mail в неверном формате, корректный формат mail@domain.com.',
		certificate: 'Введите, пожалуйста, номер сертификата в формате 111 222 333 444.'
	},
	errors: {
		data: 'Ошибка данных.',
		ajax: 'Ошибка при отправке формы! Попробуйте позже или свяжитесь с менеджером по телефону указанному на сайте.'
	}
};

var patterns = {
	phone: /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/,
	certificate: /^\d{3} \d{3} \d{3} \d{3}$/,
	certificateConfirm: /^\d{3}$/
};

var masks = {
	phone: '+7 (999) 999-99-99',
	certificate: '999 999 999 999',
	time: '99:99'
};

function showNotification(message, type) {
	var color = 'green';
	switch (type) {
		case 'error':
		color = 'red';break;
	}
	new jBox('Notice', { content: message, color: color });
}

function isEmpty(str) {
	return !str || 0 === str.length;
}

$.fn.isInViewport = function () {
	if ($(this).length == 0) {
		return false;
	}
	
	var elementTop = $(this).offset().top;
	var elementBottom = elementTop + $(this).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	return elementBottom > viewportTop && elementTop < viewportBottom;
};

$('.seo-promo').click(function () {
	$('.seo-promo').toggleClass("seo-promo__active");
});
$('.catalog__description').click(function () {
	$('.catalog__description').toggleClass("catalog__description__active");
});
(function () {
	$(document).find('[mask-phone]').each(function () {
		$(this).inputmask({ 'mask': masks.phone, showMaskOnHover: false });
	});
	
	$(document).find('[mask-certificate]').each(function () {
		$(this).inputmask({ 'mask': masks.certificate, showMaskOnHover: false });
	});
})();
(function () {
	if (!$('.breadcrumbs').length) {
		return;
	}
	
	var lastLink = $('.breadcrumbs>a').last().attr('href');
	
	$('#MainCategoryMenu .menu__item').each(function () {
		var $this = $(this);
		var href = $this.attr('href');
		
		if (window.location.href.indexOf(href) != -1 || href === lastLink) {
			$this.addClass('menu__item menu__item_active');
		}
	});
})();
var validation = {
	successMessageClass: 'validation_type_success',
	errorMessageClass: 'validation_type_error',
	errorInputClass: 'input_type_error',
	
	writeSuccess: function writeSuccess(messageForm, message) {
		this.writeMessage(messageForm, this.successMessageClass, message);
	},
	writeError: function writeError(messageForm, message) {
		this.writeMessage(messageForm, this.errorMessageClass, message);
	},
	writeMessage: function writeMessage(messageForm, messageType, message) {
		if (messageForm === null || messageForm === undefined || messageForm.length == 0) {
			console.log('writeValidationMessage: invalidMessageForm');
			return;
		}
		
		var validation = messageForm.find('.validation');
		if (validation.length > 0) {
			validation.removeClass(this.successMessageClass);
			validation.removeClass(this.errorMessageClass);
			validation.addClass(messageType);
			
			validation.html(message);
			} else {
			messageForm.append('<p class="validation ' + messageType + '">' + message + '</p>');
		}
	},
	
	markFailureInput: function markFailureInput(selector) {
		var element = this.getElement(selector);
		if (!element.hasClass(this.errorInputClass)) {
			element.addClass(this.errorInputClass);
		}
	},
	reset: function reset(selector) {
		var form = this.getElement(selector);
		form.find('.' + this.errorInputClass).removeClass(this.errorInputClass);
		var validation = form.find('.validation');
		if (!validation) {
			return false;
		}
		validation.removeClass(this.successMessageClass).removeClass(this.errorMessageClass);
	},
	
	getElement: function getElement(selector) {
		if (typeof selector === "string") {
			return $(selector);
		}
		return selector;
	},
	
	validateForm: function validateForm(selector) {
		var that = this;
		
		var form = this.getElement(selector);
		validation.reset(form);
		
		var errors = false;
		
		form.find('[validate-required]').each(function () {
			if (!that.validateRequired(form, $(this))) {
				errors = true;
			}
		});
		form.find('[validate-email]').each(function () {
			if (!that.validateEmail(form, $(this))) {
				errors = true;
			}
		});
		form.find('[validate-phone]').each(function () {
			if (!that.validatePhone(form, $(this))) {
				errors = true;
			}
		});
		return !errors;
	},
	
	validateRequired: function validateRequired(form, selector) {
		var element = this.getElement(selector);
		var value = this.getTrimmedValue(element);
		
		if (value.length === 0) {
			validation.markFailureInput(element);
			this.writeError(form, messages.validate.required);
			return false;
		}
		return true;
	},
	
	validateEmail: function validateEmail(form, selector) {
		var element = this.getElement(selector);
		var value = this.getTrimmedValue(element);
		
		if (value.length === 0) {
			return false;
		}
		if (!patterns.email.test(value)) {
			validation.markFailureInput(element);
			this.writeError(form, messages.validate.email);
			return false;
		}
		return true;
	},
	
	validatePhone: function validatePhone(form, selector) {
		var element = this.getElement(selector);
		var value = this.getTrimmedValue(element);
		
		if (value.length === 0) {
			return false;
		}
		if (!patterns.phone.test(value)) {
			validation.markFailureInput(element);
			this.writeError(form, messages.validate.phone);
			return false;
		}
		return true;
	},
	
	getTrimmedValue: function getTrimmedValue(element) {
		var value = $.trim(element.val());
		
		if (value === "") {
			element.val('');
		}
		
		return element.val();
	}
};

(function () {
	var callback = $('#callback-popup'),
	form = callback.find('form'),
	submitButton = form.find(".js-send"),
	request = void 0,
	requestInProcess = false;
	
	if (screenSize.x > 767) {
		var _popup = new jBox('Modal', {
			attach: '#callback',
			content: callback,
			closeOnClick: false,
			closeButton: 'box',
			
			onCloseComplete: function onCloseComplete() {
				form.find('.input').val('');
				validation.reset(callback);
				
				if (requestInProcess) {
					request.abort();
				}
			}
		});
	}
	
	form.submit(function (event) {
		event.preventDefault();
		
		if (requestInProcess) {
			return false;
		}
		
		if (!validation.validateForm(form)) {
			return false;
		}
		
		form.find('.input').blur();
		
		requestInProcess = true;
		submitButton.prop('disabled', true).text('Отправляю...');
		
		request = $.ajax({
			type: "POST",
			url: "/ajax/callback",
			data: form.serialize(),
			dataType: "json",
			cache: false,
			success: function success(arr) {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Заказать');
				
				if (arr.error == "Y") {
					validation.writeError(form, arr.errorCode);
					} else {
					validation.writeSuccess(form, arr.msg);
					form.find('.input').val('');
					
					setTimeout(function () {
						popup.close();
					}, 3000);
				}
			},
			error: function error() {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Заказать');
				
				validation.writeError(form, messages.errors.ajax);
			}
		});
		
		return false;
	});
})();

(function () {
	var subscribe = $("#subscribe"),
	subscribeButton = subscribe.find("button"),
	requestInProcess = false;
	
	subscribe.submit(function (event) {
		event.preventDefault();
		if (requestInProcess) {
			return false;
		}
		
		var form = $(this);
		if (!validation.validateForm(form)) {
			return false;
		}
		
		requestInProcess = true;
		subscribeButton.prop('disabled', true);
		
		$.ajax({
			type: "POST",
			url: "/ajax/subscribe",
			data: form.serialize(),
			dataType: "json",
			cache: false,
			success: function success(arr) {
				requestInProcess = false;
				subscribeButton.prop('disabled', false);
				
				if (arr.error === "Y") {
					validation.writeError(form, arr.errorCode);
					} else {
					validation.writeSuccess(form, arr.msg);
					
					subscribe.find('.input').val('');
				}
			},
			error: function error() {
				requestInProcess = false;
				subscribeButton.prop('disabled', false);
				
				validation.writeError(form, messages.errors.ajax);
			}
		});
		
		setTimeout(function () {
			validation.reset(form);
		}, 8000);
		return false;
	});
})();
(function () {
	var quickBuyPopup = $('#quick-buy-popup');
	if (!quickBuyPopup.length) {
		return false;
	}
	
	var form = quickBuyPopup.find('form'),
	idInput = quickBuyPopup.find('.quick-buy-popup__id'),
	titleInput = quickBuyPopup.find('.quick-buy-popup__product-name'),
	submitButton = quickBuyPopup.find(".js-send"),
	request = void 0,
	requestInProcess = false,
	popup = new jBox('Modal', {
		content: quickBuyPopup,
		closeOnClick: false,
		closeButton: 'box',
		
		onCloseComplete: function onCloseComplete() {
			idInput.val('');
			titleInput.val('');
		}
	});
	
	$(document).on('click', '.js-quick-buy', function () {
		var self = $(this),
		productId = self.data('pid'),
		productName = self.data('title');
		
		titleInput.text('«' + productName + '»');
		idInput.val(productId);
		
		popup.open();
		return false;
	});
	
	form.submit(function () {
		if (requestInProcess) {
			return false;
		}
		
		if (!validation.validateForm(form)) {
			return false;
		}
		
		form.find('.input').blur();
		
		requestInProcess = true;
		submitButton.prop('disabled', true).text('Отправляю...');
		
		request = $.ajax({
			type: "POST",
			url: "/ajax/quickbuy",
			data: form.serialize(),
			dataType: "json",
			cache: false,
			success: function success(arr) {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Заказать');
				
				if (arr.error == "Y") {
					validation.writeError(form, arr.errorCode);
					} else {
					validation.writeSuccess(form, arr.msg);
					form.find('.input').val('');
					
					setTimeout(function () {
						popup.close();
					}, 5000);
				}
			},
			error: function error() {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Заказать');
				
				validation.writeError(form, messages.errors.ajax);
			}
		});
		
		return false;
	});
})();

(function () {
	var activationPopup = $('#activation-popup');
	if (!activationPopup.length) {
		return false;
	}
	
	var step = 0,
	form = activationPopup,
	submitButton = activationPopup.find(".js-send"),
	request = void 0,
	requestInProcess = false,
	popup = new jBox('Modal', {
		content: activationPopup,
		closeOnClick: false,
		closeButton: 'box',
		repositionOnContent: true,
		
		onCloseComplete: function onCloseComplete() {
			/*idInput.val('');
			titleInput.val('');*/
		}
	});
	
	function addCertificateInputMask(step) {
		if (step === 1) {
			//activationPopup.find('#activate-num').inputmask({ 'mask': masks.certificate });
		}
		if (step === 3) {
			activationPopup.find('#activate-phone').inputmask({ 'mask': masks.phone });
			activationPopup.find('#time-1, #time-2').inputmask({ 'mask': masks.time });
			activationPopup.find('#date-1, #date-2').datepicker({
				showAnim: "",
				minDate: 0,
				defaultDate: 0,
				showOtherMonths: true,
				selectOtherMonths: false,
				changeMonth: false,
				changeYear: false,
				numberOfMonths: 1,
				dateFormat: 'dd.mm.yy'
			}).datepicker("option", $.datepicker.regional['ru']);
		}
	}
	
	$(form).on('click', '.js-back', function () {
		if (requestInProcess) {
			return false;
		}
		
		requestInProcess = true;
		
		request = $.ajax({
			type: "POST",
			url: "/ajax/activate",
			data: {
				back: true
			},
			dataType: "json",
			cache: false,
			success: function success(response) {
				requestInProcess = false;
				
				if (response.error === "Y") {
					validation.writeError(form, response.errorCode);
					} else {
					form.html(response.html);
					popup.setContent(form);
					addCertificateInputMask(response.step);
				}
			},
			error: function error(response) {
				requestInProcess = false;
				var arr = $.parseJSON(response.responseText);
				
				validation.writeError(form, arr.errorCode);
			}
		});
	});
	
	$(document).on('click', '.js-activate', function (event) {
		event.preventDefault();
		if (requestInProcess) {
			return false;
		}
		
		requestInProcess = true;
		
		request = $.ajax({
			type: "POST",
			url: "/ajax/activate",
			dataType: "json",
			cache: false,
			success: function success(response) {
				requestInProcess = false;
				
				if (response.error === "Y") {
					validation.writeError(form, response.errorCode);
					} else {
					form.html(response.html);
					addCertificateInputMask(response.step);
					
					popup.open();
					popup.setContent(form);
				}
			},
			error: function error(response) {
				requestInProcess = false;
				var arr = $.parseJSON(response.responseText);
				
				validation.writeError(form, arr.errorCode);
			}
		});
	});
	
	activationPopup.submit(function (event) {
		event.preventDefault();
		
		var data = form.serializeArray();
		
		if (requestInProcess) {
			return false;
		}
		
		if ($('#activate-num').length) {
			activate_num = $('#activate-num').val();
			if (activate_num.length) {
				activate_num = activate_num.replace(/\s+/g, '');
			
				activate_num_int = activate_num.replace(/[^0-9]/g,"")
				
				//console.log(activate_num);
				//console.log(activate_num_int);
		
				if (activate_num != activate_num_int) {
					reloadJSPopupActivateUniversalCertificate();

					$('#popup-activate-universal-certificate').trigger('click');

					return false;
				}
			}
		}

		request = $.ajax({
			type: "POST",
			url: "/ajax/activate",
			data: data,
			dataType: "json",
			cache: false,
			beforeSend: function() {
				$('.activation-box__send').addClass('loading-btn');
			},
			complete: function() {
				$('.activation-box__send').removeClass('loading-btn');
			}, 
			success: function success(response) {
				requestInProcess = false;
				
				if (response.error === "Y") {
					validation.writeError(activationPopup, response.errorCode);
					if (response.errorFields.length > 0) {
						for (var i = 0; i < response.errorFields.length; i++) {
							$('#activation-popup').find('[name="activate[' + response.errorFields[i] + ']"]').addClass('input_type_error');
						}
					}
				} else {
					window.location.href = response.redirect;
					return false;
				
					form.html(response.html);
					popup.setContent('');
					popup.setContent(form);
					addCertificateInputMask(response.step);
				}
			},
			error: function error(response) {
				requestInProcess = false;
				var arr = $.parseJSON(response.responseText);
				
				validation.writeError(activationPopup, arr.errorCode);
			}
		});
	});
	
	/*form.submit(function(){
        if (requestInProcess){
		return false;
        }
		if(!validation.validateForm(form)){
		return false;
		}
		form.find('.input').blur();
		requestInProcess = true;
        submitButton.prop('disabled', true).text('Отправляю...');
		request = $.ajax({
		type: "POST",
		url: "/ajax/quickbuy",
		data: form.serialize(),
		dataType: "json",
		cache: false,
		success: function (arr) {
		requestInProcess = false;
		submitButton.prop('disabled', false).text('Заказать');
		if (arr.error == "Y") {
		validation.writeError(form, arr.errorCode);
		}
		else {
		validation.writeSuccess(form, arr.msg);
		form.find('.input').val('');
		setTimeout(function () {
		popup.close();
		}, 5000);
		}
		},
		error: function () {
		requestInProcess = false;
		submitButton.prop('disabled', false).text('Заказать');
		validation.writeError(form, messages.errors.ajax);
		}
        });
		return false;
		});
	*/
})();

(function () {
	$(document).on('click', '.js-gift-buy', function (e) {
		var $that = $(this),
		$form = $that.closest('.gift-buy'),
		$cart = $('.cart'),
		$cart_total = $cart.find('.cart__total');
		
		option_data = false;
		
		type_price = 0;
		
		if ($(this).closest('.list-gift__info').find('select[name=option]').length) {
			option_data = $(this).closest('.list-gift__info').find('select[name=option]').val();
		}
		
		if ($(this).closest('#stick-buy').find('select[name=option]').length) {
			option_data = $(this).closest('#stick-buy').find('select[name=option]').val();
		}
		
		if ($(this).closest('form').find('input[name=type_price]:checked').length) {
			type_price = $(this).closest('form').find('input[name=type_price]:checked').val();
		}
		
		//console.log(type_price);
		//return false;
		
		if (!$that.hasClass('js-in-cart')) {
			e.preventDefault();
		} else {
			window.location.replace('/cart/');
		}
		
		$that.prop('disabled', true).text('...');
		
		var cart_total = parseInt($cart_total.text());
		
		$.ajax({
			type: "POST",
			url: "/ajax/addtocart",
			data: { 
				pid: $that.data('pid'),
				option_data: option_data,
				type_price: type_price,
			},
			cache: false,
			dataType: "json",
			success: function success(response) {
				$that.prop('disabled', false);
				
				if (cart_total !== response.total) {
					if (response.total) {
						$cart.addClass('cart_active');
						} else {
						$cart.removeClass('cart_active');
					}
					$cart_total.text(response.total);
				}
				
				if (response.error === "Y") {
					$that.text('Купить');
					if ($form.length) {
						validation.writeError($form, response.errorCode);
					}
					} else {
						if ($form.length) {
							$form.addClass('gift-buy_in-cart');
						}
						$that.text('В корзине');
						
						//window.location.assign("/cart/");
						//window.location.href = '/cart/';
						
						var productAddedCart = $('#product-added-to-cart');
						if (!productAddedCart.length) {
							return false;
						}

						popup = new jBox('Modal', {
							content: productAddedCart,
							closeOnClick: false,
							closeButton: 'box',
							
						});
						
						popup.open();
						return false;
					
				}
			},
			error: function error(response) {
				$that.prop('disabled', false).text('Купить');
				var responseMessage = $.parseJSON(response.responseText);
				validation.writeError($form, responseMessage);
			}
		});
	});
	
	$(document).on('submit', '.gift-buy', function (e) {
		e.preventDefault();
	});
})();
(function () {
	$(document).on('click', '.js-gift-to-box', function (e) {
		var that = $(this),
		form = that.closest('.gift-buy');
		
		if (!form.hasClass('gift-buy_in-box')) {
			e.preventDefault();
		} else {
			return true;
		}
		
		that.prop('disabled', true).text('...');
		
		$.ajax({
			type: "POST",
			url: "/ajax/addtobox",
			data: { pid: form.data('pid') },
			cache: false,
			dataType: "json",
			
			success: function success(response) {
				that.prop('disabled', false);
				if (response.error == "Y") {
					that.text('Добавить в набор');
					validation.writeError(form, response.errorCode);
					} else {
					form.addClass('gift-buy_in-box');
					that.text('В наборе');
					
					window.location.replace('/catalog/constructor/');
					
					/*validation.writeSuccess(form, response.msg);
						setTimeout(function () {
                        validation.reset(form);
					}, 3000);*/
				}
			},
			error: function error(response) {
				that.prop('disabled', false).text('Добавить в набор');
				var responseMessage = $.parseJSON(response.responseText);
				validation.writeError(form, responseMessage);
			}
		});
	});
})();

/*
	$(document).ready(function(){
    let videoFrames = document.querySelectorAll('.gift__description iframe, .popup iframe');
    resizeVideoFrames(videoFrames);
    $(window).resize(function () {
	resizeVideoFrames(videoFrames);
    });
	
	
	
	
});*/

function resizeIFrameVideo(selector) {
	if (typeof selector === "string") {
		selector = $(selector);
	}
	
	selector.each(function () {
		var that = $(this);
		var dimension = that.width() / that.height();
		if (isNaN(dimension) || dimension > 1.77) {
			dimension = 1.77;
		}
		var parentWidth = that.parent().width();
		
		that.width(parentWidth + 'px');
		that.height(parentWidth / dimension + 'px');
	});
}

var loadMoreInLoading = false;
function loadMore(data, onSuccess, onError) {
	if (loadMoreInLoading) {
		return false;
	}
	
	$.ajax({
		type: "GET",
		url: "/ajax/loaddata",
		data: data,
		cache: false,
		dataType: "json",
		success: function success(response) {
			loadMoreInLoading = false;
			
			if (typeof onSuccess === "function") {
				onSuccess(response);
			}
			
			$('.product-info__price-col .custom-dropdown__btn').unbind('click');
			$('.list-gift .product-info__price-col .custom-dropdown__menu .price-list__item').unbind('click');
			
			$('.product-info__price-col .custom-dropdown__btn').click(function() {
				$(this).closest('.custom-dropdown').toggleClass('show');
				$(this).closest('.custom-dropdown').find('.custom-dropdown__menu').toggleClass('show');
			});
			
			$('.list-gift .product-info__price-col .custom-dropdown__menu .price-list__item').click(function() {
				var ProductOptionID = $(this).attr('data-id');
				$(this).closest('.product-info__subcol').find('select[name=option]').val(ProductOptionID);
			
				$(this).closest('.product-info__subcol').find('.custom-dropdown__menu .price-list__item').removeClass('active');
				$(this).addClass('active');

				$(this).closest('.product-info__subcol').find('.price-dropdown__text .js-price__item-price').html( $(this).find('.js-price__item-price').html() );
				$(this).closest('.product-info__subcol').find('.price-dropdown__text .js-price__item-participant').html( $(this).find('.js-price__item-participant').html() );
				$(this).closest('.product-info__subcol').find('.price-dropdown__text .js-price__item-duration').html( $(this).find('.js-price__item-duration').html() );
				
				$('.custom-dropdown').removeClass('show');
				$('.custom-dropdown__menu').removeClass('show');
			
				//console.log( $(this).attr('data-id') );
			});
			
			if ($('.list-gift select[name=option]').length) {
				$('.list-gift select[name=option]').each(function( index ) {
					$(this).parent().find('.custom-dropdown__menu .price-list__item:first-child').trigger('click');
				});
			} 
		},
		error: function error(response) {
			loadMoreInLoading = false;
			
			if (typeof onError === "function") {
				onError(response);
			}
		}
	});
}

$(document).ready(function () {
	
	var loadMoreInProcess = false;
	
	$(window).on("load resize scroll", function () {
		if (loadMoreInProcess) {
			return;
		}
		
		if (!$('.load-more__scroller').isInViewport()) {
			return;
		}
		
		loadMoreInProcess = true;
		
		var $this = $('.load-more__scroller'),
		$parent = $this.parent(),
		form_data = $this.data();
		
		$parent.addClass('load-more_loading');
		form_data.page++;
		
		loadMore(form_data, function (response) {
			loadMoreInProcess = false;
			$parent.removeClass('load-more_loading');
			
			if (response.page == 1) {
				$parent.parent().html(response.html);
			} else {
				$(response.html).insertBefore($parent);
			}
			
			if (response.last === "Y") {
				$parent.remove();
			} else {
				form_data.page = response.page;
				console.log(response.page);
			}
			
			if (form_data.callback !== undefined) {
				var callback = window[form_data.callback];
				if (typeof callback === "function") {
					callback();
				}
			}
		}, function () {
			loadMoreInProcess = false;
			showNotification('Обновите страницу, затем повторите действие.', 'error');
			$parent.remove();
		});
	});
	
	var loadMoreInProcess_multi = false;
	
	$(window).on("load resize scroll", function () {
		if (loadMoreInProcess_multi) {
			return;
		}
		
		if (!$('.load-more__scroller_multi').isInViewport()) {
			return;
		}
		
		loadMoreInProcess_multi = true;
		
		var $this = $('.load-more__scroller_multi'),
		$parent = $this.parent(),
		form_data = $this.data();
		
		$parent.addClass('load-more_loading');
		form_data.page++;
		
		loadMore(form_data, function (response) {
			loadMoreInProcess_multi = false;
			$parent.removeClass('load-more_loading');
			
			if (response.page == 1) {
				$parent.parent().html(response.html);
				} else {
				$(response.html).insertBefore($parent);
			}
			
			if (response.last === "Y") {
				$parent.remove();
				} else {
				form_data.page = response.page;
				console.log(response.page);
			}
			
			if (form_data.callback !== undefined) {
				var callback = window[form_data.callback];
				if (typeof callback === "function") {
					callback();
				}
			}
			}, function () {
			loadMoreInProcess_multi = false;
			showNotification('Обновите страницу, затем повторите действие.', 'error');
			$parent.remove();
		});
	});
	
	$(document).on('click', '.load-more__button', function () {
		if (loadMoreInProcess) {
			return;
		}
		loadMoreInProcess = true;
		
		var $this = $(this),
		$parent = $this.parent(),
		form_data = $this.data();
		
		$parent.addClass('load-more_loading');
		form_data.page++;
		
		loadMore(form_data, function (response) {
			loadMoreInProcess = false;
			$parent.removeClass('load-more_loading');
			
			if (response.page == 1) {
				$parent.parent().html(response.html);
				} else {
				$(response.html).insertBefore($parent);
			}
			
			if (response.last === "Y") {
				$this.remove();
				} else {
				form_data.page = response.page;
				console.log(response.page);
			}
			
			if (form_data.callback !== undefined) {
				var callback = window[form_data.callback];
				if (typeof callback === "function") {
					callback();
				}
			}
			}, function () {
			loadMoreInProcess = false;
			showNotification('Обновите страницу, затем повторите действие.', 'error');
			$parent.remove();
		});
	});
});

$(document).ready(function () {
	
	var constructor = $('.constructor-box');
	
	if (constructor.length === 0) {
		return;
	}
	
	var pageContent = $('.page__content'),
	pageContentPadding = parseInt(pageContent.css('padding-bottom')) + constructor.height();
	
	pageContent.css('padding-bottom', pageContentPadding);
	setConstructorStickToBottom();
	$(window).scroll(function () {
		setConstructorStickToBottom();
	});
	
	constructor.on('click', '.constructor-box__info', function () {
		toggleConstructor();
		return false;
	});
	
	if (screenSize.x < 768) {
		toggleConstructor();
	}
	
	function toggleConstructor() {
		$('.constructor-box__cart').slideToggle();
		$('.constructor-box__checkout').slideToggle();
	}
	
	function setConstructorStickToBottom() {
		var footerOffset = $('.footer').offset().top;
		
		var viewportTop = $(window).scrollTop(),
		viewportBottom = viewportTop + $(window).height();
		
		if (viewportBottom >= footerOffset && !constructor.hasClass('constructor-box_sticky')) {
			constructor.addClass('constructor-box_sticky');
			} else if (viewportBottom < footerOffset && constructor.hasClass('constructor-box_sticky')) {
			constructor.removeClass('constructor-box_sticky');
		}
	}
	
	constructor.on('click', '.js-constructor-send', function () {
		$.ajax({
			type: "POST",
			url: "/ajax/addboxtocart",
			data: {},
			cache: false,
			dataType: "json",
			success: function success(response) {
				if (response.error === "Y") {
					showNotification(response.errorCode, 'error');
				} else {
					window.location.href = '/cart';
				}
			},
			error: function error(response) {
				showNotification(response.errorCode + '<br>Обновите страницу, затем повторите действие.', 'error');
			}
		});
	});
	
	constructor.on('click', '.js-constructor-remove', function () {
		var productId = $(this).attr('data-id');
		
		$.ajax({
			type: "POST",
			url: "/ajax/removefrombox",
			data: {
				pid: productId
			},
			cache: false,
			dataType: "json",
			success: function success(response) {
				if (response.error === "Y") {
					showNotification(response.errorCode, 'error');
					} else {
					var productBox = $('#constructorBoxItem' + productId);
					productBox.removeAttr('id');
					productBox.addClass('constructor-box__item_empty');
					
					productBox.find('.js-constructor-remove').removeAttr('data-id');
					
					var product = $('#catalogProduct' + productId);
					product.removeClass('catalog-list__item_inbox');
					
					$('.js-constructor-price').text(response.price);
					$('.constructor-box__count-num').text(response.total);
				}
			},
			error: function error(response) {
				showNotification(response.errorCode + '<br>Обновите страницу, затем повторите действие.', 'error');
			}
		});
	});
	
	$(document).on('click', '.js-add-to-constructor', function () {
		var productId = $(this).attr('data-id');
		
		var emptyProductBox = $('.constructor-box__item_empty');
		if (emptyProductBox.length == 0) {
			showNotification('В наборе максимальное число подарков', 'error');
			return;
		}
		
		emptyProductBox = emptyProductBox.first(); 
		
		option_data = false;
		
		if ($(this).closest('.list-gift__info').find('select[name=option]').length) {
			option_data = $(this).closest('.list-gift__info').find('select[name=option]').val();
		}
		
		if ($(this).closest('#stick-buy').find('select[name=option]').length) {
			option_data = $(this).closest('#stick-buy').find('select[name=option]').val();
		}
		
		$.ajax({
			type: "POST",
			url: "/ajax/addtobox",
			data: {
				pid: productId,
				option_data: option_data,
			},
			cache: false,
			dataType: "json",
			success: function success(response) {
				if (response.error == "Y") {
					showNotification(response.errorCode, 'error');
				} else {
					var product = $('#catalogProduct' + productId);
					product.addClass('catalog-list__item_inbox');
					
					emptyProductBox.removeClass('constructor-box__item_empty');
					emptyProductBox.attr('id', 'constructorBoxItem' + productId);
					
					var image = product.find('.list-gift__image').css('background-image');
					var title = product.find('.list-gift__title').text();
					emptyProductBox.find('.constructor-box__item-image').attr('src', image.replace('url(', '').replace(')', '').replace(/\"/gi, "").replace('/b_', '/vs_'));
					emptyProductBox.attr('title', title);
					
					emptyProductBox.find('.js-constructor-remove').attr('data-id', productId);
					
					$('.js-constructor-price').text(response.price);
					$('.constructor-box__count-num').text(response.total);
				}
			},
			error: function error(response) {
				showNotification(response.errorCode + '<br>Обновите страницу, затем повторите действие.', 'error');
			}
		});
	});
});

(function () {
	var deliveryInputSelector = '.js-order-delivery',
	deliveryCheckedInputSelector = deliveryInputSelector + ':checked',
	coverInputSelector = '.js-order-cover',
	coverCheckedInputSelector = coverInputSelector + ':checked',
	paymentTypeInputSelector = '.js-payment-type',
	paymentTypeCheckedInputSelector = paymentTypeInputSelector + ':checked',
	deliveryAmountInput = $('.js-delivery-amount'),
	coverAmountInput = $('.js-cover-amount'),
	totalAmountInput = $('.js-total-amount'),
	universalCertificateInput = $('.js-product-universal-certificate'),
	
	checkoutPaymentForm = $('.checkout-order__payment-form'),
	checkoutPaymentFormContainer = $('.checkout-payment-form-container'),
	
	productPaymentTypeInput = $('.js-product-payment-type'),
	increaseButton = $('.js-checkout-product-increase'),
	decreaseButton = $('.js-checkout-product-decrease'),
	removeButton = $('.checkout-product__remove'),
	qualityInputClassName = '.js-checkout-product-count',
	qualityInput = $(qualityInputClassName),
	emailSendToRecipientInput = $('#emailCertRecipientDirect'),
	emailRecipientBox = $('.js-recipient-box'),
	congratulationNameInput = $('#boxCertCustomerCongratulationName'),
	congratulationTextInput = $('#boxCertCustomerCongratulationText'),
	posterSliderInitialIndex = 0,
	posterSliderInit = false,
	widgetSid = document.getElementById('widgetSid')?.value || '';

	console.log(widgetSid);
	
	increaseButton.click(function () {
		if(!requestInProcess) {
		var $this = $(this),
		productId = $this.data('id');
		
		var qualityInput = $this.parent().find(qualityInputClassName);
		var quality = parseInt(qualityInput.val());
		quality++;
		increaseProductQuality(productId, quality);
		qualityInput.val(quality);
	}
	});
	decreaseButton.click(function () {
		if(!requestInProcess) {
		var $this = $(this),
		productId = $this.data('id');
		
		var qualityInput = $this.parent().find(qualityInputClassName);
		var quality = parseInt(qualityInput.val());
		quality--;
		decreaseProductQuality(productId, quality);
		qualityInput.val(quality);
		}
	});
	removeButton.click(function () {
		if(!requestInProcess) {
			removeProduct($(this).data('id'));
		}
	});
	
	function increaseProductQuality(productId, quality) {
		sendProductQualityRequest({
			type: 'update',
			index: productId,
			qty: quality
		});
	}
	
	function decreaseProductQuality(productId, quality) {
		if (quality <= 0) {
			removeProduct(productId);
			return;
		}
		sendProductQualityRequest({
			type: 'update',
			index: productId,
			qty: quality
		});
	}
	
	function removeProduct(productId) {
		sendProductQualityRequest({
			type: 'remove',
			index: productId
			}, function (response) {
			$('#product' + productId).remove();
		});
	}
	
	var requestInProcess = false;
	
	function sendProductQualityRequest(data, callback) {
		if (requestInProcess) {
			return false;
		}
		requestInProcess = true;
		
		
		$.ajax({
			type: "POST",
			url: "/ajax/cart",
			data: {...data, 'widSid': widgetSid},
			cache: false,
			dataType: "json",
			success: function success(response) {
				requestInProcess = false;
				
				if (response.total === 0) {
					window.location.reload();
				}
				
				totalAmountInput.text(response.amount);
				
				if (response.universal_certificate) {
					universalCertificateInput.parent().removeClass('hidden');
					universalCertificateInput.text('-' + response.universal_certificate);
				}
				
				if (response.amount == 0) {
					checkoutPaymentForm.addClass('hidden');
					checkoutPaymentFormContainer.addClass('hidden');
				} else {
					checkoutPaymentForm.removeClass('hidden');
					checkoutPaymentFormContainer.removeClass('hidden');
				}
				
				if (typeof callback === 'function') {
					callback(response);
				}
				
				if (data['type'] == 'remove') {
					window.location.reload();
				}
				

				$('.checkout-product').each(function(index) {
					price_product = $(this).find('.checkout-product__price input').val();
					
					console.log(price_product);
					
					price_product = price_product.replace(' ','');
					count_product = $(this).find('.js-checkout-product-count').val();
					sum_product = price_product * count_product;
					
					sum_product = addSeparatorsNF(sum_product, '.', '.', ' ');
					
					$(this).find('.checkout-product__price span').html(sum_product);
				});
				//console.log(data['type']);
				
			},
			error: function error(response) {
				requestInProcess = false;
				
				var arr = $.parseJSON(response.responseText);
				
				showNotification(arr.errorCode, 'error');
			}
		});
	}
	
	$('.js-select-checkout-order').click(function () {
		var $this = $(this),
		link = $this.attr('href');
		
		$('.checkout-order').removeClass('checkout-order_active');
		$(link).addClass('checkout-order_active');
		
		$('.js-select-checkout-order').removeClass('checkout__certificate-type-button_active');
		$this.addClass('checkout__certificate-type-button_active');
		
		selectCertificate();
		
		return false;
	});
	
	function selectCertificate() {
		var activeCertificate = $('.checkout-order_active');
		if (activeCertificate.length === 0) {
			return false;
		}
		switch (activeCertificate.attr('id')) {
			case "emailCert":
			selectEmailCertificate();
			break;
			case "boxCert":
			selectBoxCertificate();
			break;
		}
		
		$(window).scrollTop($(window).scrollTop() + 1);
		$(window).scrollTop($(window).scrollTop() - 1);
	}
	
	$(document).ready(function () {
		selectCertificate();
	});
	
	$(document).on('change', deliveryInputSelector, function () {
		changeDelivery($(this).val());
	});
	$(document).on('change', coverInputSelector, function () {
		changeCover($(this).val());
	});
	emailSendToRecipientInput.change(function () {
		emailCertificateDirect();
	});
	
	function selectEmailCertificate() {
		console.log('select email ');
		
		changeCover(0);
		changeDelivery(4);
		emailCertificateDirect();
	}
	
	function selectBoxCertificate() {
		console.log('box cert');
		var currentDelivery = $(deliveryCheckedInputSelector);
		
		if (currentDelivery.length === 0) {
			currentDelivery = $(deliveryInputSelector).first();
		}
		
		var currentCover = $(coverCheckedInputSelector);
		if (currentCover.length === 0) {
			currentCover = $(coverInputSelector).first();
		}
		changeDelivery(currentDelivery.val());
		changeCover(currentCover.val());
		
		if (!posterSliderInit) {
			posterSliderInit = true;
			initPosterSlider();
		}
	}
	
	function emailCertificateDirect() {
		if (emailSendToRecipientInput.prop("checked")) {
			emailRecipientBox.show();
			} else {
			emailRecipientBox.hide();
		}
	}
	
	function changeDelivery(id) {
		
		$('.js-delivery-hidden').hide();
		//$('.js-delivery-show-' + id).show();
		$('select.js-delivery-show-' + id).hide();
		if(id === 1){
			$('#boxCertCustomerSendAddress').show();
			$('#boxCertCustomerSendAddressDetail').show();
			$('#deliveryMap').show();
		}
		$('#boxCertCustomerSendDate').attr('placeholder', id == 3 ? 'Дата самовывоза *' : 'Дата доставки *');
		
		$.ajax({
			type: "POST",
			url: "/ajax/getScenario",
			data: { id: id, widSid: widgetSid },
			cache: false,
			dataType: "json",
			success: function success(response) {
				$('.js-delivery-show-' + response.scenario).show();
			}
		});
		
		reg_xhr = $.ajax({
			type: "POST",
			url: "/ajax/setDelivery",
			data: { id: id, widSid: widgetSid  },
			cache: false,
			dataType: "json",
			success: function success(response) {
				deliveryAmountInput.text(response.delivery);
				totalAmountInput.text(response.total);
				if (response.universal_certificate) {
					universalCertificateInput.parent().removeClass('hidden');
					universalCertificateInput.text('-' + response.universal_certificate);
				}
				if (response.total == 0) {
					checkoutPaymentForm.addClass('hidden');
					checkoutPaymentFormContainer.addClass('hidden');
				} else {
					checkoutPaymentForm.removeClass('hidden');
					checkoutPaymentFormContainer.removeClass('hidden');
				}
			}
		});
		
		if (id == 4) {
			$('#PayMail2').prop("checked", true);
			$('.js-payment-type').trigger('change');
		}
		
	}
	
	function changeCover(id) {
		reg_xhr = $.ajax({
			type: "POST",
			url: "/ajax/setCover",
			data: { id: id, widSid: widgetSid },
			cache: false,
			dataType: "json",
			success: function success(response) {
				coverAmountInput.text(response.cover);
				totalAmountInput.text(response.total);
				if (response.universal_certificate) {
					universalCertificateInput.parent().removeClass('hidden');
					universalCertificateInput.text('-' + response.universal_certificate);
				}
				if (response.total == 0) {
					checkoutPaymentForm.addClass('hidden');
					checkoutPaymentFormContainer.addClass('hidden');
				} else {
					checkoutPaymentForm.removeClass('hidden');
					checkoutPaymentFormContainer.removeClass('hidden');
				}
			}
		});
	}
	
	$(".checkout-cover__congratulation-button").click(function () {
		showCongratulationBox();
	});
	
	if (!isEmpty(congratulationNameInput.val()) || !isEmpty(congratulationTextInput.val())) {
		showCongratulationBox();
	}
	
	function showCongratulationBox() {
		var $button = $(".checkout-cover__congratulation-button");
		var $box = $(".checkout-cover__congratulation");
		
		$button.hide();
		$box.show();
	}
	
	$(paymentTypeInputSelector).change(function () {
		var $this = $(this);
		var value = $this.val();
		
		//console.log(value);
		
		reg_xhr = $.ajax({
			type: "POST",
			url: "/ajax/setPayment",
			data: { id: value, widSid: widgetSid },
			cache: false,
			dataType: "json",
			success: function success(arr) {
			}
		});
		
		
		$(paymentTypeInputSelector + '[value=' + value + ']').prop('checked', true);
		var description = $this.next().text();
		productPaymentTypeInput.text(description);
	});
	
	$('.checkout-order').on('submit', function (event) {
		event.preventDefault();
		if (requestInProcess) {
			return false;
		}

		var currentDelivery = $(deliveryCheckedInputSelector);

		if (currentDelivery.length === 0) {
			currentDelivery = $(deliveryInputSelector).first();
		}

		if(!$('#streetSelected').val() && currentDelivery.val() == 1){
			alert('Выберите адрес из списка. Адрес доставки заполнен некорректно!');
			return false;
		}

		requestInProcess = true;
		var $this = $(this),
		activeClass = 'checkout-order_loading';
		
		$this.addClass(activeClass);
		
		mo_xhr = $.ajax({
			type: "POST",
			url: "/ajax/order",
			data: $(this).serialize()+ `&widSid=${widgetSid}`,
			cache: false,
			dataType: "json",
			success: function success(response) {
				requestInProcess = false;
				$this.removeClass(activeClass);
				
				if (response.thankYou === 'Y') {
					window.location.replace(`/thank-you${widgetSid ? `?widSid=${widgetSid}`: ''}`);
				}
				
				totalAmountInput.text(response.total);
				
				if (response.total === 0) {
					window.location.reload();
				} else {
					totalAmountInput.text(response.amount);
					
					if (response.error == 'Y') {
						$this.find('.checkout-order__payment-form .error').remove();
						$this.find('.checkout-order__payment-form').append(response.errorCode);
						
						if (response.errorFields.length > 0) {
							for (var i = 0; i < response.errorFields.length; i++) {
								$this.find('[name="order[' + response.errorFields[i] + ']"], .js-order-' + response.errorFields[i]).addClass('input_type_error');
							}
						}
						
						var fillAllFields = $('#fill-all-fields');
						if (!fillAllFields.length) {
							return false;
						}

						popup = new jBox('Modal', {
							content: fillAllFields,
							closeOnClick: false,
							closeButton: 'box',
							
						});
						
						popup.open();
						return false;
						
					}
				}
			},
			error: function error(response) {
				requestInProcess = false;
				$this.removeClass(activeClass);
				
				var arr = $.parseJSON(response.responseText);
				showNotification(arr.errorCode, 'error');
			}
		});
	});
	
	$('.js-date-picker').datepicker({
		showAnim: "",
		minDate: 0,
		defaultDate: 0,
		showOtherMonths: true,
		selectOtherMonths: false,
		changeMonth: false,
		changeYear: false,
		numberOfMonths: 1,
		dateFormat: 'dd.mm.yy'
	}).datepicker("option", $.datepicker.regional['ru']);
	
	$(document).on('click', '.input_type_error', function () {
		$(this).removeClass('input_type_error');
	});
	
	$("#boxCertCustomerPostamat").niceSelect();
	
	function initPosterSlider() {
		$(".js-order-cover").each(function (index) {
			if ($(this).prop("checked")) {
				posterSliderInitialIndex = index;
			}
		});
		
		var posterSlider = new Swiper("#boxCertPosterSlider", {
			initialSlide: posterSliderInitialIndex,
			slidesPerView: "auto",
			spaceBetween: 10,
			on: {
				slideChange: function slideChange(param) {
					var cover = $(".js-order-cover:eq(" + this.activeIndex + ")");
					cover.prop("checked", true);
					cover.trigger("change");
				}
			}
		});
		$(".checkout-cover__thumbnail").each(function (index) {
			$(this).click(function () {
				posterSlider.slideTo(index);
			});
		});
	}
})();
(function () {
	var corporativeOfferingPopup = $('#corporative-offering-popup');
	if (!corporativeOfferingPopup.length) {
		return false;
	}
	
	var form = corporativeOfferingPopup.find('form'),
	submitButton = corporativeOfferingPopup.find(".js-send"),
	request = void 0,
	requestInProcess = false,
	popup = new jBox('Modal', {
		content: corporativeOfferingPopup,
		closeOnClick: false,
		closeButton: 'box'
	});
	
	$(document).on('click', '.js-corporative-offering', function () {
		popup.open();
		return false;
	});
	
	form.submit(function () {
		if (requestInProcess) {
			return false;
		}
		
		if (!validation.validateForm(form)) {
			return false;
		}
		
		form.find('.input').blur();
		
		requestInProcess = true;
		submitButton.prop('disabled', true).text('Отправляю...');
		
		request = $.ajax({
			type: "POST",
			url: "/ajax/corporative",
			data: form.serialize(),
			dataType: "json",
			cache: false,
			success: function success(arr) {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Получить предложение');
				
				if (arr.error == "Y") {
					validation.writeError(form, arr.errorCode);
					} else {
					validation.writeSuccess(form, arr.msg);
					form.find('.input').val('');
					
					setTimeout(function () {
						popup.close();
					}, 5000);
				}
			},
			error: function error() {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Получить предложение');
				
				validation.writeError(form, messages.errors.ajax);
			}
		});
		
		return false;
	});
})();

(function () {
	var partnerActivationPopup = $('#partner-activation-popup');
	if (!partnerActivationPopup.length) {
		return false;
	}
	
	var form = partnerActivationPopup.find('form'),
	submitButton = partnerActivationPopup.find(".js-send"),
	idInput = partnerActivationPopup.find('#activationId'),
	typeActivation = partnerActivationPopup.find('#typeActivation'),
	request = void 0,
	requestInProcess = false,
	popup = new jBox('Modal', {
		content: partnerActivationPopup,
		closeOnClick: false,
		closeButton: 'box',
		
		onCloseComplete: function onCloseComplete() {
			idInput.val('');
		}
	});
	
	$("#ActivationDate").datepicker({
		showAnim: "",
		minDate: 0,
		defaultDate: 0,
		showOtherMonths: true,
		selectOtherMonths: false,
		changeMonth: false,
		changeYear: false,
		numberOfMonths: 1,
		dateFormat: 'dd.mm.yy',
		beforeShow: function (input, inst) {
			var rect = input.getBoundingClientRect();
			setTimeout(function () {
				inst.dpDiv.css({ top: rect.top + 40, left: rect.left + 0 });
			}, 0);
		}
	}).datepicker("option", $.datepicker.regional["ru"]);
	
	$(document).on('click', '.js-partner-activate', function () {
		var self = $(this),
		activationId = self.data('id');
		activationType = self.data('type');
		
		idInput.val(activationId);
		typeActivation.val(activationType);
		
		popup.open();
		return false;
	});
	
	form.submit(function () {
		if (requestInProcess) {
			return false;
		}
		
		if (!validation.validateForm(form)) {
			return false;
		}
		
		form.find('.input').blur();
		
		requestInProcess = true;
		submitButton.prop('disabled', true).text('Отправляю...');
		
		if (typeActivation.val() == 'ActivationUniversalCertificate') {
			request = $.ajax({
				type: "POST",
				url: "/ajax/setPartnerActivationUniversalCertificateExecuted",
				data: form.serialize(),
				dataType: "json",
				cache: false,
				success: function success(arr) {
					requestInProcess = false;
					submitButton.prop('disabled', false).text('Получить предложение');
					
					if (arr.error == "Y") {
						validation.writeError(form, arr.errorCode);
						} else if (arr.error == 0) {
						validation.writeError(form, 'Неверно указан код активации!');
						} else {
						validation.writeSuccess(form, arr.msg);
						form.find('.input').val('');
						
						$('#Activation' + arr.activationId).removeClass('partner-room__activation_new');
						$('#Activation' + arr.activationId + ' .partner-room__activation-confirm').remove();
						
						setTimeout(function () {
							popup.close();
						}, 5000);
					}
				},
				error: function error() {
					requestInProcess = false;
					submitButton.prop('disabled', false).text('Получить предложение');
					
					validation.writeError(form, messages.errors.ajax);
				}
			});
		} else {
			request = $.ajax({
				type: "POST",
				url: "/ajax/setPartnerActivationExecuted",
				data: form.serialize(),
				dataType: "json",
				cache: false,
				success: function success(arr) {
					requestInProcess = false;
					submitButton.prop('disabled', false).text('Получить предложение');
					
					if (arr.error == "Y") {
						validation.writeError(form, arr.errorCode);
						} else if (arr.error == 0) {
						validation.writeError(form, 'Неверно указан код активации!');
						} else {
						validation.writeSuccess(form, arr.msg);
						form.find('.input').val('');
						
						$('#Activation' + arr.activationId).removeClass('partner-room__activation_new');
						$('#Activation' + arr.activationId + ' .partner-room__activation-confirm').remove();
						
						setTimeout(function () {
							popup.close();
						}, 5000);
					}
				},
				error: function error() {
					requestInProcess = false;
					submitButton.prop('disabled', false).text('Получить предложение');
					
					validation.writeError(form, messages.errors.ajax);
				}
			});
		};
		
		return false;
	});
})();

(function () {
	var reviewPopup = $('#review-popup');
	if (!reviewPopup.length) {
		return false;
	}
	
	var form = reviewPopup.find('form'),
	submitButton = reviewPopup.find(".js-send"),
	request = void 0,
	requestInProcess = false,
	popup = new jBox('Modal', {
		content: reviewPopup,
		closeOnClick: false,
		closeButton: 'box'
		
	});
	
	$(document).on('click', '.js-add-review', function () {
		popup.open();
		return false;
	});
	
	form.submit(function () {
		if (requestInProcess) {
			return false;
		}
		
		if (!validation.validateForm(form)) {
			return false;
		}
		
		form.find('.input').blur();
		
		requestInProcess = true;
		submitButton.prop('disabled', true).text('Отправляю...');
		
		request = $.ajax({
			type: "POST",
			url: "/ajax/review",
			data: form.serialize(),
			dataType: "json",
			cache: false,
			success: function success(arr) {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Заказать');
				
				if (arr.error == "Y") {
					validation.writeError(form, arr.errorCode);
					} else {
					validation.writeSuccess(form, arr.msg);
					form.find('.input').val('');
					
					setTimeout(function () {
						popup.close();
					}, 5000);
				}
			},
			error: function error() {
				requestInProcess = false;
				submitButton.prop('disabled', false).text('Заказать');
				
				validation.writeError(form, messages.errors.ajax);
			}
		});
		
		return false;
	});
	
	
	
	$('.new_reviews	p label:nth-child(2)').click(function() {
		$('.new_reviews	p label:nth-child(2) i').addClass('red');
		$('.new_reviews	p label:nth-child(4) i').removeClass('yellow');
		$('.new_reviews	p label:nth-child(6) i').removeClass('yellow');
		$('.new_reviews	p label:nth-child(8) i').removeClass('yellow');
		$('.new_reviews	p label:nth-child(10) i').removeClass('yellow');
		$('.new_reviews').attr("id", "w1");
	});
	
	$('.new_reviews	p label:nth-child(4)').click(function() {
		$('.new_reviews	p label:nth-child(2) i').addClass('red');
		$('.new_reviews	p label:nth-child(4) i').addClass('red');
		$('.new_reviews	p label:nth-child(6) i').removeClass('yellow');
		$('.new_reviews	p label:nth-child(8) i').removeClass('yellow');
		$('.new_reviews	p label:nth-child(10) i').removeClass('yellow');
		$('.new_reviews').attr("id", "w1");
	});
	
	$('.new_reviews	p label:nth-child(6)').click(function() {
		$('.new_reviews	p label:nth-child(2) i').addClass('red');
		$('.new_reviews	p label:nth-child(4) i').addClass('red');
		$('.new_reviews	p label:nth-child(6) i').addClass('red');
		$('.new_reviews	p label:nth-child(8) i').removeClass('yellow');
		$('.new_reviews	p label:nth-child(10) i').removeClass('yellow');
		$('.new_reviews').attr("id", "w1");
	});
	
	$('.new_reviews	p label:nth-child(8)').click(function() {
		$('.new_reviews	p label:nth-child(2) i').addClass('red');
		$('.new_reviews	p label:nth-child(4) i').addClass('red');
		$('.new_reviews	p label:nth-child(6) i').addClass('red');
		$('.new_reviews	p label:nth-child(8) i').addClass('red');
		$('.new_reviews	p label:nth-child(10) i').removeClass('yellow');
		$('.new_reviews').attr("id", "w1");
	});
	
	$('.new_reviews	p label:nth-child(10)').click(function() {
		$('.new_reviews	p label:nth-child(2) i').addClass('red');
		$('.new_reviews	p label:nth-child(4) i').addClass('red');
		$('.new_reviews	p label:nth-child(6) i').addClass('red');
		$('.new_reviews	p label:nth-child(8) i').addClass('red');
		$('.new_reviews	p label:nth-child(10) i').addClass('red');
		$('.new_reviews').attr("id", "w1");
	});
	
})();


$(document).ready(function () {
	$('.rating_product label:nth-child(2)').click(function() {
		$('.rating_product label:nth-child(2) i').addClass('yellow');
		$('.rating_product label:nth-child(4) i').removeClass('yellow');
		$('.rating_product label:nth-child(6) i').removeClass('yellow');
		$('.rating_product label:nth-child(8) i').removeClass('yellow');
		$('.rating_product label:nth-child(10) i').removeClass('yellow');
	});
	
	$('.rating_product label:nth-child(4)').click(function() {
		$('.rating_product label:nth-child(2) i').addClass('yellow');
		$('.rating_product label:nth-child(4) i').addClass('yellow');
		$('.rating_product label:nth-child(6) i').removeClass('yellow');
		$('.rating_product label:nth-child(8) i').removeClass('yellow');
		$('.rating_product label:nth-child(10) i').removeClass('yellow');
	});
	
	$('.rating_product label:nth-child(6)').click(function() {
		$('.rating_product label:nth-child(2) i').addClass('yellow');
		$('.rating_product label:nth-child(4) i').addClass('yellow');
		$('.rating_product label:nth-child(6) i').addClass('yellow');
		$('.rating_product label:nth-child(8) i').removeClass('yellow');
		$('.rating_product label:nth-child(10) i').removeClass('yellow');
	});
	
	$('.rating_product label:nth-child(8)').click(function() {
		$('.rating_product label:nth-child(2) i').addClass('yellow');
		$('.rating_product label:nth-child(4) i').addClass('yellow');
		$('.rating_product label:nth-child(6) i').addClass('yellow');
		$('.rating_product label:nth-child(8) i').addClass('yellow');
		$('.rating_product label:nth-child(10) i').removeClass('yellow');
	});
	
	$('.rating_product label:nth-child(10)').click(function() {
		$('.rating_product label:nth-child(2) i').addClass('yellow');
		$('.rating_product label:nth-child(4) i').addClass('yellow');
		$('.rating_product label:nth-child(6) i').addClass('yellow');
		$('.rating_product label:nth-child(8) i').addClass('yellow');
		$('.rating_product label:nth-child(10) i').addClass('yellow');
	});	
	
	$('#product-added-to-cart .container-button a.close-popup').click(function() {
		popup.close();
	});
	
	$('#fill-all-fields .container-button a.close-popup').click(function() {
		popup.close();
	});

});
