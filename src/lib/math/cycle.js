/* eslint-disable */

export default class Cycle {

  constructor (arr) {
    this.arr = arr;
    this.currentIndex = 0;
  }

  get () {
    let val = this.arr[this.currentIndex];
    this.currentIndex++;
    if (this.currentIndex >= this.arr.length) this.currentIndex = 0;
    return val;
  }

}
