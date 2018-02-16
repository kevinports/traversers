/* eslint-disable */

// Constrains a value to not exceed a maximum and minimum value.
export function constrain(aNumber, aMin, aMax) {
	// eslint-disable-next-line no-nested-ternary
	return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
}
// Re-maps a number from input range to output range.
export function remap(value, istart, istop, ostart, ostop) {
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
