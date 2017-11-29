'use strict';

/**
 * Spacer Div
 *
 * This feature creates a button to spacer media in different levels.
 */


// Feature configuration
Object.assign(mejs.MepDefaults, {
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
	buildspacer (player)  {
		const
			t = this,
			isNative = t.media.rendererName !== null && /(native|html5|vod)/i.test(t.media.rendererName)
		;

		if (!isNative) {
			return;
		}

		t.clearspacer(player);

		player.spacerDiv = document.createElement('div');
		player.spacerDiv.className = `${t.options.classPrefix}spacer`;
		player.spacerDiv.innerHTML = ``; 

		t.addControlElement(player.spacerDiv, 'spacer');

	},
	/**
	 * Feature destructor.
	 *
	 * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 */
	clearspacer (player)  {
		if (player) {
			if (player.spacerDiv) {
				player.spacerDiv.parentNode.removeChild(player.spacerDiv);
			}
		}
	}
});
