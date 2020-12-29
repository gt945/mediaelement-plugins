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

	buildcutter(player, controls, layers, media) {
		const
			t = this,
			cutterTitle = mejs.Utils.isString(t.options.cutterText) ? t.options.cutterText : mejs.i18n.t('mejs.cutter'),
			button = document.createElement('div')
		;

		let cutter = player.cutter = {
			start : 0,
			stop : 0
		};

		let cutterBox = cutter.cutterBox = document.createElement('div');
		cutterBox.className = t.options.classPrefix + "cutter-box ";
		cutterBox.style.display = 'none';

		let gotoStart = cutter.gotoStart = document.createElement('button');
		gotoStart.className = t.options.classPrefix + "button " + t.options.classPrefix + "cutter-time";
		gotoStart.style.width = "120px";
		gotoStart.addEventListener('click', () => {
			player.setCurrentTime(cutter.start);
		});

		let gotoStop = cutter.gotoStop = document.createElement('button');
		gotoStop.className = t.options.classPrefix + "button " + t.options.classPrefix + "cutter-time";
		gotoStop.style.width = "120px";
		gotoStop.addEventListener('click', () => {
			player.setCurrentTime(cutter.stop);
		});

		let buttonStart = cutter.buttonStart = document.createElement('button');
		buttonStart.className = t.options.classPrefix + "button ";
		buttonStart.innerHTML = '^';
		buttonStart.style.width = "40px";
		buttonStart.addEventListener('click', () => {
			cutter.start = player.getCurrentTime();
			gotoStart.innerHTML = mejs.Utils.secondsToTimeCode(cutter.start, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond)
		});

		let buttonStop = cutter.buttonStop = document.createElement('button');
		buttonStop.className = t.options.classPrefix + "button ";
		buttonStop.innerHTML = '^';
		buttonStop.style.width = "40px";
		buttonStop.addEventListener('click', () => {
			cutter.stop = player.getCurrentTime();
			gotoStop.innerHTML = mejs.Utils.secondsToTimeCode(cutter.stop, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
		});

		let buttonCut = cutter.buttonCut = document.createElement('button');
		buttonCut.className = t.options.classPrefix + "button ";
		buttonCut.innerHTML = '>';
		buttonCut.style.width = "120px";
		buttonCut.addEventListener('click', () => {
			if (cutter.start > 0 && cutter.stop > 0 && cutter.stop > cutter.start) {
				let start = mejs.Utils.secondsToTimeCode(cutter.start, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
				let stop = mejs.Utils.secondsToTimeCode(cutter.stop - cutter.start, true, player.options.showTimecodeFrameCount, player.options.framesPerSecond);
				mejs.Utils.ajax(t.options.cutterCmd(start, stop), 'get',
				function(){

				},
				function(){

				});
			}
		});


		let line1 = document.createElement('div');
		let line2 = document.createElement('div');
		let line3 = document.createElement('div');
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

		button.className = `${t.options.classPrefix}button ${t.options.classPrefix}cutter-button ${t.options.classPrefix}cutter`;
		button.innerHTML = `<button type="button" aria-controls="${t.id}" title="${cutterTitle}" aria-label="${cutterTitle}" tabindex="0"></button>`;
		t.addControlElement(button, 'cutter');

		button.addEventListener('click', () => {
			if (cutter.cutterBox.style.display == 'block') {
				cutter.cutterBox.style.display = 'none';
				player.play();
			} else {
				cutter.cutterBox.style.display = 'block';
				player.pause();
				player.showControls();
			}
		});

		media.addEventListener('play', () => {
			if (cutter.cutterBox.style.display == 'block') {
				player.pause();
				player.showControls();
			}
		});

		media.addEventListener('seeked', () => {
			if (cutter.cutterBox.style.display == 'block') {
				player.pause();
				player.showControls();
			}
		});
	}
});