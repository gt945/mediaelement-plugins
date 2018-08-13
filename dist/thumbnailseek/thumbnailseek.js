(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * ThumbnailSeek button
 *
 * This feature enables the seeking by thumbnail feature 
 */

// Translations (English required)

mejs.i18n.en["mejs.thumbnailseek"] = "ThumbnailSeek";

// Feature configuration
Object.assign(mejs.MepDefaults, {
	/**
  * @type {?String}
  */
	thumbnailseekText: null,
	interval: 10,
	imgwidth: 120
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
	buildthumbnailseek: function buildthumbnailseek(player, controls) {
		var t = this,
		    thumbnailseekTitle = mejs.Utils.isString(t.options.thumbnailseekText) ? t.options.thumbnailseekText : mejs.i18n.t('mejs.thumbnailseek'),
		    button = document.createElement('div');
		var thumbnailseek = player.thumbnailseek = {};

		var thumbnailBox = thumbnailseek.thumbnailBox = document.createElement('div');
		thumbnailBox.className = t.options.classPrefix + "thumbnails-box ";
		thumbnailBox.style.display = 'none';

		var thumbnailItems = thumbnailseek.thumbnailItems = document.createElement('div');
		thumbnailItems.className = t.options.classPrefix + "thumbnails-items";

		thumbnailBox.append(thumbnailseek.thumbnailItems);
		controls.insertBefore(thumbnailBox, controls.querySelector("." + t.options.classPrefix + "progress"));

		button.className = t.options.classPrefix + "button " + t.options.classPrefix + "thumbnailseek-button " + t.options.classPrefix + "thumbnailseek";
		button.innerHTML = "<button type=\"button\" aria-controls=\"" + t.id + "\" title=\"" + thumbnailseekTitle + "\" aria-label=\"" + thumbnailseekTitle + "\" tabindex=\"0\"></button>";
		t.addControlElement(button, 'thumbnailseek');

		var hammer = thumbnailseek.hammer = new Hammer(thumbnailseek.thumbnailBox, { direction: Hammer.DIRECTION_HORIZONTAL });
		hammer.on('panstart panend pancancel panleft panright tap', function (ev) {
			switch (ev.type) {
				case "panstart":
					thumbnailseek.thumbnailX = thumbnailItems.offsetLeft;
					break;
				case "panleft":
				case "panright":
					if (ev.center.x !== 0 || ev.center.y !== 0) {
						var x = thumbnailseek.thumbnailX + ev.deltaX;
						thumbnailItems.style.left = x + "px";
						thumbnailseek.addjustOffset(null, function (offset) {
							thumbnailseek.thumbnailX += offset;
						});
					}
					break;
				case 'tap':
					var index = parseInt((ev.center.x - thumbnailItems.offsetLeft) / t.options.imgwidth);
					if (index in thumbnailseek.thumbs) {
						thumbnailseek.thumbnailBox.style.display = 'none';
						player.setCurrentTime(thumbnailseek.thumbs[index].time);
						player.play();
					}
					break;
			}
		});

		thumbnailseek.addjustOffset = function (done, cb2) {
			var offset = parseInt(thumbnailItems.style.left);
			var width = thumbnailItems.parentElement.offsetWidth;
			var limit = thumbnailItems.offsetWidth;
			var thumbs = thumbnailseek.thumbs;
			var time_begin = thumbs[0].time;
			var time_end = thumbs[thumbs.length - 1].time;

			if ((thumbs.length + 1) * t.options.imgwidth > limit) {
				if (offset + limit < limit / 2) {
					thumbnailItems.removeChild(thumbs[0].item);
					thumbs.shift();
					thumbnailItems.style.left = parseInt(thumbnailItems.style.left) + t.options.imgwidth + 'px';
					if (cb2) {
						cb2(t.options.imgwidth);
					}
				} else {
					thumbnailItems.removeChild(thumbs[thumbs.length - 1].item);
					thumbs.pop();
				}
			}

			if (thumbs.length * t.options.imgwidth + offset < width * 2) {
				thumbnailseek.addRight(time_end + t.options.interval, function () {
					if (done) {
						done();
					}
				});
			} else if (offset + width * 2 > 0) {
				thumbnailseek.addLeft(time_begin - t.options.interval, function () {
					thumbnailItems.style.left = parseInt(thumbnailItems.style.left) - t.options.imgwidth + 'px';
					if (cb2) {
						cb2(-t.options.imgwidth);
					}
					if (done) {
						done();
					}
				});
			}
		};

		thumbnailseek.createItem = function (sec, cb) {
			var src = player.node.thumbnail(sec);
			if (src && sec > 0 && sec < player.getDuration()) {
				var item = document.createElement('span');
				var img = document.createElement('img');
				img.setAttribute('width', t.options.imgwidth + 'px');
				img.setAttribute('src', src);
				item.append(img);
				cb(item);
			}
		};

		thumbnailseek.addRight = function (sec, cb) {
			thumbnailseek.createItem(sec, function (item) {
				thumbnailItems.append(item);
				thumbnailseek.thumbs.push({ time: sec, item: item });
				if (cb) {
					cb();
				}
			});
		};

		thumbnailseek.addLeft = function (sec, cb) {
			thumbnailseek.createItem(sec, function (item) {
				thumbnailItems.insertBefore(item, thumbnailItems.firstChild);
				thumbnailseek.thumbs.unshift({ time: sec, item: item });
				if (cb) {
					cb();
				}
			});
		};

		thumbnailseek.show = function (sec) {
			thumbnailseek.thumbs = [];
			thumbnailItems.style.left = "0px";
			while (thumbnailItems.firstChild) {
				thumbnailItems.removeChild(thumbnailItems.firstChild);
			}

			var addNext = function addNext() {
				thumbnailseek.addjustOffset(addNext);
			};
			thumbnailseek.addRight(sec, addNext);
		};

		button.addEventListener('click', function () {
			//var ele = player.container.querySelector(`.${t.options.classPrefix}mediaelement`);
			if (thumbnailseek.thumbnailBox.style.display == 'block') {
				thumbnailseek.thumbnailBox.style.display = 'none';
				player.play();
			} else {
				player.pause();
				player.showControls();
				thumbnailseek.thumbnailBox.style.display = 'block';
				thumbnailseek.show(parseInt(player.getCurrentTime()));
			}
		});
	}
});

},{}]},{},[1]);
