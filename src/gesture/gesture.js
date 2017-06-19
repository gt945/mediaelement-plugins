'use strict';

/**
 * Gesture seek
 *
 * This feature add swipe seek support
 */


// Feature configuration
Object.assign(mejs.MepDefaults, {
	pancount : 10
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
	buildgesture (player, controls, layers)  {
		const
			t = this;

		let gesture = player.gesture = {};
		
		gesture.seekTimeStart = -1;
		gesture.seekTimeLayer = document.createElement('div');
		gesture.seekTimeLayer.className = t.options.classPrefix + "layer " + t.options.classPrefix + "overlay";
		gesture.seekTimeLayer.innerHTML = "<div class=\"" + t.options.classPrefix + "seek-time-layer\"></div>";

		gesture.seekTimeLayer.style.display = 'none';

		layers.insertBefore(gesture.seekTimeLayer, layers.querySelector("." + t.options.classPrefix + "overlay-play"));

		
		player.hammer = new Hammer(player.container, {threshold:50, direction:Hammer.DIRECTION_VERTICAL});
		player.hammer.on('panstart panend panleft panright', function(ev) {
			switch(ev.type) {
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
					gesture.seekTimeLayer.children[0].innerHTML = date.toISOString().substr(11, 8) + '<br>' + (ev.deltaX >= 0 ? '+' : '') +  parseInt((ev.deltaX / 10));
				} else {
					gesture.seekTimeLayer.style.display = 'none';
				}
				break;
			case "panend":
				if (Math.abs(ev.deltaX) > 40 && Math.abs(ev.deltaY) < Math.abs(ev.deltaX)) {
					var seekTo = gesture.seekTimeStart + ev.deltaX / 10;
					gesture.seekTimeLayer.style.display = 'none';
					gesture.seekTimeStart = -1;
					player.setCurrentTime(seekTo);
				}
				player.play();
				break;
			}
		});
	},
	/**
	 * Feature destructor.
	 *
	 * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
	 * @param {MediaElementPlayer} player
	 */
	clearspeed (player)  {
		if (player) {
			if (player.seekTimeLayer) {
				player.seekTimeLayer.parentNode.removeChild(player.seekTimeLayer);
			}
		}
	}
});
