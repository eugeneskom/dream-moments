$(document).ready(function(){
	function get_bannersSwiper() {
		var bannersSwiper = new Swiper("#bannersSlider", {
			loop: true,
			navigation: {
				nextEl: "#bannersSlider .swiper-button-next",
				prevEl: "#bannersSlider .swiper-button-prev",
			},
			pagination: {
				el: "#bannersSlider .swiper-pagination"
			},
			autoplay: {
				delay: 5000,
			},
			on: {
				resize: function(){
					bannersSwiper.update();
				}
			}
		});
	};
	var gallerySwiper = new Swiper("#gallerySlider", {
		loop: true,
		navigation: {
			nextEl: "#gallerySlider .swiper-button-next",
			prevEl: "#gallerySlider .swiper-button-prev",
		},
		pagination: {
			el: "#gallerySlider .swiper-pagination"
		},
		autoplay: {
			delay: 5000,
		}
	});
	setTimeout(get_bannersSwiper, 4000); 
	var giftsSwiper = new Swiper("#giftsSlider", {
		slidesPerView: "auto",
		spaceBetween: 20,
		breakpoints: {
			320: {
				initialSlide: 0,
				centeredSlides: true,
				loop: true,
			},
			767: {
				initialSlide: 0,
				centeredSlides: true,
				loop: true,
			},
		}
	});
	var lastViewedGiftsSwiper = new Swiper("#lastViewedGiftsSlider", {
		slidesPerView: "auto",
		spaceBetween: 20,
		breakpoints: {
			767: {
				initialSlide: 1,
				centeredSlides: true,
				loop: true,
			}
		}
	});
	var aboutDelivery = new Swiper("#aboutDelivery", {
		slidesPerView: 4,
		pagination: {
			el: ".gift-about-delivery__pagination",
			type: "bullets",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 10,
			}
		}
	});
	var aboutWorks = new Swiper("#aboutWorks", {
		slidesPerView: 4,
		pagination: {
			el: ".gift-about-Works__pagination",
			type: "bullets",
		},
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 10,
			}
		}
	});
	var aboutRewiews = new Swiper("#aboutRewiews", {
		slidesPerView: 1,
		spaceBetween: 10,
		pagination: {
			el: ".gift-about-rewiews__pagination",
			type: 'fraction',
			
			renderFraction: function (currentClass, totalClass) {
				return '<span class="' + currentClass + '"></span>' +
				' / ' +
				'<span class="' + totalClass + '"></span>';
			}
		}
	});
	var aboutCover = new Swiper("#aboutCover", {
		centeredSlides: true,
		slidesPerView: 1,
		centeredSlides: true,
		slideActiveClass: "swiper-slide-active gift-about-cover__item_active",
		/*breakpoints: {
			767: {
			slidesPerView: "auto",
			}
		}*/
	});
	$(".gift-about-cover__thumbnails-preview").each(function(index){
		$(this).click(function(){
			aboutCover.slideTo(index);
		})
	});
	$('div.gift-about-cover__thumbnails-items').on('click', 'img:not(.gift-about-cover__anim)', function() {
		$(this)
	.addClass('gift-about-cover__anim').siblings().removeClass('gift-about-cover__anim')});
	
	$('ul.multi__gift-tabs').on('click', 'li:not(.multi__gift-tabs_item-active)', function() {
		$(this)
		.addClass('multi__gift-tabs_item-active').siblings().removeClass('multi__gift-tabs_item-active')
		.closest('div.container__main').find('div.multi__gift-content').removeClass('multi__gift-content_active').eq($(this).index()).addClass('multi__gift-content_active');
	});
	
	const catalog = document.querySelector('.header__main-catalog'),
    dpdw = document.querySelector('.header__main-dpdw');
	
    dpdw.addEventListener('click', () => {
        dpdw.classList.toggle('header__main-dpdw_active');
        catalog.classList.toggle('header__main-catalog_active');
	});
	
    
    const menu = document.querySelector('.header__main-nav_mini'),
    hamburger = document.querySelector('.header__main-hamburger');
	
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('header__main-hamburger_active');
        menu.classList.toggle('header__main-nav_mini-active');
	});
	
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(['exports'], factory);
		} else if (typeof exports !== 'undefined') {
            factory(exports);
		} else {
            factory((root.dragscroll = {}));
		}
		}(this, function (exports) {
			var _window = window;
			var _document = document;
			var mousemove = 'mousemove';
			var mouseup = 'mouseup';
			var mousedown = 'mousedown';
			var EventListener = 'EventListener';
			var addEventListener = 'add'+EventListener;
			var removeEventListener = 'remove'+EventListener;
			var newScrollX, newScrollY;
			
			var dragged = [];
			var reset = function(i, el) {
				for (i = 0; i < dragged.length;) {
					el = dragged[i++];
					el = el.container || el;
					el[removeEventListener](mousedown, el.md, 0);
					_window[removeEventListener](mouseup, el.mu, 0);
					_window[removeEventListener](mousemove, el.mm, 0);
				}
				
				// cloning into array since HTMLCollection is updated dynamically
				dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
				for (i = 0; i < dragged.length;) {
					(function(el, lastClientX, lastClientY, pushed, scroller, cont){
						(cont = el.container || el)[addEventListener](
							mousedown,
							cont.md = function(e) {
								if (!el.hasAttribute('nochilddrag') ||
									_document.elementFromPoint(
										e.pageX, e.pageY
									) == cont
									) {
									pushed = 1;
									lastClientX = e.clientX;
									lastClientY = e.clientY;
									
									e.preventDefault();
								}
							}, 0
						);
						
						_window[addEventListener](
							mouseup, cont.mu = function() {pushed = 0;}, 0
						);
						
						_window[addEventListener](
							mousemove,
							cont.mm = function(e) {
								if (pushed) {
									(scroller = el.scroller||el).scrollLeft -=
                                    newScrollX = (- lastClientX + (lastClientX=e.clientX));
									scroller.scrollTop -=
                                    newScrollY = (- lastClientY + (lastClientY=e.clientY));
									if (el == _document.body) {
										(scroller = _document.documentElement).scrollLeft -= newScrollX;
										scroller.scrollTop -= newScrollY;
									}
								}
							}, 0
						);
					})(dragged[i++]);
				}
			}
			
			
			if (_document.readyState == 'complete') {
				reset();
			} else {
				_window[addEventListener]('load', reset, 0);
			}
			
			exports.reset = reset;
		}));
		
		const anchors = document.querySelectorAll('a[href*="#"]')
		
        for (let anchor of anchors) {
			anchor.addEventListener('click', function (e) {
				e.preventDefault()
				
				const blockID = anchor.getAttribute('href').substr(1)
				
				document.getElementById(blockID).scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			})
		};
		
		if ($('#main_qusetions_accordion').length) {
			class ItcAccordion {
				constructor(target, config) {
					this._el = typeof target === 'string' ? document.querySelector(target) : target;
					const defaultConfig = {
						alwaysOpen: true
					};
					this._config = Object.assign(defaultConfig, config);
					this.addEventListener();
				}
				addEventListener() {
					this._el.addEventListener('click', (e) => {
						const elHeader = e.target.closest('.main__questions-title');
						if (!elHeader) {
							return;
						}
						if (!this._config.alwaysOpen) {
							const elOpenItem = this._el.querySelector('.main__questions-item_show');
							if (elOpenItem) {
								elOpenItem !== elHeader.parentElement ? elOpenItem.classList.toggle('main__questions-item_show') : null;
							}
						}
						elHeader.parentElement.classList.toggle('main__questions-item_show');
					});
				}
			};
			new ItcAccordion(document.querySelector('#main_qusetions_accordion'), {
				alwaysOpen: true
			});
		}
		
		
		$('[data-modal="buy__offer"]').on('click', function() {
            $('.overlay__buy-offer').fadeIn('slow');
		}); 
        $('.overlay__service-close').on('click', function() {
            $('.overlay__wrapp').fadeOut('slow');
		}); 
});
