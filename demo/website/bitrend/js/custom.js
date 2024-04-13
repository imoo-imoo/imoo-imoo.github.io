/**
  * preloader
  * megamenu
  * header menu
  * close nav menu
  * menu search box
  * sidebar box dashboard
  * dark button
  * Save button
  * owlcarousel
  * mixitup filter
*/

; (function ($) {
    //"use strict";

    // preloader
    function handlePreloader() {
        if ($('#preloader').length > 0) {
          $('#preloader').delay(200).fadeOut(200);
          // $("body").delay(600).addClass('loaded');
        }
    }

    

    //megamenu
    var megamenu = function() {
      $(document).on("click", ".mega-menu", function () {
        $(this).toggleClass("active").next().slideToggle(400);
      });
    };

    //header menu
    var headermenu = function() {
      $('.header-menu').on('click', function () {
          $('.navigation').addClass('nav-active');
      });
    };

    //close nav menu
    var closenav = function() {
      $('.close-nav').on('click', function () {
          $('.navigation').removeClass('nav-active');
          return false;
      });
    };

    //menu search box
    var menusearch = function() {
      $('.menu-search-icon').on('click', function() {
          $('.app-header-search').addClass('show');
      });
      $('.searchbox-close').on('click', function() {
          $('.app-header-search').removeClass('show');
      });
    };

    //sidebar box dashboard
    var sidebarbox = function() {
      $('.sidebar-right,.sidebar-layer').on('click', function() {
          $('.middle-sidebar-right').toggleClass('active-sidebar');
          $(this).find('i').toggleClass('bi-chevron-compact-left bi-chevron-compact-right');
          return false;
      });
    };

    //dark button
    var darkbutton = function() {
      $('.btn-toggle-dark').on('click', function() {
          $(this).find('i').toggleClass('bi-brightness-low bi-brightness-low-fill');
          return false;
      });
    };

    //Save button
    var addtosave = function() {
      $('.add-to-save').on('click', function() {
          $(this).find('i').toggleClass('bi-heart bi-heart-fill ');
          return false;
      });
    };

    //owlcarousel
    var owlcarousel = function() {
        $('.text-scroll').owlCarousel({
          margin:10,
          loop:true,
          autoWidth:true,
          items:4,
          autoplay: true,
          slideTransition: 'linear',
          autoplayTimeout: 1500,
          autoplaySpeed: 1500,
          autoplayHoverPause: false,
          dots:false,
      })

      $('.nft-bg-fade').owlCarousel({
          margin:10,
          loop:true,
          items:1,
          autoplay: true,     
          dots:false,
          autoplaySpeed: 1000,
          animateOut: 'fadeOut',
      })
      $('.nft-flip').owlCarousel({
          margin:10,
          loop:true,
          items:1,
          autoplay: true,     
          dots:false,
          autoplaySpeed: 1000,
          animateOut: 'fadeOut',
          animateIn: 'flipInX',

      })

      $('.two-nft').owlCarousel({
          margin:15,
          loop:true,
          items:1,
          // autoplay: true,   
          nav:true,
          navText: ['<i class="bi-arrow-left-circle"></i>','<i class="bi-arrow-right-circle"></i>'],
          dots:false,
      })
      
      $('.three-nft').owlCarousel({
          margin:30,
          loop:true,
          items:3,
          autoplay: true,   
          nav:false,
          navText: ['<i class="bi-arrow-left-circle"></i>','<i class="bi-arrow-right-circle"></i>'],
          dots:true,

          responsive:{
              0:{
                  items:1,
              },
              600:{
                  items:2,
              },
              1000:{
                  items:3,
              }
          }
      })
      $('.side-nft').owlCarousel({
          margin:30,
          loop:true,
          items:3,
          autoplay: true,   
          nav:false,
          navText: ['<i class="bi-arrow-left-circle"></i>','<i class="bi-arrow-right-circle"></i>'],
          dots:true,

          responsive:{
              0:{
                  items:2,
              },
              600:{
                  items:2,
              },
              1000:{
                  items:3,
              }
          }
      })

      var owlthree = $('.three-nft');
      owlthree.owlCarousel();
      $('.three-nft-next-btn').click(function() {
          owlthree.trigger('next.owl.carousel');
      })
      $('.three-nft-prev-btn').click(function() {
          owlthree.trigger('prev.owl.carousel');
      })

      var owlside = $('.side-nft');
      owlside.owlCarousel();
      $('.side-nft-next-btn').click(function() {
          owlside.trigger('next.owl.carousel');
      })
      $('.side-nft-prev-btn').click(function() {
          owlside.trigger('prev.owl.carousel');
      })


      $('.four-nft').owlCarousel({
          margin:30,
          loop:true,
          items:4,
          autoplay: true,   
          dots:false,
          responsive:{
              0:{
                  items:1,
              },
              600:{
                  items:2,
              },
              1000:{
                  items:4,
                  nav:false,
              }
          }
      })

      $('.category-nft').owlCarousel({
          margin:15,
          loop:true,
          items:5,
          autoplay: false,  
          nav:false, 
          dots:false,
          responsive:{
              0:{
                  items:2,
              },
              600:{
                  items:3,
              },
              1000:{
                  items:5,
              }
          }
      })

      var owlcategory = $('.category-nft');
      owlcategory.owlCarousel();
      $('.category-nft-next-btn').click(function() {
          owlcategory.trigger('next.owl.carousel');
      })
      $('.category-nft-prev-btn').click(function() {
          owlcategory.trigger('prev.owl.carousel');
      })


      $('.five-nft').owlCarousel({
          margin:15,
          loop:true,
          items:5,
          // autoplay: true,  
          autoplayTimeout:4000,
          nav:false, 
          dots:false,
          responsive:{
              0:{
                  items:1,
              },
              600: {
                items:2,
              },
              1024:{
                items:3,
              },
              1200:{
                  items:4,
              },
              1600:{
                  items:5,
              }
          }
      })
      $('.five-nfts').owlCarousel({
          margin:15,
          loop:true,
          items:5,
          // autoplay: true,  
          autoplayTimeout:6000,
          nav:false, 
          dots:false,
           responsive:{
              0:{
                  items:1,
              },
              600: {
                items:2,
              },
              1024:{
                items:3,
              },
              1200:{
                  items:4,
              },
              1600:{
                  items:5,
              }
          }
      })

      


      $('.roadmap-carousel').owlCarousel({
          margin:30,
          loop:false,
          items:5,
          autoplay: true,   
          dots:false,
          nav:true,
          navText: ['<i class="bi-arrow-left-circle-fill text-gray-900"></i>','<i class="bi-arrow-right-circle-fill text-gray-900"></i>'],
          responsive:{
              0:{
                  items:1,
              },
              600:{
                  items:2,
              },
              1000:{
                  items:5,
               
              }
          }
      })
      
      $('.auto-width').owlCarousel({
          margin:20,
          loop:true,
          autoplay: true,   
          dots:false,
          autoWidth:true,
          slideTransition: 'linear',
          autoplayTimeout: 1500,
          autoplaySpeed: 1500,
      })
      $('.auto-width-2').owlCarousel({
          margin:20,
          loop:true,
          autoplay: true,   
          dots:false,
          autoWidth:true,
          slideTransition: 'linear',
          autoplayTimeout: 2500,
          autoplaySpeed: 2500,
      })
    };



    //countdown js active
    var countdown = function() {
      $('.countdown1').simplyCountdown({
          year: 2025, // required
          month: 6, // required
          day: 28, // required
          words: { //words displayed into the countdown
              days: { singular: 'D', plural: 'D : ' },hours: { singular: 'H', plural: 'H : ' },minutes: { singular: 'M', plural: 'M : ' },seconds: { singular: 'S', plural: 'S' }
          },
      });
      $('.countdown2').simplyCountdown({
          year: 2024, // required
          month: 6, // required
          day: 28, // required
          words: { //words displayed into the countdown
              days: { singular: 'D', plural: 'D : ' },hours: { singular: 'H', plural: 'H : ' },minutes: { singular: 'M', plural: 'M : ' },seconds: { singular: 'S', plural: 'S' }
          },
      });
      $('.countdown3').simplyCountdown({
          year: 2025, // required
          month: 9, // required
          day: 28, // required
          words: { //words displayed into the countdown
              days: { singular: 'D', plural: 'D : ' },hours: { singular: 'H', plural: 'H : ' },minutes: { singular: 'M', plural: 'M : ' },seconds: { singular: 'S', plural: 'S' }
          },
      });
      $('.countdown4').simplyCountdown({
          year: 2025, // required
          month: 10, // required
          day: 28, // required
          words: { //words displayed into the countdown
              days: { singular: 'D', plural: 'D : ' },hours: { singular: 'H', plural: 'H : ' },minutes: { singular: 'M', plural: 'M : ' },seconds: { singular: 'S', plural: 'S' }
          },
      });
      $('.countdown5').simplyCountdown({
          year: 2023, // required
          month: 10, // required
          day: 28, // required
          words: { //words displayed into the countdown
              days: { singular: 'Day', plural: 'Days ' },hours: { singular: 'Hour', plural: 'Hours ' },minutes: { singular: 'Min', plural: 'Min ' },seconds: { singular: 'Sec', plural: 'Sec' }
          },
      });
    };

    //niceselect js active
    var niceselect = function() {
        $('.nice-select').niceSelect();
    };

    


    var filterList = {
        init: function () {
            // MixItUp plugin
            // http://mixitup.io
            $('.portfolio-grid').mixItUp({
                selectors: {
              target: '.portfolio',
              filter: '.filter' 
          },
          load: {
              filter: 'all' // show app tab on first load
            }     
            });                             
        }
    };



   


    // Dom Ready
    $(function () {
        handlePreloader();
        megamenu();
        headermenu();
        closenav();
        menusearch();
        sidebarbox();
        darkbutton();
        addtosave();
        owlcarousel();
        countdown();
        niceselect();
        filterList.init();
        
        
    });


})(jQuery);