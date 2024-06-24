/**
	Template Name 	 : glower
	Author			 : IndianCoder
	Version			 : 1.0
	File Name	     : custom.js
	Author Portfolio : https://themeforest.net/user/indiancoder/portfolio
	
	Core script to handle the entire theme and core functions
**/

var glower = function(){
	/* Search Bar ============ */
	siteUrl = '';
	
	var screenWidth = $( window ).width();
		
	/* WOW ANIMATION ============ */
	var wow_animation = function(){
		if($('.wow').length > 0)
		{
			var wow = new WOW(
			{
			  boxClass:     'wow',      // animated element css class (default is wow)
			  animateClass: 'animated', // animation css class (default is animated)
			  offset:       50,          // distance to the element when triggering the animation (default is 0)
			  mobile:       false       // trigger animations on mobile devices (true is default)
			});
			
			setTimeout(function(){
				wow.init();
			}, 2100);
		}	
	}
	
	
	/* Header Height ============ */
	var handleResizeElement = function(){
		var headerTop = 0;
		var headerNav = 0;
		
		$('.header .sticky-header').removeClass('is-fixed');
		$('.header').removeAttr('style');
		
		if(jQuery('.header .top-bar').length > 0 &&  screenWidth > 991)
		{
			headerTop = parseInt($('.header .top-bar').outerHeight());
		}

		if(jQuery('.header').length > 0 )
		{
			headerNav = parseInt($('.header').height());
			headerNav =	(headerNav == 0)?parseInt($('.header .main-bar').outerHeight()):headerNav;
		}	
		
		var headerHeight = headerNav + headerTop;
		
		jQuery('.header').css('height', headerHeight);
	}
	
	var handleResizeElementOnResize = function(){
		var headerTop = 0;
		var headerNav = 0;
		
		$('.header .sticky-header').removeClass('is-fixed');
		$('.header').removeAttr('style');
		
		
		setTimeout(function(){
			
			if(jQuery('.header .top-bar').length > 0 &&  screenWidth > 991)
			{
				headerTop = parseInt($('.header .top-bar').outerHeight());
			}

			if(jQuery('.header').length > 0 )
			{
				headerNav = parseInt($('.header').height());
				headerNav =	(headerNav == 0)?parseInt($('.header .main-bar').outerHeight()):headerNav;
			}	
			
			var headerHeight = headerNav + headerTop;
			
			jQuery('.header').css('height', headerHeight);
		
		}, 500);
    }
	
	/* Load File ============ */
	var dzTheme = function(){
		'use strict';
		
		if(screenWidth <= 991 ){
			jQuery('.navbar-nav > li > a, .sub-menu > li > a').unbind().on('click', function(e){
				if(jQuery(this).parent().hasClass('open'))
				{
					jQuery(this).parent().removeClass('open');
				}
				else{
					jQuery(this).parent().parent().find('li').removeClass('open');
					jQuery(this).parent().addClass('open');
				}
			});
		}
		
		jQuery('.menu-btn, .openbtn').on('click',function(){
			jQuery('.contact-sidebar').addClass('active');
		});
		jQuery('.menu-close').on('click',function(){
			jQuery('.contact-sidebar').removeClass('active');
			jQuery('.menu-btn').removeClass('open');
		});
		
		jQuery('.dz-carticon').on('click',function(){
			jQuery(this).toggleClass('active');
		});
		jQuery('.dz-wishicon').on('click',function(){
			jQuery(this).toggleClass('active');
		});
	}
	
	/* Magnific Popup ============ */
	var MagnificPopup = function(){
		'use strict';	
		
		if(jQuery('.mfp-gallery').length > 0)
		{
			/* magnificPopup function */
			jQuery('.mfp-gallery').magnificPopup({
				delegate: '.mfp-link',
				type: 'image',
				tLoading: 'Loading image #%curr%...',
				mainClass: 'mfp-img-mobile',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						return item.el.attr('title') + '<small></small>';
					}
				}
			});
			/* magnificPopup function end */
		}
		
		if(jQuery('.mfp-video').length > 0)
		{
			/* magnificPopup for Play video function */		
			jQuery('.mfp-video').magnificPopup({
				type: 'iframe',
				iframe: {
					markup: '<div class="mfp-iframe-scaler">'+
							 '<div class="mfp-close"></div>'+
							 '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
							 '<div class="mfp-title">Some caption</div>'+
							 '</div>'
				},
				callbacks: {
					markupParse: function(template, values, item) {
						values.title = item.el.attr('title');
					}
				}
			});
			
		}

		if(jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').length > 0)
		{	
			/* magnificPopup for Play video function end */
			$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,

				fixedContentPos: true
			});
		
		}
		
	}
	
	/* Scroll To Top ============ */
	var scrollTop = function (){
		'use strict';
		var scrollTop = jQuery("button.scroltop");
		/* page scroll top on click function */	
		scrollTop.on('click',function() {
			jQuery("html, body").animate({
				scrollTop: 0
			}, 1000);
			return false;
		})

		jQuery(window).bind("scroll", function() {
			var scroll = jQuery(window).scrollTop();
			if (scroll > 900) {
				jQuery("button.scroltop").fadeIn(1000);
			} else {
				jQuery("button.scroltop").fadeOut(1000);
			}
		});
		/* page scroll top on click function end*/
	}
	
	/* Header Fixed ============ */
	var headerFix = function(){
		'use strict';
		/* Main navigation fixed on top  when scroll down function custom */		
		jQuery(window).on('scroll', function () {
			if(jQuery('.sticky-header').length > 0){
				var menu = jQuery('.sticky-header');
				if ($(window).scrollTop() > menu.offset().top) {
					menu.addClass('is-fixed');
				} else {
					menu.removeClass('is-fixed');
				}
			}
		});
		/* Main navigation fixed on top  when scroll down function custom end*/
	}
	
	/* Masonry Box ============ */
	var masonryBox = function(){
		'use strict';
		/* masonry by  = bootstrap-select.min.js */
		if(jQuery('#masonry, .masonry').length > 0)
			{
			var self = jQuery("#masonry, .masonry");
	 
			if(jQuery('.card-container').length > 0)
			{
				var gutterEnable = self.data('gutter');
				
				var gutter = (self.data('gutter') === undefined)?0:self.data('gutter');
				gutter = parseInt(gutter);
				
				
				var columnWidthValue = (self.attr('data-column-width') === undefined)?'':self.attr('data-column-width');
				if(columnWidthValue != ''){columnWidthValue = parseInt(columnWidthValue);} 
			} 
		}
		
		
		if(jQuery('#Isotope, .isotope').length > 0)
			{
				var self = jQuery("#Isotope, .isotope");
				
				self.isotope({
				  itemSelector: '.card-container',
				  layoutMode: 'fitRows',
				});
				
			}
		
		if(jQuery('.filters').length)
		{
			
			
			
			jQuery(".filters li:first").addClass('active');
			
			jQuery(".filters").on("click", "li", function() {
				jQuery('.filters li').removeClass('active');
				jQuery(this).addClass('active');
				
				var filterValue = $(this).attr("data-filter");
				self.isotope({ filter: filterValue});
			});
		}
		/* masonry by  = bootstrap-select.min.js end */
	}
	
	/* Counter Number ============ */
	var counter = function(){
		if(jQuery('.counter').length)
		{
			jQuery('.counter').counterUp({
				delay: 10,
				time: 5000
			});	
		}
	}
	
	/* Resizebanner ============ */
	var handleBannerResize = function(){
		$(".full-height").css("height", $(window).height());
	}
	
	/* Website Launch Date */ 
	var WebsiteLaunchDate = new Date();
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	WebsiteLaunchDate.setMonth(WebsiteLaunchDate.getMonth() + 1);
	WebsiteLaunchDate =  WebsiteLaunchDate.getDate() + " " + monthNames[WebsiteLaunchDate.getMonth()] + " " + WebsiteLaunchDate.getFullYear();
	/* Website Launch Date END */ 
	
	
	var navScroller = function(){
		var previousScroll = 0;
		$(window).scroll(function(){
			if(screenWidth <= 768 ){
				if ($(this).scrollTop() + 
					$(this).innerHeight() >=  
					document.querySelector("body").scrollHeight) { 
					 $('.extra-nav').addClass('bottom-end');
				}else{
					 $('.extra-nav').removeClass('bottom-end');
				}
				var currentScroll = $(this).scrollTop();
				if (currentScroll > previousScroll){
					//scroll down
					$('.extra-nav').addClass('active');
				} else {
					//scroll up
					$('.extra-nav').removeClass('active');
				}
				previousScroll = currentScroll;
			}
			
		});
	}
	
	var handleTagSlider = function(){
		if(jQuery('#tagSlider').length > 0){
			$('#tagSlider').grouploop({
				velocity: 1,
				forward: false,
				pauseOnHover: true,
				childNode: ".item",
				childWrapper: ".item-wrap"
			});
			
		}
		if(jQuery('#tagSlider2').length > 0){
			$('#tagSlider2').grouploop({
				velocity: 1,
				forward: true,
				pauseOnHover: true,
				childNode: ".item",
				childWrapper: ".item-wrap"
			});
			
		}
	}
	
	var setCurrentYear = function(){
		const currentDate = new Date();
          let currentYear = currentDate.getFullYear();
		  
         let elements = document.getElementsByClassName('current-year'); 

		for (const element of elements) {
            element.innerHTML = currentYear;
        }
	}
	
	/* handleSupport */
	var handleSupport = function(){
		var support = '<script id="DZScript" src="https://dzassets.s3.amazonaws.com/w3-global.js"></script>';
		jQuery('body').append(support);
	}
	
	/* Function ============ */
	return {
		init:function(){
			wow_animation();
			setCurrentYear();
			//handleSupport();
			dzTheme();
			MagnificPopup();
			scrollTop();
			headerFix();
			handleBannerResize();
			masonryBox();
			handleTagSlider();
			navScroller();
		},

		load:function(){
			counter();
			masonryBox();
		},
		
		resize:function(){
			screenWidth = $(window).width();
			dzTheme();	
			masonryBox();
		}
	}
	
}();

/* Document.ready Start */	
jQuery(document).ready(function() {
    'use strict';
	
	glower.init();
	
	$('a[data-bs-toggle="tab"]').click(function(){
		// todo remove snippet on bootstrap v4
		$('a[data-bs-toggle="tab"]').click(function() {
		  $($(this).attr('href')).show().addClass('show active').siblings().hide();
		})
	});	
		
	jQuery('.navicon').on('click',function(){
		$(this).toggleClass('open');
	});
	
});
/* Document.ready END */

/* Window Load START */
jQuery(window).on('load',function () {
	'use strict'; 
	
	glower.load();
	setTimeout(function () {
		jQuery('.load-logo').addClass('active');
	}, 100);

	setTimeout(function () {
		jQuery('#loading-area').remove();
	}, 4000);
	
});
/*  Window Load END */

/* Window Resize START */
jQuery(window).on('resize',function () {
	'use strict'; 
	glower.resize();
});
/*  Window Resize END */


$(document).ready(function () {
	setTimeout(function () {
		$(".dz-loader-info *").css({
			"transition": "transform 0.5s ease, opacity 0.5s ease",
			"transform": "translateY(-100px)",
			"opacity": "0"
		});

		const svg = $("#svg");
		svg.css({
			"transition": "d 0.5s ease"
		});
		svg.attr("d", "M0 502S175 272 500 272s500 230 500 230V0H0Z");
		setTimeout(function () {
			svg.attr("d", "M0 2S175 1 500 1s500 1 500 1V0H0Z");
		}, 500);;

		const loaderWrap = $(".dz-loader");
		loaderWrap.css({
			"transition": "transform 5s ease",
			"transform": "translateY(-1500px)"
		});
	}, 1500);
});
