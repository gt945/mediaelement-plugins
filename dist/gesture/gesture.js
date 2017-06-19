(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Gesture seek
 *
 * This feature add swipe seek support
 */

// Feature configuration

Object.assign(mejs.MepDefaults, {
	pancount: 10
});

Object.assign(MediaElementPlayer.prototype, {

	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {HTMLElement} controls
  * @param {HTMLElement} layers
  */
	buildgesture: function buildgesture(player, controls, layers) {
		var t = this;

		var gesture = player.gesture = {};

		gesture.seekTimeStart = -1;
		gesture.seekTimeLayer = document.createElement('div');
		gesture.seekTimeLayer.className = t.options.classPrefix + "layer " + t.options.classPrefix + "overlay";
		gesture.seekTimeLayer.innerHTML = "<div class=\"" + t.options.classPrefix + "seek-time-layer\"></div>";

		gesture.seekTimeLayer.style.display = 'none';

		layers.insertBefore(gesture.seekTimeLayer, layers.querySelector("." + t.options.classPrefix + "overlay-play"));

		player.hammer = new Hammer(player.container, { threshold: 50, direction: Hammer.DIRECTION_VERTICAL });
		player.hammer.on('panstart panend panleft panright', function (ev) {
			switch (ev.type) {
				case "panstart":
					gesture.seekTimeStart = player.getCurrentTime();
					break;
				case "panleft":
				case "panright":
					if (Math.abs(ev.deltaX) > 40 && Math.abs(ev.deltaY) < Math.abs(ev.deltaX)) {
						player.pause();
						player.showControls();
						gesture.seekTimeLayer.style.display = 'block';
						var date = new Date(null);
						var seekTime = gesture.seekTimeStart + ev.deltaX / 10;
						if (seekTime < 0) {
							seekTime = 0;
						}
						date.setSeconds(seekTime); // specify value for SECONDS here
						gesture.seekTimeLayer.children[0].innerHTML = date.toISOString().substr(11, 8) + '<br>' + (ev.deltaX >= 0 ? '+' : '') + parseInt(ev.deltaX / 10);
					}
					break;
				case "panend":
					{
						var seekTo = gesture.seekTimeStart + ev.deltaX / 10;
						gesture.seekTimeLayer.style.display = 'none';
						gesture.seekTimeStart = -1;
						if (Math.abs(player.getCurrentTime() - seekTo) > 1) {
							player.setCurrentTime(seekTo);
						}
						player.play();
						break;
					}
			}
		});
	},

	/**
  * Feature destructor.
  *
  * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  */
	clearspeed: function clearspeed(player) {
		if (player) {
			if (player.seekTimeLayer) {
				player.seekTimeLayer.parentNode.removeChild(player.seekTimeLayer);
			}
		}
	}
});

},{}]},{},[1]);
