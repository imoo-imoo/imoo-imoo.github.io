document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    //Global Variables
    var pwaName = "Metatech"; //Local Storage Names for PWA
    
    function metatech_inti(){
        //SETTINGS COLOR THEME
        var colorTheme = document.querySelectorAll('[data-theme-color]');
        colorTheme.forEach(el => el.addEventListener('click',e =>{
            var themecolor = el.getAttribute('data-theme-color');
            document.body.setAttribute('data-color', 'color-theme-'+themecolor+'');
            localStorage.setItem(pwaName+'-Themecolor', themecolor)

            // Remove Active Class From all
            colorTheme.forEach((el) => {
              el.classList.remove("active");
            });
            // Add Active Class To Current Element
            e.currentTarget.classList.add("active");
        }));

        
        var bodythemecolor = localStorage.getItem(pwaName+'-Themecolor');
        if(bodythemecolor){
            document.body.setAttribute('data-color', 'color-theme-'+bodythemecolor+'');
            if(colorTheme.length){
                document.querySelector(`[data-theme-color="${localStorage.getItem(pwaName+'-Themecolor')}"]`).classList.add("active");
            }
        }


        //DARK MODE
        const toggleDark = document.querySelectorAll('[data-switch-theme]');
        function activateDarkMode(){
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            for(let i = 0; i < toggleDark.length; i++){
                toggleDark[i].checked="checked"
            };
            localStorage.setItem(pwaName+'-Theme', 'dark-mode');
        }
        function activateLightMode(){
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            for(let i = 0; i < toggleDark.length; i++){
                toggleDark[i].checked=false
            };
            localStorage.setItem(pwaName+'-Theme', 'light-mode');
        }
        
        //GET DATA
        if(localStorage.getItem(pwaName+'-Theme') == "dark-mode"){
            for(let i = 0; i < toggleDark.length; i++){
                toggleDark[i].checked="checked"
            };
            document.body.className = 'dark-mode';
        }

        if(localStorage.getItem(pwaName+'-Theme') == "light-mode"){
            document.body.className = 'light-mode';
        }
        // ONCLICK CHECKBOX
        const darkModeSwitch = document.querySelectorAll('[data-switch-theme]')
        darkModeSwitch.forEach(el => el.addEventListener('click',e =>{
            if(document.body.className === "light-mode"){ 

                activateDarkMode();
             }
            else if(document.body.className === "dark-mode"){
                activateLightMode();
            }
        }));
    }

    metatech_inti();

});