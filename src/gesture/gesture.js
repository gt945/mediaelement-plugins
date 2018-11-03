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

		gesture.seekHandleLayer = document.createElement('div');
		gesture.seekHandleLayer.className = t.options.classPrefix + "layer " + t.options.classPrefix + "overlay";
		gesture.seekHandleLayer.style.display = 'block';
		layers.insertBefore(gesture.seekHandleLayer, layers.querySelector("." + t.options.classPrefix + "overlay-play"));
		
		player.hammer = new Hammer(gesture.seekHandleLayer, {threshold:50, direction:Hammer.DIRECTION_HORIZONTAL});
		player.hammer.on('panstart panend pancancel panleft panright', function(ev) {
			switch(ev.type) {
			case "panstart":
				gesture.seekTimeStart = player.getCurrentTime();
				break;
			case "panleft":
			case "panright":
				if (Math.abs(ev.deltaX) > 40 && Math.abs(ev.deltaY) < Math.abs(ev.deltaX) && (ev.center.x !== 0 || ev.center.y !== 0)) {
					player.pause();
					player.showControls();
					gesture.seekTimeLayer.style.display = 'block';
					var date = new Date(null);
					var seekTime = gesture.seekTimeStart + ev.deltaX / 5;
					if (seekTime < 0) {
						seekTime = 0;
					}
					date.setSeconds(seekTime);
					let color = "black";
					let buffered = player.node.getBuffered();
					if (seekTime < buffered.start() || seekTime > buffered.end()) {
						color = "red";
					}
					let delta = "<font color=" + color + ">" + (ev.deltaX >= 0 ? '+' : '') + parseInt((ev.deltaX / 5)) + "</font>";
					gesture.seekTimeLayer.children[0].innerHTML = date.toISOString().substr(11, 8) + '<br>' + delta;
				} else {
					gesture.seekTimeLayer.style.display = 'none';
				}
				break;
			case "panend":
			case "pancancel":
				if (ev.type == "panend" && Math.abs(ev.deltaX) > 40 && Math.abs(ev.deltaY) < Math.abs(ev.deltaX)) {
					var seekTo = gesture.seekTimeStart + ev.deltaX / 5;
					player.setCurrentTime(seekTo);
				}
				gesture.seekTimeLayer.style.display = 'none';
				gesture.seekTimeStart = -1;
				player.play();
				player.startControlsTimer(player.options.controlsTimeoutMouseEnter);
				break;
			}
		});
		player.hammer.on('tap', function(){
			if(!player.options.alwaysShowControls) {
				if (player.controlsAreVisible) {
					player.hideControls(false);
				} else {
					if (player.controlsEnabled) {
						player.showControls(false);
						if (!player.options.alwaysShowControls) {
							player.startControlsTimer(t.options.controlsTimeoutMouseEnter);
						}
					}
				}
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
