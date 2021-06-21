import Path from "./path.js";
import Point from "./point.js";

export default class PolygonPath extends Path {
    constructor(props = {}) {
        super(props);
        this._isClose = true;
        this._sides = props.sides;
        if (this._sides == null) this._sides = 5;
        this._points = new Array(this._sides);
    }

    get sides() { return this._sides; }
    set sides(s) {
        if (this._sides != s) {
            this._sides = s;
            this.fireDirty();
            this._points = new Array(s);
        }
    }

    get isClose() { return true; }

    _createPolygonPoints() {
        let a = this.width / 2;
        let b = this.height / 2;
        let theta = -Math.PI / 2;
        let delta = Math.PI * 2 / this.sides;
        for (let i = 0; i < this.sides; i++) {
            let x = Math.cos(theta) * a;
            let y = Math.sin(theta) * b;
            this._points[i] = new Point({ x: x, y: y, type: 0 });
            theta += delta;
        }
    }

    createPath(ctx, w, h) {
        this._createPolygonPoints();
        super.createPath(ctx, w, h);
    }
}