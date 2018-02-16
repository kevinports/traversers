/* eslint-disable */
import Canvas from '../ui/canvas';
import Particle from '../scene/particle';

export default class Mesh extends Canvas {

  constructor (options) {
    super(options);
    this.useFps = false;
    this.width = options.width;
    this.height = options.height;
    this.resolutionSetting = options.resolution || null;
    this.minResolutionSetting = options.minResolution || null;
    this.strokeStyle = options.strokeStyle;
    this.nodes = [];
    this.setLayout();
    this.createReferences();
    this.retinafy();
  }

  draw (ctx) {
    for (let node of this.nodes) {
      let ctx = this.ctx;
			ctx.beginPath();
			for (let i = 0; i < node.neighbors.length; i++) {
				var other = this.nodes[node.neighbors[i]];
				ctx.moveTo(node.location.x, node.location.y);
				ctx.lineTo(other.location.x, other.location.y);
				ctx.strokeStyle = this.strokeStyle;
				ctx.lineWidth = 1;
			}
			ctx.stroke();
		}
  }

  setLayout () {
    if (!this.resolutionSetting) {
      this.resolution = this.height / 11;
      if (this.resolution < 50) this.resolution = 50;
    } else {
      this.resolution = this.height / this.resolutionSetting
    }
    if (this.minResolutionSetting && this.resolution < this.minResolutionSetting) {
      this.resolution = this.minResolutionSetting;
    }

    let gridHeight = this.height;
    let gridWidth = this.width;
    this.numRows = gridWidth / this.resolution + 1;
    this.numCols = gridHeight / this.resolution + 2;


    // create node layout
    let halfRes = this.resolution / 2;
    let offset = -halfRes;
    for (var y = 0; y < this.numCols; y++) {
      for (var x = 0; x < this.numRows; x++) {
        let yPos = offset + y * this.resolution;
        let xPos = (offset) + x * this.resolution;
        let xOffset = (y % 2 == 0) ? halfRes : 0; //creates offset in grid to achieve "isometric" layout

        if (Math.random() > 0.18) { // 12% of the time we skip a node. this creates the holes in the mesh
          this.nodes.push(new Particle({
            x: xPos + xOffset,
            y: yPos
          }));
        }
      }
      // xOffset += offset; // offset each row's horizontal position to create isomorphic grid
    }
  }

  createReferences () {
  	for (let node of this.nodes) {
  		// find nearest neighbor for each node, the agents will use this to traverse the grid
  		node.neighbors = [];
  		let i = 0;
  		for (let other of this.nodes) {
  			let distance = node.location.dist(other.location);
  			if (distance < this.resolution + (this.resolution / 2) && distance != 0) {
  				node.neighbors.push(i); //store array reference
  			}
  			i++;
  		}
  	}
  }

  reset () {
    this.nodes = [];
    this.setLayout();
    this.createReferences();
    this.drawOnce();
  }

}
