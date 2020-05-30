import Shape from "./shape.js";


const HALF_PI = Math.PI / 2;

export default class Rectangle extends Shape {
    constructor(params) {
        params = params || {};
        super(params);
        this._radius = params['radius'] == null ? 0 : params['radius'];
    }

    get radius() {
        return this._radius;
    }

    set radius(v) {
        if (this._radius != v) {
            this._radius = v;
            this._contentDirty = true;
        }
    }

    _createShapePath(ctx, w, h) {
        ctx.beginPath();
        if (this.radius == 0) {
            ctx.rect(0, 0, w, h);
        } else {
            let min = Math.min(w, h);
            if (this.radius > min / 2) throw new Error('圆角矩形半径怎么可能大于它的宽度或者长度一半呢?');
            let r = this.radius;
            ctx.moveTo(r, 0);
            ctx.lineTo(w - r, 0);
            ctx.arc(w - r, r, r, -HALF_PI, 0);
            ctx.lineTo(w, h - r);
            ctx.arc(w - r, h - r, r, 0, HALF_PI);
            ctx.lineTo(r, h);
            ctx.arc(r, h - r, r, HALF_PI, Math.PI);
            ctx.lineTo(0, r);
            ctx.arc(r, r, r, Math.PI, Math.PI + HALF_PI);
        }
        ctx.closePath();
    }
}