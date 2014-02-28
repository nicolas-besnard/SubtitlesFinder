// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.effect
//= require opensubtitles-hash
//= require utils
//= require bootstrap.min
//= require underscore
//= require_tree .



$(window).ready(function()
{
	// set header height!
	window.navHeight 		= $("#header").height();

	/** Full screen
	*************************************************** **/

	if ($(".full-screen").length > 0)
	{
		_fullscreen();

		$(window).resize(function() {
			_fullscreen();
		});
	}

	function _fullscreen()
	{

		var _screenHeight = $(window).height();
		$('#wow').css('top', $(window).height() + 'px');
		$('.full-screen, .full-screen ul, .full-screen li').height(_screenHeight);

	}


	/** SCROLL TO
	*************************************************** **/
	$("a.scrollTo").bind("click", function(e) {
		e.preventDefault();

		var href = $(this).attr('href');
		if(href != '#') {
			$('html,body').animate({scrollTop: $(href).offset().top - window.navHeight}, 1000, 'easeInOutExpo');
		}
	});

	$("a.toTop").bind("click", function(e) {
		e.preventDefault();
		$('html,body').animate({scrollTop: 0}, 1000, 'easeInOutExpo');
	});


/* STICKY */

if ($("#home").length > 0) {

	window.isOnTop 		= true;
	window.homeHeight 	= $("#home").height() - window.navHeight;
	 /*
		window.isOnTop = avoid bad actions on each scroll
		Benefits: no unseen $ actions, faster rendering
		*/
		$(window).scroll(function() {
			if($(document).scrollTop() > window.homeHeight) {
				if(window.isOnTop === true) {
					$('#header').addClass('fixed');
					window.isOnTop = false;
				}
			} else {
				if(window.isOnTop === false) {
					$('#header').removeClass('fixed');
					window.isOnTop = true;
				}
			}
		});

		$(window).resize(function() {
			window.homeHeight = $("#home").height() - window.navHeight;
		});

	}

});
