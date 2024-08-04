$(document).ready(function () {

	$(".js-datetime-picker").datetimepicker({
		format:'d.m.Y H:i',
		lang:'ru',
		minDate:0,
		dayOfWeekStart:1,
	});
	
	$('.close-category-modal').click(function() {
		$(this).parent().attr('data-navmenu', 'unactive');
		$('.navigation__section span.menu__item_active').attr('data-toggle', 'false');
	});
	
	$('.show-form-universal-certificate span').click(function() {
		$('.checkout-universal-certificate_congratulation').toggleClass('hidden');
	});
	
	$('.check_universal_certificate').click(function() {
		$('.universal-certificate__error').html('');
		$('.universal-certificate__success').html('');
		$('.universal-certificate__error').addClass('hidden');
		if ($(this).parent().find('.universal_certificate').val() == '') {
			$(this).parent().find('.universal-certificate__error').removeClass('hidden');
			$(this).parent().find('.universal-certificate__error').html('Введите код универсального сертификата');
			return false;
		}
		var data = 'CertificateCode=' + $(this).parent().find('.universal_certificate').val();
		$.ajax({
			type: "POST",
			url: '/ajax/checkuniversalcertificate',
			data: data,
			dataType: 'json',
			beforeSend: function() {
				//$('#recurring-description').html('');
			},
			success: function(data) {
				//var data = JSON.parse(data);
				if (data['error']) {
					$('.universal-certificate__error').removeClass('hidden');
					$('.universal-certificate__error').html(data['error']);
				} else if (data['success']) {
					$('.universal-certificate__success').removeClass('hidden');
					$('.universal-certificate__success').html(data['success']);
					$('.js-total-amount').html(data['total']);
					

					setTimeout(function(){
						$('#delivery_4').trigger('click');
					}, 300);
					
					/*setTimeout(function(){
						$('#PayMail2').prop("checked", true);
						$('.js-payment-type').trigger('change');
					}, 500);*/

					setTimeout(function(){
						location.reload();
					}, 500);
				}
			}
		});
	});
	
	$('#account-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
	$('#forgot-page-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
	$('#login-page-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
	$('#reg-page-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
	
	$('#qbf-tel').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });

	
	$('#get-password').click(function() {
		$('.error').html('');
		$('.error-forgot').html('');
		$('.success-forgot').html('');
		$('.error-forgot').addClass('hidden');
		$('.success-forgot').addClass('hidden');
		if ($('#login-page-mail').val() == '') {
			$('.error-forgot').removeClass('hidden');
			$('.error-forgot').html('Введите ваш E-mail');
			return false;
		}
		var data = 'ClientMail=' + $('#login-page-mail').val();
		$.ajax({
			type: "POST",
			url: '/ajax/forgot',
			data: data,
			dataType: 'json',
			beforeSend: function() {
				//$('#recurring-description').html('');
			},
			success: function(data) {
				//var data = JSON.parse(data);
				if (data['error']) {
					$('.error-forgot').removeClass('hidden');
					$('.error-forgot').html(data['error']);
				} else if (data['success']) {
					$('.success-forgot').removeClass('hidden');
					$('.success-forgot').html(data['success']);
				}
			}
		});
	});
	
	$('.delivery .panel-item-heading').click(function() {
		$(this).closest('.panel-item').toggleClass('opened');
		$(this).closest('.panel-item').find('.panel-item-content').toggleClass('show');
	});
	
	$('.delete_universal_certificate').click(function() {
		$.ajax({
			type: "POST",
			url: '/ajax/deleteuniversalcertificate',
			dataType: 'json',
			beforeSend: function() {
				//$('#recurring-description').html('');
			},
			success: function(data) {
				if (data['success']) {
					location.reload();
				}
			}
		});
	});
	
	
	/*$('.checkout-order__delivery-content .checkout-order__delivery-item').click(function() {
		$('.checkout-order__delivery-content .checkout-order__delivery-item').removeClass('active');
		$(this).addClass('active');
		$(this).find('input').prop('checked', true);
		$(this).find('input').trigger('change');
	});*/
	
	
	/*if ($("#map_delivery").length) {
		
		$('#boxCertCustomerTastamat').change(function() {
			TastamatID = parseInt($(this).find(':selected').val());
			latitude = $(this).find(':selected').attr('data-latitude');
			longitude = $(this).find(':selected').attr('data-longitude');
			TastamatName = $(this).find(':selected').text();
			
			if (TastamatID) {
				$('#map_delivery').html('');
				$('#map_delivery').removeClass('hidden');
				
				ymaps.ready(function () {
					var mapDelivery = new ymaps.Map("map_delivery", {
						center: [latitude, longitude], 
						zoom: 18,
						controls: ['geolocationControl', 'fullscreenControl']
					});
					
					//mapDelivery.controls.add(new ymaps.control.TypeSelector(['yandex#map_delivery', 'yandex#satellite', 'yandex#hybrid', 'yandex#publicMap']));
					//mapDelivery.controls.add(new ymaps.control.ZoomControl({ options: { size: 'small' } }));
					
					myPlacemark = new ymaps.Placemark(mapDelivery.getCenter(), {
						balloonContentBody: ['<strong>' + TastamatName + '</strong>'].join('')
						}, {
						preset: 'islands#icon',
						iconColor: '#e21c8e'
					});
					
					mapDelivery.geoObjects.add(myPlacemark);
					

				});
			} else {
				$('#map_delivery').html('');
				$('#map_delivery').addClass('hidden');
			}
		});
		
		$('#boxCertCustomerTastamat').trigger('change');
	}*/
	
	if ($('#boxCertDelivery').length) {
		$('#boxCertDelivery input.js-order-delivery:checked').each(function() {
			$(this).closest('.delivery_groups-item').find('.delivery_groups-input').prop('checked', true);
		});
	};

	$('#boxCertDelivery label.delivery_groups').click(function() {
		$(this).closest('.delivery_groups-item').find('.checkout-order__delivery-delivery_methods .checkout-order__delivery-item:first-child input').prop('checked', true);
		$(this).closest('.delivery_groups-item').find('.checkout-order__delivery-delivery_methods .checkout-order__delivery-item:first-child input').trigger('change');
	});
	
	$('.product-info__price-col .custom-dropdown__btn').click(function() {
		$(this).closest('.custom-dropdown').toggleClass('show');
		$(this).closest('.custom-dropdown').find('.custom-dropdown__menu').toggleClass('show');
	});
	
	$('#stick-buy .product-info__price-col .custom-dropdown__menu .price-list__item').click(function() {
		var ProductOptionID = $(this).attr('data-id');
		//console.log(ProductOptionID);
		$('#product-option').val(ProductOptionID);
	
		$('.product-info__price-col .custom-dropdown__menu .price-list__item').removeClass('active');
		$(this).addClass('active');

		$('.price-dropdown__text .js-price__item-price').html( $(this).find('.js-price__item-price').html() );
		$('.price-dropdown__text .js-price__item-participant').html( $(this).find('.js-price__item-participant').html() );
		$('.price-dropdown__text .js-price__item-duration').html( $(this).find('.js-price__item-duration').html() );
		
		$('.gift-buy__amount').html( '<i class="icon icon_type_valute gift-buy__valute"></i> ' + $(this).find('.js-price__item-price').html() );
		
		$('.custom-dropdown').removeClass('show');
		$('.custom-dropdown__menu').removeClass('show');
	});

	if ($('#stick-buy .product-info__subcol').length) {
		$('#stick-buy .product-info__price-col .custom-dropdown__menu .price-list__item:first-child').trigger('click');
	};
	
	
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
	
	$('#stay-anonymous').change(function () {
		if ($('#stay-anonymous').prop("checked")) {
			$('#congratulation__sender').hide();
		} else {
			$('#congratulation__sender').show();
		}
	});

	popup_gift_card = new jBox('Modal', {
		content: $('#gift-card-slider-popup'),
		closeOnClick: false,
		closeButton: 'box',
		repositionOnContent: true,
		
		onCloseComplete: function onCloseComplete() {
		}
	});
	

	//$('#choose-postcard').click(function() {
		//popup_gift_card.open();
		
		var galleryTop = new Swiper('.gallery-gift-card-top', {
			spaceBetween: 10,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			//loop: true,
			loopedSlides: 4
		});
		let widgetSid = document.getElementById('widgetSid')?.value || '';
		var galleryThumbs = new Swiper('.gallery-gift-card-thumbs', {
			spaceBetween: 10,
			centeredSlides: true,
			//slidesPerView: 'auto',
			touchRatio: 0.8,
			slideToClickedSlide: true,
			//loop: true, 
			//loopedSlides: 4,
			slidesPerView: 5,
			loopedSlides: 3,
			on: {
				slideChange: function slideChange(param) {
					gallery_gift_card_active_giftcardid = $('.gallery-gift-card-top .swiper-slide-active img').attr('data-GiftCardID');
					$('#order-gift-card-id').val(gallery_gift_card_active_giftcardid);
					
					$.ajax({
						type: "POST",
						url: '/ajax/setGiftCard',
						data: { id: gallery_gift_card_active_giftcardid, widSid: widgetSid },
						cache: false,
						dataType: "json",
						success: function(data) {
							console.log('setGiftCard');
						}
					});
				}
			} 
		});
		galleryTop.controller.control = galleryThumbs;
		galleryThumbs.controller.control = galleryTop;
	//});
	
	$('.select-gift-card').click(function(){
		gallery_gift_card_active = $('.gallery-gift-card-top .swiper-slide-active img').attr('src');
		gallery_gift_card_active_giftcardid = $('.gallery-gift-card-top .swiper-slide-active img').attr('data-GiftCardID');
		$('.rectangle-block img').attr('src', gallery_gift_card_active);
		$('#order-gift-card-id').val(gallery_gift_card_active_giftcardid);
		popup_gift_card.close();
		
		$.ajax({
			type: "POST",
			url: '/ajax/setGiftCard',
			data: { id: gallery_gift_card_active_giftcardid, widSid: widgetSid },
			cache: false,
			dataType: "json",
			success: function(data) {
				console.log('setGiftCard');
			}
		});
	});
	
	if ($('#order-gift-card-id').length) {
		gallery_gift_card_active_giftcardid = $('#order-gift-card-id').val();
		if (gallery_gift_card_active_giftcardid) {
			$.ajax({
				type: "POST",
				url: '/ajax/setGiftCard',
				data: { id: gallery_gift_card_active_giftcardid, widSid: widgetSid },
				cache: false,
				dataType: "json",
				success: function(data) {
					console.log('setGiftCard');
				}
			});
		}
	}
	

	$(document).on('click', '.js-gift-buy-modal', function (e) {
		e.preventDefault();
		
		$('#modal-price-list').html('');
		$(this).parent().parent().find('.product-option-block').clone().appendTo('#modal-price-list');
		$('#modal-price-list .product-option-block').removeClass('hidden');
		
		popup = new jBox('Modal', {
			content: $('#product-options-select'),
			closeOnClick: false,
			closeButton: 'box',
			
		});
		
		popup.open();
		
		$('.jBox-overlay').css('background-color', 'rgba(0, 0, 0, .82)');
		
		$(this).text('В корзине');
		
		$('.js-gift-buy-options').unbind('click');
		$('.js-gift-buy-options').click(function(e) {		
			var $that = $(this),
			$form = $that.closest('.gift-buy'),
			$cart = $('.cart'),
			$cart_total = $cart.find('.cart__total');
			
			option_data = false;
			
			if ($(this).closest('.price-list__item').length) {
				option_data = $(this).closest('.price-list__item').attr('data-id');
			}

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
					type_price: $that.data('type_price'),
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
					
					popup.close();
					
					//$that.text('В корзине');
					
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
						
				},
				error: function error(response) {
					$that.prop('disabled', false).text('Купить');
					var responseMessage = $.parseJSON(response.responseText);
					validation.writeError($form, responseMessage);
				}
			});

		});

		return false;
		
	});


	$(document).on('click', '.js-add-to-constructor-modal', function (e) {
		e.preventDefault();
		
		$('#modal-price-list').html('');
		$(this).parent().find('.product-option-block').clone().appendTo('#modal-price-list');
		$('#modal-price-list .product-option-block').removeClass('hidden');
		
		popup = new jBox('Modal', {
			content: $('#product-options-select'),
			closeOnClick: false,
			closeButton: 'box',
			
		});
		
		popup.open();
		
		$('.jBox-overlay').css('background-color', 'rgba(0, 0, 0, .82)');
		
		$('.js-add-to-constructor-options').unbind('click');
		$('.js-add-to-constructor-options').click(function(e) {
			var productId = $(this).attr('data-pid');
			
			var emptyProductBox = $('.constructor-box__item_empty');
			if (emptyProductBox.length == 0) {
				showNotification('В наборе максимальное число подарков', 'error');
				return;
			}
			
			emptyProductBox = emptyProductBox.first(); 
			
			option_data = false;
			
			if ($(this).closest('.price-list__item').length) {
				option_data = $(this).closest('.price-list__item').attr('data-id');
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
						
						popup.close();
					}
				},
				error: function error(response) {
					showNotification(response.errorCode + '<br>Обновите страницу, затем повторите действие.', 'error');
				}
			});

		});

		return false;
		
	});


	$('.partner-room .unload-excel').click(function(){
		$('input[name=unloadExcel]').val(1);
		$('#catalogFilterSelect').trigger('click');
	});

	$('.js-select-checkout-order').click(function () {
		$('html, body').animate({
			scrollTop: $('.certificate-appearance').offset().top
		}, 800);
	});
	
	$('.js-order-delivery').on('change', function() {
		type_delivery_id = $(this).val();
		if ((type_delivery_id == 2) || (type_delivery_id == 12)) {
			$('.payment-cash-block').addClass('hidden');
			$('#PayBox2').prop('checked', true);
			$('.js-payment-type').trigger('change')
		} else {
			$('.payment-cash-block').removeClass('hidden');
		}
	});
	
	
	$('.search-form-open').click(function () {
		$('.search-form').toggleClass('open');
	});
	
	$('.search-container .search-btn').click(function () {
		$(this).parent().find('input').removeClass('.input_type_error');
		
		search_val = $(this).parent().find('input').val();
		
		if (!search_val.length) {
			$(this).parent().find('input').addClass('input_type_error');
			return false;
		}
		
		if ($('#catalogFilter').length) {
			$('#catalogFilter input[name=keyword]').val(search_val);
			$('#catalogFilterSelect').trigger('click');
		} else {
			window.location.href = '/catalog/?keyword=' + search_val;
		}
	});
	
	$('.search-container input').on('keydown', function(e) {
		if (e.keyCode == 13) {
			$(this).parent().find('.search-btn').trigger('click');
		}
	});

	$('.overlay__service-close').click(function(){
		$('.jBox-closeButton').trigger('click');
	});



});	


jQuery(function($){
	$(document).mouseup( function(e){
		var div = $('.search-container .search-form');
		if (!div.is(e.target) && div.has(e.target).length === 0 ) {
			div.removeClass('open');
		}
	});
});








function reloadJSPopupActivateUniversalCertificate() {
	console.log('reloadJSPopupActivateUniversalCertificate');
	
	$('#popup-activate-universal-certificate').unbind('click');
	$('#popup-activate-universal-certificate').click(function() {
	
		var data = 'CertificateCode=' + $('#activate-num').val();
		$.ajax({
			type: "POST",
			url: '/ajax/checkuniversalcertificate',
			data: data,
			cache: false,
			beforeSend: function() {
				$('.activation-box__send').addClass('loading-btn');
			},
			complete: function() {
				$('.activation-box__send').removeClass('loading-btn');
			}, 
			dataType: 'json',
			success: function(data) {
				if (data['error']) {
					validation.writeError($('#activation-popup'), data['error']);
					
					$('#activation-popup').find('#activate-num').addClass('input_type_error');
				} else if (data['success']) {
					$('#activation-popup').find('#activate-num').removeClass('hidden');
					
					$('#activation-popup p.validation').remove();
					
					var process_data = 'CertificateCode=' + $('#activate-num').val();
					$.ajax({
						type: "POST",
						url: '/ajax/processactivateuniversalcertificate',
						data: process_data,
						cache: false,
						beforeSend: function() {
							$('.activation-box__send').addClass('loading-btn');
						},
						complete: function() {
							$('.activation-box__send').removeClass('loading-btn');
						}, 
						dataType: 'json',
						success: function(response) { 
						
							window.location.href = response.redirect;
							return false;
						
							$('#activation-popup').closest('.jBox-wrapper').find('.jBox-closeButton').trigger('click');
								
							$('#activation-popup-universal-certificate').html(response.html);
							
							popup_activation_popup_universal_certificate = new jBox('Modal', {
								content: $('#activation-popup-universal-certificate'),
								closeOnClick: false,
								closeButton: 'box',
								repositionOnContent: true,
								
								onCloseComplete: function onCloseComplete() {
									$('#activation-popup-universal-certificate').html('');
								}
							});
							
							
							$('.catalog-filter__select').niceSelect();

							if ($('#constructorBoxSlider').length) {
								let constructorSlider = new Swiper("#constructorBoxSlider", {
									slidesPerView: "auto",
									spaceBetween: 15,
									navigation: {
										nextEl: "#constructorBoxSlider .swiper-button-next",
										prevEl: "#constructorBoxSlider .swiper-button-prev",
									},
									breakpoints: {
										1240: {
											spaceBetween: 10,
											slidesOffsetBefore:25,
											slidesPerView: "auto",
										}
									}
								});
							 
								$("#catalogCategoryFilter").change(function(){
									$(".load-more__button").attr("data-theme", $(this).val());
								});
								$("#catalogWhoFilter").change(function(){
									$(".load-more__button").attr("data-who", $(this).val());
								});
								$("#catalogPriceFilter").change(function(){
									$(".load-more__button").attr("data-price", $(this).val());
								});
								$("#catalogFilterSelect").click(function(event){
									event.preventDefault();
									
									let $catalog = $("#giftsCatalogList");
									$catalog.addClass("catalog-list_loading");

									let form_data = {
										type: "constructorUniversalCertificate",
										page: 1,
										town: 1,
										theme: $("#catalogCategoryFilter").val(),
										who: $("#catalogWhoFilter").val(),
										price: $("#catalogPriceFilter").val(),
									};
									loadMore(
										form_data,
										function(response){
											$catalog.removeClass("catalog-list_loading");
											$catalog.html(response.html);
										},
										function(){
											$catalog.removeClass("catalog-list_loading");
											showNotification("Обновите страницу, затем повторите действие.", "error");
										}
									);

								});
								
								$('#catalogFilterSelect').trigger('click');
							}
							
							popup_activation_popup_universal_certificate.open();
							
							$('#activation-popup-universal-certificate').closest('.jBox-container').addClass('background-color-eee');
							
							reloadJSPopupActivateUniversalCertificateProcessing();
							
							$('#activate-phone').inputmask({ 'mask': '+7 (999) 999-99-99', showMaskOnHover: false });
							
							loadMoreInProcess = false;
						}
						
					});
					
				}
			}
		});

	});
	
}



function reloadJSPopupActivateUniversalCertificateProcessing() {
	console.log('reloadJSPopupActivateUniversalCertificateProcessing');
	
	$('.activation-box_step_universalcertificate .js-back').unbind('click');
	$('.activation-box_step_universalcertificate .js-back').click(function() {
		$('#activation-popup-universal-certificate').closest('.jBox-wrapper').find('.jBox-closeButton').trigger('click');
		$('.js-activate').trigger('click');
	});
	
	$('.activation-box_step_universalcertificate .js-back-to-step-2').unbind('click');
	$('.activation-box_step_universalcertificate .js-back-to-step-2').click(function() {
		$('.activation-box_step_universalcertificate-confirm').addClass('hidden');
		$('.activation-box_step_universalcertificate-select-gift').removeClass('hidden');
	});
	
	
	$('.go-to-activate-universal-certificate').unbind('click');
	$('.go-to-activate-universal-certificate').click(function(){
		$('.go-to-activate-universal-certificate').addClass('loading-btn');
		
		//return false;
	
		ProductID_arr = [];
		ProductName_arr = [];
		gift_img_arr = [];
		ProductPrice_arr = [];

		$.ajax({
			type: "POST",
			async: false,
			url: "/ajax/clearcartopengiftvalue",
			cache: false,
			dataType: "json",
			success: function success(response) {
			},
			error: function error(response) {
			}
		});
	
		total_price = 0;
		$('#constructorBoxSlider .constructor-box__item').each(function(index) {
			if ($(this).find('.ProductID').length) {
				ProductID_arr.push($(this).find('.ProductID').val());
				ProductName_arr.push($(this).find('.ProductName').val());
				gift_img_arr.push($(this).find('.gift_img').val());
				
				ProductPrice_arr.push($(this).find('.ProductPrice').val());
				
				if ($(this).find('.ProductPrice').length) {
					total_price += parseFloat($(this).find('.ProductPrice').val());
				}
				
				$.ajax({
					type: 'POST',
					async: false,
					url: "/ajax/addtocartopengiftvalue",
					data: { 
						pid: $(this).find('.ProductID').val(),
						option_data: false,
					},
					cache: false,
					dataType: 'json',
					success: function success(response) {
					},
					error: function error(response) {
					}
				});
			}
		});
		
		if (ProductID_arr.length == 0) {
			$('.go-to-activate-universal-certificate').removeClass('loading-btn');
			return false;
		}
		
		data_gift = '';
		
		$.each(ProductID_arr, function(index,value) {
			data_gift += '<div class="product__info-container-item">';
			data_gift += '<div class="product__info">';
			data_gift += '<div class="product__content">';
			data_gift += '<img src="' + gift_img_arr[index] + '" class="img-responsive activate-gift-img">';
			data_gift += '<p class="product__title activate-gift-name">' + ProductName_arr[index] + '</p>';
			data_gift += '</div>';
			data_gift += '<div class="type-certificate hidden">';
			data_gift += 'Тип сертификата:<br>Подарочный';
			data_gift += '<input class="input" type="hidden" name="activate[gift]" value="' + ProductID_arr[index] + '">';
			data_gift += '</div>';
			data_gift += '</div>';
			data_gift += '<div class="checkout-product__price">';
			data_gift += '<i class="icon icon_type_valute checkout-product__valute"></i>';
			data_gift += '<span>' + parseFloat(ProductPrice_arr[index]).toLocaleString('ru') + '</span>';
			data_gift += '</div>';
			data_gift += '</div>';
		});
		
		CertificateBalance = parseFloat($('.constructor-box input.CertificateBalance').val());
		
		remainderCertificateBalance = CertificateBalance - total_price;
		
		if (remainderCertificateBalance < 0) {
			missing_amount = total_price - CertificateBalance;
		
			data_gift += '<div class="product__info-container-item surcharge-amount-container">';
			data_gift += '<div class="product__info">';
			data_gift += '<div class="product__content">';
			data_gift += '<p class="product__title activate-gift-name">Сумма, необходимая к оплате сверх номинала подарочного сертификата</p>';
			data_gift += '</div>';
			data_gift += '</div>';
			data_gift += '<div class="checkout-product__price">';
			data_gift += '<i class="icon icon_type_valute checkout-product__valute"></i>';
			data_gift += '<span>' + missing_amount.toLocaleString('ru') + '</span>';
			data_gift += '</div>';
			data_gift += '</div>';
			
			$('.activate-certificate-form-value-payment').removeClass('hidden');
		}
		
		$('.product__info-container').html(data_gift);
		
		$('#total-gift-set').html(total_price.toLocaleString('ru'));
		
		$('.activation-box_step_universalcertificate-select-gift').addClass('hidden');
		$('.activation-box_step_universalcertificate-confirm').removeClass('hidden');
		
		$('.go-to-activate-universal-certificate').removeClass('loading-btn');
		
		$('body').trigger('resize');
	});


	$('.remove-select-gift-value-btn').unbind('click');
	$('.remove-select-gift-value-btn').on('click', function(e) {
		$('.constructor-container-gift_id-' + $(this).closest('.constructor-box__item').find('.ProductID').val()).find('.gift-activation-box__gifts-item').removeClass('catalog-list__item_inbox');
		
		$(this).closest('.constructor-box__item').addClass('constructor-box__item_empty');
		$(this).closest('.constructor-box__item').html('');
		
		total_price = 0;
		$('#constructorBoxSlider .constructor-box__item').each(function(index) {
			if ($(this).find('.ProductPrice').length) {
				total_price += parseFloat($(this).find('.ProductPrice').val());
			}
		});
		
		CertificateBalance = parseFloat($('.constructor-box input.CertificateBalance').val());
		
		remainderCertificateBalance = CertificateBalance - total_price;
		
		if (remainderCertificateBalance >= 0) {
			$('.constructor-price-type').html('Остаток номинала');
			$('.open-gift-constructor-price').removeClass('insufficient-funds');
		} else {
			$('.constructor-price-type').html('Сумма доплаты');
			$('.open-gift-constructor-price').addClass('insufficient-funds');
		}
		
		$('.open-gift-constructor-price').html(remainderCertificateBalance.toLocaleString('ru'));
	});

	$('.select-gift-value-btn, .choose-gift-value').unbind('click');
	$('.select-gift-value-btn, .choose-gift-value').click(function() {
		ProductID = $(this).parent().find('.ProductID').val();
		ProductName = $(this).parent().find('.ProductName').val();
		gift_img = $(this).parent().find('.gift_img').val();
		ProductPrice = $(this).parent().find('.ProductPrice').val();
		
		
		var emptyProductBox = $('.constructor-box__item_empty');
		if (emptyProductBox.length == 0) {
			showNotification('В наборе максимальное число подарков', 'error');
			return;
		}
		
		
		ProductID_arr = [];
	
		$('#constructorBoxSlider .constructor-box__item').each(function(index) {
			if ($(this).find('.ProductID').length) {
				ProductID_arr.push($(this).find('.ProductID').val());
			}
		});
		
		if ($.inArray(ProductID, ProductID_arr) !== -1) {
			return false;
		}
		
		
		emptyProductBox = emptyProductBox.first();
		
		data_product = '<img class="constructor-box__item-image" src="' + gift_img + '" >';
		data_product += '<i class="constructor-box__item-remove remove-select-gift-value-btn"></i>';
		
		data_product += '<div class="hidden">';
		data_product += '<input type="hidden" class="ProductID" value="' + ProductID + '">';
		data_product += '<input type="hidden" class="ProductName" value=\'' + ProductName + '\'>';
		data_product += '<input type="hidden" class="gift_img" value="' + gift_img + '">';
		data_product += '<input type="hidden" class="ProductPrice" value="' + ProductPrice + '">';
		data_product += '</div>';
		
		emptyProductBox.html(data_product);
		emptyProductBox.removeClass('constructor-box__item_empty');
		
		$('.constructor-container-gift_id-' + ProductID).find('.gift-activation-box__gifts-item').addClass('catalog-list__item_inbox');
		
		total_price = 0;
		$('#constructorBoxSlider .constructor-box__item').each(function(index) {
			if ($(this).find('.ProductPrice').length) {
				total_price += parseFloat($(this).find('.ProductPrice').val());
			}
		});
		
		CertificateBalance = parseFloat($('.constructor-box input.CertificateBalance').val());
		
		remainderCertificateBalance = CertificateBalance - total_price;
		
		if (remainderCertificateBalance >= 0) {
			$('.constructor-price-type').html('Остаток номинала');
			$('.open-gift-constructor-price').removeClass('insufficient-funds');
		} else {
			$('.constructor-price-type').html('Сумма доплаты');
			$('.open-gift-constructor-price').addClass('insufficient-funds');
		}
		
		$('.open-gift-constructor-price').html(remainderCertificateBalance.toLocaleString('ru'));
		
		
		reloadJSPopupActivateUniversalCertificateProcessing();
		
	});

	$('.confirm-activate-universal-certificate').unbind('click');
	$('.confirm-activate-universal-certificate').click(function() {
		var data = $('#activate-certificate-form-value').serializeArray();
		
		//console.log(data);
		//return false;
		
		$.ajax({
			type: 'POST',
			url: '/ajax/activateuniversalcertificate',
			data: data,
			cache: false,
			beforeSend: function() {
				$('.confirm-activate-universal-certificate').addClass('loading-btn');
			},
			complete: function() {
				$('.confirm-activate-universal-certificate').removeClass('loading-btn');
			}, 
			dataType: 'json',
			success: function(data) {
				if (data['error']) {
					for (i in data['error']) {
						$('#activate-certificate-form-value').find('[name="activate[' + i + ']"]').addClass('input_type_error');
					}
				} else if (data['redirect']) {
					location = data['redirect'];
				} else if (data['success']) {
					$('.activation-box_step_universalcertificate-confirm').addClass('hidden');
					$('.activation-box_step_universalcertificate-success').removeClass('hidden');
					$('.open-gift-slide-4 .success-success').removeClass('hidden');
					$('body').trigger('resize');
				} else if (data['error_activate']) {
					$('.activation-box_step_universalcertificate-confirm').addClass('hidden');
					$('.activation-box_step_universalcertificate-success').removeClass('hidden');
					$('.open-gift-slide-4 .success-error').removeClass('hidden');
					$('body').trigger('resize');
				}
			}
		});
		
	});
	
	
	var loadMoreInProcess = false;
	
	$('.confirm-activate-universal-certificate').unbind('load');
	$('.confirm-activate-universal-certificate').unbind('resize');
	$('.confirm-activate-universal-certificate').unbind('scroll');
	$('.jBox-Modal .jBox-content').on('load resize scroll', function () {
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

}