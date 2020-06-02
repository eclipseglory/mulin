import Path from "./path.js";
const START = -Math.PI / 2;
const END = Math.PI * 1.5;
/**
 * 特殊的正圆形Path
 */
export default class EllipsePath extends Path {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
        super(props);
        this._dirty = true;
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
        if (w == h)
            ctx.arc(0, 0, w / 2, START, END);
        else {
            ctx.ellipse(0, 0, w / 2, h / 2, 0, START, END);
        }
        ctx.closePath();
    }

    calculatePathLength() {
        if (this.width == this.height)
            return Math.PI * this.width;
        else {
            let a = this.width / 2;
            let b = this.height / 2;
            return Math.PI * 2 * Math.min(a, b) + 4 * (Math.abs(a - b));
        }
    }
}