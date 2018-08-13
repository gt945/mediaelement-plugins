(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Toggle button
 *
 * This feature enables the displaying of a Toggle button in the control bar, which basically hide or show video.
 */

// Translations (English required)

mejs.i18n.en["mejs.toggle"] = "Toggle";

// Feature configuration
Object.assign(mejs.MepDefaults, {
	/**
  * @type {?String}
  */
	toggleText: null
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
	buildtoggle: function buildtoggle(player) {
		var t = this,
		    toggleTitle = mejs.Utils.isString(t.options.toggleText) ? t.options.toggleText : mejs.i18n.t('mejs.toggle'),
		    button = document.createElement('div');
		button.className = t.options.classPrefix + "button " + t.options.classPrefix + "toggle-button " + t.options.classPrefix + "toggle";
		button.innerHTML = "<button type=\"button\" aria-controls=\"" + t.id + "\" title=\"" + toggleTitle + "\" aria-label=\"" + toggleTitle + "\" tabindex=\"0\"></button>";

		t.addControlElement(button, 'toggle');

		button.addEventListener('click', function () {
			if (mejs.Utils.hasClass(button, t.options.classPrefix + "toggle_invisible")) {
				player.node.show();
				mejs.Utils.removeClass(button, t.options.classPrefix + "toggle_invisible");
			} else {
				player.node.hide();
				mejs.Utils.addClass(button, t.options.classPrefix + "toggle_invisible");
			}
		});
	}
});

},{}]},{},[1]);
