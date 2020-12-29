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
	interval: 1,
	imgwidth: 120,
	intervalOptions : [5, 10, 30, 60, 120]
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
	buildthumbnailseek (player, controls, layers, media) {
		const
			t = this,
			thumbnailseekTitle = mejs.Utils.isString(t.options.thumbnailseekText) ? t.options.thumbnailseekText : mejs.i18n.t('mejs.thumbnailseek'),
			button = document.createElement('div')
		;
		let thumbnailseek = player.thumbnailseek = {};
		
		thumbnailseek.thumbs = [];
		let thumbnailBox = thumbnailseek.thumbnailBox = document.createElement('div');
		thumbnailBox.className = t.options.classPrefix + "thumbnails-box ";
		thumbnailBox.style.display = 'none';

		let thumbnailItems = thumbnailseek.thumbnailItems = document.createElement('div');
		thumbnailItems.className = t.options.classPrefix + "thumbnails-items";

		thumbnailBox.appendChild(thumbnailItems);

		let thumbnailOptions = thumbnailseek.thumbnailOptions = document.createElement('div');
		thumbnailOptions.className = t.options.classPrefix + "thumbnails-options";


		let intervalD = thumbnailseek.intervalD = document.createElement('button');
		intervalD.className = t.options.classPrefix + "button ";
		intervalD.innerHTML = '-';
		intervalD.addEventListener('click', () => {
			if (t.options.interval > 0) {
				t.options.interval--;
				intervalV.innerHTML = t.options.intervalOptions[t.options.interval];
				thumbnailseek.update(true);
			}
		});
		let intervalV = thumbnailseek.intervalV = document.createElement('div');
		intervalV.innerHTML = t.options.intervalOptions[t.options.interval];
		let intervalI = thumbnailseek.intervalI = document.createElement('button');
		intervalI.className = t.options.classPrefix + "button ";
		intervalI.innerHTML = '+';
		intervalI.addEventListener('click', () => {
			if (t.options.interval < t.options.intervalOptions.length - 1) {
				t.options.interval++;
				intervalV.innerHTML = t.options.intervalOptions[t.options.interval];
				thumbnailseek.update(true);
			}
		});

		thumbnailOptions.appendChild(intervalD);
		thumbnailOptions.appendChild(intervalV);
		thumbnailOptions.appendChild(intervalI);

		thumbnailBox.appendChild(thumbnailOptions);
		controls.insertBefore(thumbnailBox, controls.querySelector("." + t.options.classPrefix + "progress"));

		button.className = `${t.options.classPrefix}button ${t.options.classPrefix}thumbnailseek-button ${t.options.classPrefix}thumbnailseek`;
		button.innerHTML = `<button type="button" aria-controls="${t.id}" title="${thumbnailseekTitle}" aria-label="${thumbnailseekTitle}" tabindex="0"></button>`;
		t.addControlElement(button, 'thumbnailseek');

		if (player.container.offsetWidth < player.container.offsetHeight || player.container.offsetHeight < 240 * 3) {
			t.options.imgwidth = 120;
		} else {
			t.options.imgwidth = 240;
		}
		let hammer = thumbnailseek.hammer = new Hammer(thumbnailseek.thumbnailItems, { direction: Hammer.DIRECTION_HORIZONTAL });
		hammer.on('panstart panend pancancel panleft panright tap', function (ev) {
			switch (ev.type) {
				case "panstart":
					thumbnailseek.thumbnailX = thumbnailItems.offsetLeft;
					break;
				case "panleft":
				case "panright":
					if ((ev.center.x !== 0 || ev.center.y !== 0)) {
						let x = thumbnailseek.thumbnailX + ev.deltaX;
						thumbnailItems.style.left=x + "px";
						thumbnailseek.addjustOffset(null, function(offset){
							thumbnailseek.thumbnailX += offset;
						});
					}
					break;
				case 'tap':
					var index = parseInt((ev.center.x - thumbnailItems.offsetLeft) / t.options.imgwidth );
					if (index in thumbnailseek.thumbs) {
						thumbnailseek.thumbnailBox.style.display = 'none';
						player.setCurrentTime(thumbnailseek.thumbs[index].time);
						player.play();
						if(!player.options.alwaysShowControls) {
							if (player.controlsAreVisible) {
								player.startControlsTimer(t.options.controlsTimeoutMouseEnter);
							}
						}
					}
					break;
			}
		});
		
		thumbnailseek.addjustOffset = function(next, adjust) {
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
					thumbnailItems.style.left = ( parseInt(thumbnailItems.style.left) + t.options.imgwidth) + 'px';
					if (adjust) {
						adjust(t.options.imgwidth);
					}
				} else {
					thumbnailItems.removeChild(thumbs[thumbs.length - 1].item);
					thumbs.pop();
				}
				
			}

			if (thumbs.length * t.options.imgwidth + offset < width * 2) {
				thumbnailseek.addRight(time_end + t.options.intervalOptions[t.options.interval], function(){
					if (next) {
						next();
					}
				});
			} else if (offset + width * 2 > 0) {
				thumbnailseek.addLeft(time_begin - t.options.intervalOptions[t.options.interval], function() {
					thumbnailItems.style.left = ( parseInt(thumbnailItems.style.left) - t.options.imgwidth) + 'px';
					if (adjust) {
						adjust(-t.options.imgwidth);
					}
					if (next) {
						next();
					}
				});
			}
		}

		thumbnailseek.createItem = function(sec, cb) {
			var src = player.node.thumbnail(sec);
			if (src && sec >= 0 && sec <= player.getDuration()) {
				var item = document.createElement('span');
				var img = document.createElement('img');
				img.setAttribute('width', t.options.imgwidth + 'px');
				img.setAttribute('src', src);
				img.onload=function(){
					if (thumbnailBox.style.height == 0) {
						thumbnailItems.style.height = (img.height + 22) + 'px';
						thumbnailBox.style.height = (img.height + 102) + 'px';
					}
				}
				img.onmousedown=function(e){
					if (e.preventDefault) e.preventDefault();
				}
				item.appendChild(img);
				var timecode = document.createElement('div');
				timecode.innerHTML = mejs.Utils.secondsToTimeCode(sec, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond)
				item.appendChild(timecode);
				cb(item);
			}
		}

		thumbnailseek.addRight = function(sec, cb) {
			thumbnailseek.createItem(sec, function(item){
				thumbnailItems.appendChild(item);
				thumbnailseek.thumbs.push({time:sec, item:item});
				if (cb) {
					cb();
				}
			});
		}
		
		thumbnailseek.addLeft = function(sec, cb) {
			thumbnailseek.createItem(sec, function(item){
				thumbnailItems.insertBefore(item, thumbnailItems.firstChild);
				thumbnailseek.thumbs.unshift({time:sec, item:item});
				if (cb) {
					cb();
				}
			});
		}
		
		thumbnailseek.update = function(refresh) {
			var width = thumbnailItems.parentElement.offsetWidth;
			player.pause();
			player.showControls();
			var sec = parseInt(player.getCurrentTime());

			var addNext = function() {
				thumbnailseek.addjustOffset(addNext, null);
			}

			var reset = function() {
				thumbnailseek.thumbs = [];
				while (thumbnailItems.firstChild) {
					thumbnailItems.removeChild(thumbnailItems.firstChild);
				}
				thumbnailItems.style.left= (width - t.options.imgwidth) / 2 + "px";
				thumbnailseek.addRight(sec, addNext);
			}
			
			if (refresh) {
				var index = parseInt((0 - thumbnailItems.offsetLeft + width / 2) / t.options.imgwidth );
				var offset = index * t.options.imgwidth + thumbnailItems.offsetLeft - (width - t.options.imgwidth) / 2;
				sec = thumbnailseek.thumbs[index].time;
				reset();
				thumbnailItems.style.left = thumbnailItems.offsetLeft + offset + "px";
			} else if (thumbnailseek.thumbs.length && sec >= thumbnailseek.thumbs[0].time && sec <= thumbnailseek.thumbs[thumbnailseek.thumbs.length - 1].time) {
				var offsetSec = sec - thumbnailseek.thumbs[0].time;
				thumbnailItems.style.left= ((width - t.options.imgwidth) / 2 - parseInt(offsetSec / t.options.intervalOptions[t.options.interval]) * t.options.imgwidth) +"px";
				thumbnailseek.addjustOffset(addNext, null);
			} else {
				reset();
			}
		}
		
		button.addEventListener('click', () => {
			//var ele = player.container.querySelector(`.${t.options.classPrefix}mediaelement`);
			if (thumbnailseek.thumbnailBox.style.display == 'block') {
				thumbnailseek.thumbnailBox.style.display = 'none';
				player.play();
			} else {
				thumbnailseek.thumbnailBox.style.display = 'block';
				thumbnailseek.update();
			}
		});

		media.addEventListener('play', () => {
			if (thumbnailseek.thumbnailBox.style.display == 'block') {
				thumbnailseek.update();
			}
		});

		media.addEventListener('seeked', () => {
			if (thumbnailseek.thumbnailBox.style.display == 'block') {
				thumbnailseek.update();
			}
		});
	}
});
