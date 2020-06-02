import Path from "./path.js";
const HALF_PI = Math.PI / 2;
export default class RectanglePath extends Path {
    constructor(props = { anchorX: 0.5, anchorY: 0.5 }) {
        if (props.anchorX == null) props.anchorX = 0.5;
        if (props.anchorY == null) props.anchorY = 0.5;
        super(props);
        this._dirty = true;
        this._radius = props.radius;
        if (this._radius == null) this._radius = 0;
    }

    get isClose() { return true; }

    get radius() { return this._radius; }
    set radius(r) {
        if (this._radius != r) {
            this._radius = r;
            this.fireDirty();
        }
    }

    /**
     * 这要以中心为原点
     * @param {*} ctx 
     * @param {*} w 
     * @param {*} h 
     */
    createPath(ctx, w, h) {
        if (this.radius == 0) {
            // ctx.moveTo(-w / 2, -h / 2);
            ctx.rect(-w / 2, -h / 2, w, h);
            ctx.closePath();
        }
        else {
            let min = Math.min(w, h);

            let r = this.radius;
            if (r > min / 2) {
                r = min / 2;
            }
            let left = -w / 2;
            let top = -h / 2;
            let right = left + w;
            let bottom = top + h;
            ctx.moveTo(left + r, top);
            ctx.lineTo(right - r, top);
            ctx.arc(right - r, top + r, r, -HALF_PI, 0);
            ctx.lineTo(right, bottom - r);
            ctx.arc(right - r, bottom - r, r, 0, HALF_PI);
            ctx.lineTo(left + r, bottom);
            ctx.arc(left + r, bottom - r, r, HALF_PI, Math.PI);
            ctx.lineTo(left, top + r);
            ctx.arc(left + r, top + r, r, Math.PI, Math.PI + HALF_PI);
            ctx.closePath();
        }
    }

    calculatePathLength() {
        if (this.radius == 0) {
            return (this.width + this.height) * 2;
        } else {
            let l = (this.width + this.height) * 2;
            l -= 8 * this.radius;
            l += Math.PI * 2 * this.radius;
            return l;
        }
    }
}