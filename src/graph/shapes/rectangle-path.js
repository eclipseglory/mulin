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
        this.startX = 0.5;
        this.startY = 0.5;
    }

    get isClose() { return true; }

    get radius() { return this._radius; }
    set radius(r) {
        if (this._radius != r) {
            this._radius = r;
            this.fireDirty();
        }
    }

    _createRectanglePath(ctx, left, top, right, bottom) {
        let w = Math.abs(right - left);
        let h = Math.abs(bottom - top);
        if (this.radius == 0) {
            // ctx.moveTo(-w / 2, -h / 2);
            ctx.rect(left, top, right - left, bottom - top);
            ctx.closePath();
        }
        else {
            let min = Math.min(w, h);

            let r = this.radius;
            if (r > min / 2) {
                r = min / 2;
            }
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

    /**
     * 这要以中心为原点
     * @param {*} ctx 
     * @param {*} w 
     * @param {*} h 
     */
    createPath(ctx, w, h) {
        let left = -w * this.startX;
        let top = -h * this.startY;
        let right = left + w;
        let bottom = top + h;
        this._createRectanglePath(ctx, left, top, right, bottom);
    }

    calculatePathLength() {
        let w = Math.abs(this.width);
        let h = Math.abs(this.height);
        if (this.radius == 0) {
            return (w + h) * 2;
        } else {
            let l = (w + h) * 2;
            let min = Math.min(w, h);

            let r = this.radius;
            if (r > min / 2) {
                r = min / 2;
            }
            l -= 8 * r;
            l += Math.PI * 2 * r;
            return l;
        }
    }

    getRowVertices() {
        let w = this.width;
        let h = this.height;
        let left = -w * this.startX;
        let top = -h * this.startY;
        let right = left + w;
        let bottom = top + h;
        return [[left, top], [right, top], [right, bottom], [left, bottom]];
    }
}