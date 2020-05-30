import Path from "./path.js";
const START = -Math.PI / 2;
const END = Math.PI * 1.5;
export default class CirclePath extends Path {
    constructor(props = {}) {
        super(props);
    }

    _createShapePath(ctx, w, h) {
        ctx.arc(w / 2, h / 2, w / 2, START, END);
    }

    calculatePathLength() {
        return Math.PI * this.width;
    }
}