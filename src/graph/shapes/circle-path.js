import Path from "./path.js";
const START = -Math.PI / 2;
const END = Math.PI * 1.5;
/**
 * 特殊的正圆形Path
 */
export default class CirclePath extends Path {
    constructor(props = { anchorX: 0.5, anchorY: 0.5 }) {
        super(props);
    }

    get isClose() { return true; }

    /**
     * 这要以中心为原点
     * @param {*} ctx 
     * @param {*} w 
     * @param {*} h 
     */
    createPath(ctx, w, h) {
        ctx.arc(w / 2, h / 2, w / 2, START, END);
    }

    calculatePathLength() {
        return Math.PI * this.width;
    }
}