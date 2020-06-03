import Path from './path.js';
import Point from './point.js';

export default class StarPath extends Path {
    constructor(props = {}) {
        super(props);
        this._innerRadius = props.innerRadius;
        if (this._innerRadius == null) this._innerRadius = 0.5;
        this._starPoints = props.starPoints;
        if (this._starPoints == null) this._starPoints = 5;
        else this._starPoints = Math.floor(this._starPoints);
        this._isClose = true;
        this._points = new Array(this._starPoints * 2);
        this._outlinecreated = false;
        this._inlinecreated = false;
    }

    get isClose() { return true; }

    get innerRadius() { return this._innerRadius; }
    set innerRadius(r) {
        if (this._innerRadius != r) {
            this._innerRadius = r;
            this._inlinecreated = false;
            this.fireDirty();
        }
    }

    get starPoints() { return this._starPoints; }
    set starPoints(r) {
        let ir = Math.floor(r);
        if (this._starPoints != ir) {
            this._starPoints = ir;

            this._outlinecreated = false;
            this._inlinecreated = false;
            this._points = new Array(ir * 2);

            this.fireDirty();
        }
    }

    _createStarPoints() {
        let count = this._starPoints;
        let delta = Math.PI * 2 / count;

        let outAngleOffset = -Math.PI / 2;
        let outIndexOffset = 0;

        let inAngleOffset = outAngleOffset + delta / 2;
        let inIndexOffset = 1;

        let a = this.width / 2;
        let a1 = a * this.innerRadius;
        let b = this.height / 2;
        let b1 = b * this.innerRadius;

        for (let i = 0, angle = 0, index = 0; i < count; i++) {
            if (!this._outlinecreated) {
                let theta = angle + outAngleOffset;
                let x = Math.cos(theta) * a;
                let y = Math.sin(theta) * b;
                this._points[index + outIndexOffset] = new Point({ x: x, y: y, type: 0 });
            }
            if (!this._inlinecreated) {
                let theta = angle + inAngleOffset;
                let x = Math.cos(theta) * a1;
                let y = Math.sin(theta) * b1;
                this._points[index + inIndexOffset] = new Point({ x: x, y: y, type: 0 });
            }
            angle += delta;
            index += 2;
        }
        this._outlinecreated = true;
        this._inlinecreated = true;
    }

    createPath(ctx, w, h) {
        this._createStarPoints();
        super.createPath(ctx, w, h);
    }
}