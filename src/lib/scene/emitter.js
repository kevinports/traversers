/* eslint-disable */
import Vec2 from '../math/vec2';
import { remap } from '../func';

export default class Emitter {
  constructor (x, y, node, iconLabel) {
    this.x = x;
    this.y = y;
    this.node = node;
    this.el = document.createElement('div');
    this.el.classList.add('comp-emitter');
    this.iconLabel = iconLabel;

    this.container = document.createElement('div');
    this.container .classList.add('comp-emitter-container');
    let icon = this.createIcon();

    this.el.appendChild(this.container);
    this.el.appendChild(icon);
  }

  createIcon () {
    const svgns = "http://www.w3.org/2000/svg";
    const xlinkns = "http://www.w3.org/1999/xlink";
    let svg = document.createElementNS(svgns, "svg");

    // SVG on IE before Edge does not have classList so fallback to class.
    if (svg.classList) {
      svg.classList.add('icon');
    } else {
      svg.setAttribute('class', 'icon');
    }

    let use = document.createElementNS(svgns, "use");
    use.setAttributeNS(xlinkns, "href", '#icon-iot-' + this.iconLabel);
    svg.appendChild(use);
    return svg;
  }

  isSending (color) {
    let halo = document.createElement('div');
    halo.classList.add('comp-emitter-halo');
    halo.style.backgroundColor = color;
    this.el.appendChild(halo);
    TweenLite.to(halo, 1.4, {
      scale: 1.6,
      alpha: 0,
      onComplete: () => {
        this.el.removeChild(halo);
      }
    });
    TweenLite.set(this.container, {
			scale: 0.8
    });
    TweenLite.to(this.container, 1, {
			scale: 1,
			ease: Elastic.easeOut.config(4.5, 0.4)
		});
  }

  isReceiving (color) {
    let ring = document.createElement('div');
    ring.classList.add('comp-emitter-ring');
    ring.style.borderColor = color;
    this.el.appendChild(ring);
    TweenLite.to(ring, 1.8, {
      scale: 1.6,
      alpha: 0,
      onComplete: () => {
        this.el.removeChild(ring);
      }
    });
  }
}
