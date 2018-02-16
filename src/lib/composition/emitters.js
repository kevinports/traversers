/* eslint-disable */
import Emitter from '../scene/emitter';
import BoundingBox from '../math/boundingBox';
import {remap} from '../func';
import {iconLabels} from '../data/iconLabels';
import {TweenLite} from 'gsap';

export default class Emitters {

  constructor (numEmitters) {
    this.numEmitters = numEmitters;
    this.el = document.createElement('div');
    this.el.classList.add('comp-wrapper');
    this.emitters = [];
    this.usedIcons = {};
  }

  setLayout (mesh) {
    let nodes = mesh.nodes;
    let minNode = nodes[0].location;
    let maxNode = nodes[nodes.length - 1].location;
    let padding = 20;


    for (var i = 0; i < this.numEmitters; i++) {
      let attempts = 0;

      attemptsLoop:
      while (attempts < 100){
        attempts++;
        let index = Math.floor(remap(Math.random(), 0, 1, 0, nodes.length))
        let candidate = nodes[index];


        //try again if on edge of mesh
        if (candidate.location.x <= minNode.x + padding
          || candidate.location.y <= minNode.y + padding
          || candidate.location.x >= maxNode.x
          || candidate.location.y >= maxNode.y
        ) {
          continue attemptsLoop;
        }

        //try again if in same node
        if (this.emitters.length) {
          for (let other of this.emitters) {
            if (candidate.location.dist(other) < mesh.resolution * 3) continue attemptsLoop;
          }
        }

        //location has been found
        let icon = this.getIcon();
        this.emitters.push(new Emitter(candidate.location.x, candidate.location.y, candidate, icon));
        break;
      }
    }
  }

  display () {
    if (!this.emitters.length) return;
    for (let emitter of this.emitters){
      emitter.el.style.left = emitter.x +'px';
      emitter.el.style.top = emitter.y +'px';
      this.el.appendChild(emitter.el);
    }
  }

  getRandomPair () {
    if (!this.emitters.length) return;
    let startIndex = this.randomIndex(this.emitters);
    let findOther = () => {
      let candidate = this.randomIndex(this.emitters);
      if (candidate == startIndex) return findOther();
      return candidate;
    }

    let start = this.emitters[startIndex];
    let finish = this.emitters[findOther()];

    return {
      start: start,
      finish: finish
    };
  }

  getIcon () {
    let findIcon = () => {
      let candidateIndex = this.randomIndex(iconLabels);
      if (this.usedIcons[candidateIndex]) return findIcon();
      let candidateLabel = iconLabels[candidateIndex];
      this.usedIcons[candidateIndex] = candidateLabel;
      return candidateLabel;
    }
    return findIcon();
  }

  randomIndex (arr) {
    return Math.floor(remap(Math.random(), 0, 1, 0, arr.length))
  }

  clear () {
    while (this.el.hasChildNodes()){
      this.el.removeChild(this.el.lastChild);
    }
    this.usedIcons = [];
    this.emitters = [];
  }

}
