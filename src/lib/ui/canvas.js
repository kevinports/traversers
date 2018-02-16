/* eslint-disable */
import raf from '../raf';

export default class Canvas {
	constructor(options) {
		this.config = options || {};
		this.el = document.createElement('canvas');
		this.ctx = this.el.getContext('2d');
		this.isInitialized = false;
		this.isPlaying = false;
		this.tick = 0;
		this.requestId = undefined;

		this.width = this.config.width || window.innerWidth;
		this.height = this.config.height || window.innerHeight;
    this.el.height = this.height;
    this.el.width = this.width;

    this.useFps = true;
    this.setFps(30);
	}

  setFps (fps) {
    this.fps = fps;
    this.now;
    this.then = Date.now();
    this.interval = 1000/this.fps;
    this.delta;
  }

	setup() {
	} // null until defined
	draw() {
	} // null until defined

	init() {
		if (this.isInitialized) return;
		this.isInitialized = true;
		this.setup();
	}

	render() {
    this.now = Date.now();
    this.delta = this.now - this.then;
    if (this.delta > this.interval || !this.useFps) {
      this.then = this.now - (this.delta % this.interval);
  		// reset context
  		this.ctx.save();
  		this.ctx.clearRect(0, 0, this.width, this.height);
  		this.ctx.restore();


  		// draw frame
  		this.draw.call(this);

  		// increment animation
  		this.tick++;
    }
		this.requestId = raf.request(this.render.bind(this));
	}

	start() {
		this.init();
		this.isPlaying = true;
		if (!this.requestId) {
			this.render();
		}
	}

	stop() {
		this.isPlaying = false;
		if (this.requestId) {
			raf.cancel(this.requestId);
			this.requestId = undefined;
		}
	}

  resize (options) {
    this.width = options.width;
    this.height = options.height;
    this.el.width = options.width;
    this.el.height = options.height;
    this.retinafy();
  }

	retinafy() {
		let scaleFactor = this.backingScale(this.ctx),
			storeFactor = this.backingStore(this.ctx),
			ratio = scaleFactor / storeFactor;

		if (scaleFactor !== storeFactor) {
			let oldWidth = this.el.width;
			let oldHeight = this.el.height;

			this.el.width = oldWidth * ratio;
			this.el.height = oldHeight * ratio;

			this.el.style.width = oldWidth + 'px';
			this.el.style.height = oldHeight + 'px';

			this.ctx.scale(ratio, ratio);
		}
	}

	backingScale(context) {
		if ('devicePixelRatio' in window) {
			if (window.devicePixelRatio > 1) {
				return window.devicePixelRatio;
			}
		}
		return 1;
	}

	backingStore(context) {
		return context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;
	}

  drawOnce () {
    this.start();
    this.stop();
  }
}
