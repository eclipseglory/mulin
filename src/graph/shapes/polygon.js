import Shape from "./shape";

export default class Polygon extends Shape {
    constructor(params) {
        params = params || {};
        super(params);
        // 没个point是一个二维数组 0是x，1是y
        this._close = params['close'] == null ? true : params['close'];
        this._points = params['points'] || [];
    }

    get points() { return this._points; }

    get close() { return this._close; }
    set close(c) {
        if (this._close != c) {
            this._close = c;
            this._contentDirty = true;
        }
    }

    addPoint(point) {
        this._points.push(point);
        this._contentDirty = true;
    }

    removePointAt(index) {
        this._points.splice(index, 1);
        this._contentDirty = true;
    }

    canDraw() {
        // 多边形至少3个点
        return this._points.length >= 3 && super.canDraw();
    }

    _createShapePath(ctx, w, h) {
        ctx.beginPath();
        let points = this._points;
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            let p = points[i];
            ctx.lineTo(p[0], p[1]);
        }

        if (this.close) { ctx.closePath(); }
    }
}