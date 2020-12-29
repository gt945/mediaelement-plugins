(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Cutter
 *
 * This feature add cutter
 */

// Translations (English required)

mejs.i18n.en["mejs.cutter"] = "Cutter";

// Feature configuration
Object.assign(mejs.MepDefaults, {
	/**
  * @type {?String}
  */
	cutterText: null
});

Object.assign(MediaElementPlayer.prototype, {

	/**
  * Feature constructor.
  *
  * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  * @param {HTMLElement} controls
  * @param {HTMLElement} layers
  * @param {HTMLElement} media
  */

	buildcutter: function buildcutter(player, controls, layers, media) {
		var t = this,
		    cutterTitle = mejs.Utils.isString(t.options.cutterText) ? t.options.cutterText : mejs.i18n.t('mejs.cutter'),
		    button = document.createElement('div');

		var cutter = player.cutter = {
			start: 0,
			stop: 0
		};

		var cutterBox = cutter.cutterBox = document.createElement('div');
		cutterBox.className = t.options.classPrefix + "cutter-box ";
		cutterBox.style.display = 'none';

		var gotoStart = cutter.gotoStart = document.createElement('button');
		gotoStart.className = t.options.classPrefix + "button " + t.options.classPrefix + "cutter-time";
		gotoStart.style.width = "120px";
		gotoStart.addEventListener('click', function () {
			player.setCurrentTime(cutter.start);
		});

		var gotoStop = cutter.gotoStop = document.createElement('button');
		gotoStop.className = t.options.classPrefix + "button " + t.options.classPrefix + "cutter-time";
		gotoStop.style.width = "120px";
		gotoStop.addEventListener('click', function () {
			player.setCurrentTime(cutter.stop);
		});

		var buttonStart = cutter.buttonStart = document.createElement('button');
		buttonStart.className = t.options.classPrefix + "button ";
		buttonStart.innerHTML = '^';
		buttonStart.style.width = "40px";
		buttonStart.addEventListener('click', function () {
			cutter.start = player.getCurrentTime();
			gotoStart.innerHTML = mejs.Utils.secondsToTimeCode(cutter.start, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
		});

		var buttonStop = cutter.buttonStop = document.createElement('button');
		buttonStop.className = t.options.classPrefix + "button ";
		buttonStop.innerHTML = '^';
		buttonStop.style.width = "40px";
		buttonStop.addEventListener('click', function () {
			cutter.stop = player.getCurrentTime();
			gotoStop.innerHTML = mejs.Utils.secondsToTimeCode(cutter.stop, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
		});

		var buttonCut = cutter.buttonCut = document.createElement('button');
		buttonCut.className = t.options.classPrefix + "button ";
		buttonCut.innerHTML = '>';
		buttonCut.style.width = "120px";
		buttonCut.addEventListener('click', function () {
			if (cutter.start > 0 && cutter.stop > 0 && cutter.stop > cutter.start) {
				var start = mejs.Utils.secondsToTimeCode(cutter.start, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
				var stop = mejs.Utils.secondsToTimeCode(cutter.stop - cutter.start, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
				mejs.Utils.ajax(t.options.cutterCmd(start, stop), 'get', function () {}, function () {});
			}
		});

		var line1 = document.createElement('div');
		var line2 = document.createElement('div');
		var line3 = document.createElement('div');
		line1.style.width = "50%";
		line1.style.float = "left";
		line2.style.width = "50%";
		line2.style.float = "left";

		line1.appendChild(gotoStart);
		line1.appendChild(buttonStart);
		line2.appendChild(gotoStop);
		line2.appendChild(buttonStop);
		line3.appendChild(buttonCut);
		cutterBox.appendChild(line1);
		cutterBox.appendChild(line2);
		cutterBox.appendChild(line3);

		controls.insertBefore(cutterBox, controls.querySelector("." + t.options.classPrefix + "progress"));

		button.className = t.options.classPrefix + "button " + t.options.classPrefix + "cutter-button " + t.options.classPrefix + "cutter";
		button.innerHTML = "<button type=\"button\" aria-controls=\"" + t.id + "\" title=\"" + cutterTitle + "\" aria-label=\"" + cutterTitle + "\" tabindex=\"0\"></button>";
		t.addControlElement(button, 'cutter');

		button.addEventListener('click', function () {
			if (cutter.cutterBox.style.display == 'block') {
				cutter.cutterBox.style.display = 'none';
				player.play();
			} else {
				cutter.cutterBox.style.display = 'block';
				player.pause();
				player.showControls();
			}
		});

		media.addEventListener('play', function () {
			if (cutter.cutterBox.style.display == 'block') {
				player.pause();
				player.showControls();
			}
		});

		media.addEventListener('seeked', function () {
			if (cutter.cutterBox.style.display == 'block') {
				player.pause();
				player.showControls();
			}
		});
	}
});

},{}]},{},[1]);
