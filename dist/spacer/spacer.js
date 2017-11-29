(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Spacer Div
 *
 * This feature creates a button to spacer media in different levels.
 */

// Feature configuration

Object.assign(mejs.MepDefaults, {});

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
	buildspacer: function buildspacer(player) {
		var t = this,
		    isNative = t.media.rendererName !== null && /(native|html5|vod)/i.test(t.media.rendererName);

		if (!isNative) {
			return;
		}

		t.clearspacer(player);

		player.spacerDiv = document.createElement('div');
		player.spacerDiv.className = t.options.classPrefix + 'spacer';
		player.spacerDiv.innerHTML = '';

		t.addControlElement(player.spacerDiv, 'spacer');
	},

	/**
  * Feature destructor.
  *
  * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
  * @param {MediaElementPlayer} player
  */
	clearspacer: function clearspacer(player) {
		if (player) {
			if (player.spacerDiv) {
				player.spacerDiv.parentNode.removeChild(player.spacerDiv);
			}
		}
	}
});

},{}]},{},[1]);
