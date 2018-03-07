'use strict';

/**
 * Toggle button
 *
 * This feature enables the displaying of a Toggle button in the control bar, which basically pauses the media and rewinds
 * it to the initial position.
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
	buildtoggle (player)  {
		const
			t = this,
			toggleTitle = mejs.Utils.isString(t.options.toggleText) ? t.options.toggleText : mejs.i18n.t('mejs.toggle'),
			button = document.createElement('div')
		;
		button.className = `${t.options.classPrefix}button ${t.options.classPrefix}toggle-button ${t.options.classPrefix}toggle`;
		button.innerHTML = `<button type="button" aria-controls="${t.id}" title="${toggleTitle}" aria-label="${toggleTitle}" tabindex="0"></button>`;

		t.addControlElement(button, 'toggle');

		button.addEventListener('click', () => {
			var ele = player.container.querySelector(`.${t.options.classPrefix}mediaelement`);
			if (ele.style.display == 'none') {
				ele.style.display = '';
				mejs.Utils.removeClass(button, `${t.options.classPrefix}toggle_invisible`);
			} else {
				ele.style.display = 'none';
				mejs.Utils.addClass(button, `${t.options.classPrefix}toggle_invisible`);
			}
		});
	}
});
