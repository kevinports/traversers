/* eslint-disable */
import Canvas from '../ui/canvas';
import Particle from '../scene/particle';

const halfPI = Math.PI / 2;

export default class Particles extends Canvas {

    constructor(options) {
        super(options);
        this.agents = [];
        this.mesh = null;
        this.retinafy();
        this.setFps(60);
    }

    draw() {
        let ctx = this.ctx;
        // size of square and circle
        let w = 6;
        let h = 6;
        // size of triangles
        let side = 7;
        var triH = side * (Math.sqrt(3) / 2);

        if (!this.agents.length) return;

        for (let agent of this.agents) {
            // update agent
            if (this.mesh) agent.doTraverse(this.mesh.nodes);

            if (agent.isTraversing) agent.update();

            // draw agent
            agent.render(ctx);

        }

        //clean up dead particles
        for (var i = 0; i < this.agents.length - 1; i++) {
            if (!this.agents[i].isTraversing) this.agents.splice(i, 1);
        }
        if (!this.agents[0].isTraversing) this.agents = [];

    }

    add(p) {
        this.agents.push(p)
    }

    clear() {
        this.agents = [];
    }

}
