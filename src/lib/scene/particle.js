/* eslint-disable */
import Vec2 from '../math/vec2';
import { remap } from '../func';
const halfPI = Math.PI / 2;

export default class Particle {
  constructor (options) {
    if (!options) options = {};
    let x = options.x || 0;
    let y = options.y || 0;

    this.location = new Vec2(x, y);
    this.velocity = new Vec2(Math.random(), remap(Math.random(), 0, 1, -1, 1));
    this.acceleration = new Vec2(0, 0);
    this.maxspeed = 3.5;
    this.maxforce = 0.05;
    this.pathForce = 40;
    if (Math.random() < 0.75) {
      this.r = remap(Math.random(), 0, 1, 5, 20);
    } else {
      this.r = 5
    }
    this.traverseTarget = null;
    this.targetCache = [];
    for (let i = 0; i < 20; i++) {
      this.targetCache.push({location: new Vec2()})
    }
    this.mass = remap(this.r, 5, 10, 1, 2);

    this.color = '#000';
  }

  applyForce (force) {
    force.div(this.mass);
    this.acceleration.add(force);
  }

  setTraversal (start, end) {
    this.isTraversing = true;
    this.start = start;
    this.end = end;
    this.traverseTarget = start.node;
    this.traverseDestination = end.node;
    this.location.x = start.node.location.x;
    this.location.y = start.node.location.y;
  }

  doTraverse (nodes) { // particle path finding logic
    if (!this.traverseTarget) return;

    let destinationDistance = this.location.dist(this.traverseDestination.location);
    if (destinationDistance < 5 && this.isTraversing) {
      this.isTraversing = false;
      this.end.isReceiving(this.color)
      return;
    }

    let targetDistance = this.location.dist(this.traverseTarget.location); //find distance to next target node
    if (targetDistance < 5) { //if we've arrived at the target node, find the next one

      // recursively try to find a new target node that is closer to the destination node than current node
      let tryCount = 0;
      let tryTarget = () => {
        tryCount++;
        //select a neighbor to the current target as candidate for next target
        let numNeighbors = this.traverseTarget.neighbors.length;
        let index = Math.floor(remap(Math.random(), 0, 1, 0, numNeighbors));
        let newTargetIndex = this.traverseTarget.neighbors[index]
        let destLocation = this.traverseDestination.location;

        let candidate = nodes[newTargetIndex];

        if (tryCount == 40) { //escape recursion after 40 tries in case particle gets stuck
          return candidate;
        }

        for (let i = 0; i < this.targetCache.length; i++) {
          let previous = this.targetCache[i]
          if (previous && previous.location.x == candidate.location.x && previous.location.y == candidate.location.y){
            return tryTarget();
          }
        }

        if (!candidate) return;
        // if candidate is not closer to destination try again
        if (numNeighbors > 1 && candidate.location.dist(destLocation) > this.location.dist(destLocation)) {
          return tryTarget();
        }
        return candidate;
      }

      let newTarget = tryTarget();
      this.targetCache.shift();
      this.targetCache.push(newTarget);
      this.traverseTarget = newTarget; //we've found a new target!

    }

    // steer particle to target node
    var steer = this.seek(this.traverseTarget.location);
    steer.mult(40) //higher number gives more rigid motion, lower gives more damping
    this.applyForce(steer);
  }

  setFollowPath (vectors) {
    this.targetPath = vectors;
    this.isFollowing = true;
  }

  followPath () {
    let target;

    if (this.location.dist(this.targetPath[0]) < 5 ) {
      this.targetPath.shift();
    }
    if (!this.targetPath.length) {
      this.isFollowing = false;
      return;
    }

    target = this.targetPath[0];
    // steer particle to target node
    var steer = this.seek(target);
    steer.mult(this.pathForce) //higher number gives more rigid motion, lower gives more damping
    this.applyForce(steer);
  }

  update () {
    this.velocity.add(this.acceleration);
    if (this.damping) this.velocity.mult(this.damping);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  seek (target) {
    let desired = Vec2.sub(target, this.location);
    desired.normalize();
    desired.mult(this.maxspeed);

    let steer = Vec2.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  separate (agents) {
    let desiredseparation = this.r * 2;
    let sum = new Vec2();
    let count = 0;

    for (let i = 0; i < agents.length; i++) {
      let other = agents[i];
      let d = this.location.dist(other.location);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = Vec2.sub(this.location, other.location);
        diff.normalize();
        diff.div(d);        // Weight by distance
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      // Our desired vector is moving away maximum speed
      sum.setMag(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      let steer = Vec2.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  render (ctx) {
    // size of square and circle
    let w = 6;
    let h = 6;
    // size of triangles
    let side = 7;
    var triH = side * (Math.sqrt(3) / 2);

    let theta = this.velocity.heading2D() + halfPI;
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.location.x, this.location.y);
    ctx.rotate(theta);
    switch (this.geometry) {
        case 'square':
            ctx.rect(-w / 2, -h / 2, w, h);
            break;
        case 'circle':
            ctx.arc(0, 0, w / 2, 0, 2 * Math.PI);
            break;
        case 'triangle':
            ctx.moveTo(0, -triH / 2);
            ctx.lineTo(-side / 2, triH / 2);
            ctx.lineTo(side / 2, triH / 2);
            ctx.lineTo(0, -triH / 2);
            break;
    }
    ctx.closePath();
    ctx.restore();

    if (this.doFill) {
        ctx.fillStyle = this.color;
        ctx.fill();
    } else {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
  }

}
