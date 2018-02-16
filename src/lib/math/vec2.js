/* eslint-disable */
export default class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	// --------------------------
	// instance methods
	// --------------------------

	set(v, y) {
		if (arguments.length === 1) {
			this.set(v.x || v[0] || 0,
				v.y || v[1] || 0);
		} else {
			this.x = v;
			this.y = y;
		}
	}

	get() {
		return new Vector(this.x, this.y);
	}

	// calculate the magnitude
	mag() {
		let x = this.x,
			y = this.y;
		return Math.sqrt(x * x + y * y);
	}

	setMag(v_or_len, len) {
		if (len === undefined) {
			len = v_or_len;
			this.normalize();
			this.mult(len);
		} else {
			var v = v_or_len;
			v.normalize();
			v.mult(len);
			return v;
		}
	}

	// add vectors
	add(v, y) {
		if (arguments.length === 1) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += y;
		}
	}

	// subtract vectors
	sub(v, y) {
		if (arguments.length === 1) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= y;
		}
	}

	// scale the vector with multiplication
	mult(v) {
		if (typeof v === 'number') {
			this.x *= v;
			this.y *= v;
		} else {
			this.x *= v.x;
			this.y *= v.y;
		}
	}

	// scale the vector with division
	div(v) {
		if (typeof v === 'number') {
			this.x /= v;
			this.y /= v;
		} else {
			this.x /= v.x;
			this.y /= v.y;
		}
	}

	// the Euclidean distance to another vector (considered as points)
	dist(v) {
		let dx = this.x - v.x,
			dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// the dot product of two vectors
	dot(v, y) {
		if (arguments.length === 1) {
			return (this.x * v.x + this.y * v.y);
		}
		return (this.x * v + this.y * y);
	}

	// normalize this vector to a unit length of 1
	normalize() {
		let m = this.mag();
		if (m > 0) {
			this.div(m);
		}
	}

	lerp(v, alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
	}

	limit(high) {
		if (this.mag() > high) {
			this.normalize();
			this.mult(high);
		}
	}

	heading2D() {
		return (-Math.atan2(-this.y, this.x));
	}

	toString() {
		return '[' + this.x + ', ' + this.y + ']';
	}

	array() {
		return [this.x, this.y];
	}

	isInRectangle(x, y, width, height) {
		if (this.x < x || this.x > x + width) {
			return false;
		}
		if (this.y < y || this.y > y + height) {
			return false;
		}
		return true;
	}

	// --------------------------
	// static methods
	// --------------------------

	static distance(v1, v2) {
		return v1.dist(v2);
	}

	static dot(v1, v2) {
		return v1.dot(v2);
	}

	static cross(v1, v2) {
		return v1.cross(v2);
	}

	static angleBetween(v1, v2) {
		return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
	}

	static sub(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}

	static add(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}
}
