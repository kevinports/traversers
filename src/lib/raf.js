/* eslint-disable */
var vendors = ['webkit', 'moz'],
    requestAlias,
    cancelAlias,
    raf;

for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame) {
  var lastTime = 0;
  requestAlias = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
  };
} else {
  requestAlias = window.requestAnimationFrame.bind(window);
}

if (!window.cancelAnimationFrame){
  cancelAlias = function(id) {
      clearTimeout(id);
  };
} else {
  cancelAlias = window.cancelAnimationFrame.bind(window);
}

export default raf = {
  request: requestAlias,
  cancel: cancelAlias
};
