/**
	Template Name 	 : Glower
	Author			 : IndianCoder
	Version			 : 1.0
	File Name	     : custom.js
	Author Portfolio : https://themeforest.net/user/indiancoder/portfolio
	
	Core script to handle the entire theme and core functions
**/
var GlowerCarousel = function(){
	
	// Swiper One ==
	var handleSwiperOne = function() {	
		if(jQuery('.swiper-one').length > 0){
			var swiper = new Swiper( '.swiper-one', {
				slidesPerView: 1,
				spaceBetween: 0,
				loop: true,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
				},
				autoplay: {
					delay: 3000,
				},
			});
		}
	}
	
	// Swiper Two ==
	var handleSwiperTwo = function() {	
		if(jQuery('.swiper-two').length > 0){
			var swiper = new Swiper( '.swiper-two', {
				slidesPerView: 6,
				spaceBetween: 30,
				loop: true,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				autoplay: {
					delay: 3000,
				},
				breakpoints: {
					1200: {
						slidesPerView: 5,
					},
					768: {
						slidesPerView: 4,
					},
					600: {
						slidesPerView: 3,
						spaceBetween: 15,
					},
					300: {
						slidesPerView: 2,
						spaceBetween: 15,
					},
				}
			});
		}
	}
	
	// Swiper Three ==
	var handleSwiperThree = function() {	
		if(jQuery('.swiper-three').length > 0){
			var swiper = new Swiper( '.swiper-three', {
				slidesPerView: 1,
				spaceBetween: 0,
				loop: true,
				pagination: {
					el: ".swiper-pagination-two",
					clickable: true,
				},
				autoplay: {
					delay: 3000,
				},
			});
		}
	}
	
	// Swiper Four ==
	var handleSwiperFour = function() {	
		if(jQuery('.swiper-four').length > 0){
			var swiper = new Swiper( '.swiper-four', {
				slidesPerView: 1,
				spaceBetween: 0,
				loop: true,
				pagination: {
					el: ".swiper-pagination-three",
					clickable: true,
				},
				autoplay: {
					delay: 3000,
				},
			});
		}
	}
	
	/* Function ============ */
	return {
	
		init:function(){
			handleSwiperOne();	
			handleSwiperTwo();	
			handleSwiperThree();	
			handleSwiperFour();	
		},

		load:function(){
		},
		
		resize:function(){
			
		}
	}
	
}();


/* Document.ready Start */	
jQuery(document).ready(function() {
    'use strict';
	
	GlowerCarousel.init();
	
	
});
/* Document.ready END */

/* Window Load START */
jQuery(window).on('load',function () {
	'use strict'; 
	GlowerCarousel.load();

	
});
/*  Window Load END */

/* Window Resize START */
jQuery(window).on('resize',function () {
	'use strict'; 
	GlowerCarousel.resize();
});
/*  Window Resize END */