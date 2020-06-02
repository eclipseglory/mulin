import Path from "./path.js";
const START = -Math.PI / 2;
const END = Math.PI * 1.5;
/**
 * 特殊的正圆形Path
 */
export default class CirclePath extends Path {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
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
        ctx.moveTo(0, -w / 2);
        ctx.arc(0, 0, w / 2, START, END);
        ctx.closePath();
    }

    calculatePathLength() {
        return Math.PI * this.width;
    }
}