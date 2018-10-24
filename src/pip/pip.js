'use strict';

/**
 * PIP button
 *
 * This feature enables the displaying of a PIP button in the control bar, which basically enable or disable PIP.
 */

// Translations (English required)
mejs.i18n.en["mejs.pip"] = "PIP";

// Feature configuration
Object.assign(mejs.MepDefaults, {
	/**
	 * @type {?String}
	 */
	pipText: null
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
	buildpip (player) {
		const
			t = this,
			pipTitle = mejs.Utils.isString(t.options.pipText) ? t.options.pipText : mejs.i18n.t('mejs.pip'),
			button = document.createElement('div')
		;
		button.className = `${t.options.classPrefix}button ${t.options.classPrefix}pip-button ${t.options.classPrefix}pip`;
		button.innerHTML = `<button type="button" aria-controls="${t.id}" title="${pipTitle}" aria-label="${pipTitle}" tabindex="0"></button>`;

		t.addControlElement(button, 'pip');

		button.addEventListener('click', () => {
			if (document.pictureInPictureElement) {
				document.exitPictureInPicture();
			} else {
				player.node.requestPictureInPicture();
			}
		});
	}
});
