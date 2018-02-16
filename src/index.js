/* eslint-disable */
import Canvas from './lib/ui/canvas';
import Mesh from './lib/composition/mesh';
import Particle from './lib/scene/particle';
import Particles from './lib/composition/particles';
import Emitters from './lib/composition/emitters';

import Vec2 from './lib/math/vec2';
import Cycle from './lib/math/cycle';
import {remap, debounce} from './lib/func';


// settings for behavior and look/feel
const numEmitters = 8;
const minAgents = 4;
const maxAgents = 8;
const minTimeout = 1000;
const maxTimeout = 4000;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// set up animation
let stage = document.getElementById('stage');

let stageWidth = window.innerWidth; //using stage.scrollWidth having resize issues :/
let stageHeight = stage.clientHeight;

let params = {
	width: stageWidth,
	height: stageHeight,
  strokeStyle: "rgba(255, 255, 255, 0.08)"
}
let meshComp = new Mesh(params); //mesh layer is a separate canvas drawn once
let particleComp = new Particles(params); //particle layer is a separate canvas drawn every frame
let emittersComp = new Emitters(numEmitters); // emitters layer is a set of dom elements animated with css

let timeoutIDs = [];

stage.appendChild(meshComp.el);
stage.appendChild(particleComp.el);
stage.appendChild(emittersComp.el);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// pulsing loop
let colorCycle = new Cycle(['#03EAC2', '#C337DA', '#23CAFF'])
let geometries = ['circle', 'square', 'triangle'];
function pulse () {
  let color = colorCycle.get(); // set color of every particle in the pulse
  let traverseEndPoints = emittersComp.getRandomPair(); // get start and end for particle traversion routine
  if (!traverseEndPoints) return;
	for (let i = 0; i < Math.floor(Math.random() * (maxAgents - minAgents) + minAgents); i++) {
		let agent = new Particle();
    agent.color = color;
    agent.doFill = Math.random()<.5; // randomly fill or stroke agents
    agent.geometry = geometries[Math.floor(remap(Math.random(), 0, 1, 0, geometries.length))]; //randomly select geometry
    agent.setTraversal(traverseEndPoints.start, traverseEndPoints.finish);

    //send particles out one by one
    let timeout = setTimeout(function(){
      particleComp.add(agent);
    }, i * 100);
    timeoutIDs.push(timeout);
	}
  traverseEndPoints.start.isSending(color); // pulse has started, so trigger emitter's "sending" animation
}
function triggerPulse (delay) {
  if (!delay) pulse();
  let randomTime = Math.random() * (maxTimeout - minTimeout) + minTimeout;
  let timeout = setTimeout(triggerPulse, randomTime);
  timeoutIDs.push(timeout);
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// start animation
meshComp.drawOnce();
if (window.innerWidth > 400) {
  particleComp.mesh = meshComp;
  particleComp.start(); //play particle composition
  emittersComp.setLayout(meshComp);
  emittersComp.display();
  triggerPulse(); //begin pulse loop
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Handle window resize
let clear = debounce(function(){ // TO DO use lodash debounce instead?
  for (let timeout of timeoutIDs) {
    window.clearTimeout(timeout);
  }
  timeoutIDs = [];
  emittersComp.clear();
  particleComp.clear();
  let params = {
    width: window.innerWidth,
		height: stage.clientHeight
  }
  particleComp.resize(params)
  meshComp.resize(params);
  meshComp.reset();
}, 1)

// debounce mesh rebuild, wait for resize end to rebuild animation
var rtime;
var timeout = false;
var delta = 200;
window.addEventListener('resize', function(){
  clear(); // clear animation, rebuild mesh
  rtime = new Date();
  if (timeout === false) {
    timeout = true;
    setTimeout(resizeend, delta);
  }
});

// if done resizing restart animation
function resizeend() {
  if (new Date() - rtime < delta) {
    setTimeout(resizeend, delta);
  } else {
    // resize is finished
    timeout = false;
    if (window.innerWidth > 400) {
      emittersComp.setLayout(meshComp);
      emittersComp.display();
      particleComp.start();
      triggerPulse();
    } else {
      particleComp.stop();
    }
  }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Stop pulse timer on window blur
window.onblur = function() {
  for (let timeout of timeoutIDs) {
    window.clearTimeout(timeout);
  }
  timeoutIDs = [];
};


//Restart pulse timer with delay on window focus
window.onfocus = function() {
  if (window.innerWidth > 400) {
    triggerPulse(true);
  }
};
