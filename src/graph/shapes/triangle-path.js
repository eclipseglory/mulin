import Path from "./path.js";

export default class TrianglePath extends Path {
    constructor(props = {}) {
        super(props);
        this._isClose = true;
        this._points = [];

    }
    get isClose() { return true; }

    createPath(ctx, w, h) {
        let x = w / 2;
        let y = h / 2;
        ctx.moveTo(0, -y);
        ctx.lineTo(x, y);
        ctx.lineTo(-x, y);
        ctx.lineTo(0, -y);
    }

    calculatePathLength() {
        let dx = this.width / 2;
        let dy = this.height;
        let d1 = Math.sqrt(dx * dx + dy * dy);
        d1 *= 2;
        return d1 + this.width;
    }
}