/* eslint-disable */
// creates a bounding box for a dom element

export default class BoundingBox {

  constructor (top, right, bottom, left, padding_) {
    let padding = padding_ || 0;

    this.ix = left - padding; //topLeftX
    this.iy = top - padding; //topLeftY
    this.ax = right + padding; //bottomRightX
    this.ay = bottom + padding; //bottomRightY
  }

  isInside (point) {
    if( this.ix <= point.x && point.x <= this.ax && this.iy <= point.y && point.y <= this.ay ) {
        return true;
    } else {
      return false;
    }
  }

}
