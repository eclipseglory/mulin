import Figure from "../figure.js";
/**
* 线较为特殊，所以不让它具有width，height，x，y属性，也就不让它能够自动实现变换。
* 另外也不允许他拥有子节点,所以不必从Figure继承。
但由于js没有接口，只能是将很多方法跟Figure同名，便于其他Figure调用
 */
export default class Line {
    constructor(params) {
        params = params || {};
        this._hidden = params['hidden'] == null ? false : params['hidden'];
        this._points = params['points'] || [];
        this.color = params['color'] || '#000000';
        this.width = params['width'] == null ? 1 : params['width'];
        // Cap的值为 round , square , butt
        this.cap = params['cap'] || 'round';
        // join的值为 "bevel" || "round" || "miter"
        this.join = params['join'] || 'round';
        this.lineDash = params['lineDash'] || [];// 默认实线
        this.miterLimit = params['miterLimit'] == null ? 10 : params['miterLimit']; // 默认为10
        this.dashOffset = params['dashOffset'] == null ? 0 : params['dashOffset'];// 默认值为0
        this._mode = params['mode'] || 'direct';
        // this._close = params['close'] == null ? false : params['close'];
        // this._f = params['f'] == null ? 0.3 : params['f'];
        // this._t = params['t'] == null ? 0.6 : params['t'];
        this._path2d;
        this._contentDirty = true;
    }


    get mode() { return this._mode; }
    set mode(m) {
        if (this._mode != m) {
            this._mode = m;
            this._contentDirty = true;
        }
    };

    get hidden() { return this._hidden; }
    set hidden(h) {
        this._hidden = h;
    }


    get points() { return this._points; }


    addPoint(p) {
        this._points.push(p);
        this._contentDirty = true;
    }

    removePointAt(index) {
        if (index < 0 || index > this._points.length - 1) return;
        this._points.splice(index, 1);
        this._contentDirty = true;
    }

    /**
     * 不推荐使用，将会被删除
     * @deprecated
     * @param {Object>} p 
     */
    removePoint(p) {
        this.removePointAt(this._points.indexOf(p));
    }

    _applyCurrentDrawingStates(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = this.cap;
        ctx.lineJoin = this.join;
        ctx.lineDashOffset = this.dashOffset;
        ctx.lineMiterLimit = this.miterLimit;
        ctx.setLineDash(this.lineDash);
    }

    canDraw() {
        return this.color != null && this.opacity != 0 &&
            this.lineWidth != 0 && !this.hidden;
    }

    draw(ctx) {
        if (!this.canDraw()) return;
        ctx.save();
        this._applyCurrentDrawingStates(ctx);
        this._drawSelf(ctx);
        ctx.restore();
    }

    _drawSelf(ctx) {
        if (this._points.length < 2) return;
        let first = this._points[0];
        if (first == null) return;
        if (this._contentDirty) {
            if (this._path2d == null) {
                this._path2d = ctx.wx_canvas.createPath2D();
            }
            if (this._path2d)
                this._createLine(this.path2d);
            this._contentDirty = false;
        }

        if (this._path2d != null) {
            ctx.stroke(this._path2d);
        } else {
            //说明根本就没有path2d这东西，直接画
            this._createLine(ctx);
            ctx.stroke();
        }
    }

    /**
     * 根据所有点创建一个线的path
     * @param {CanvasRenderingContext2D} ctx 也可以是Path2D 
     */
    _createLine(ctx) {
        let first = this._points[0];
        ctx.beginPath();
        if (this._mode == 'direct') {
            ctx.moveTo(first.x, first.y);
            for (let i = 1; i < this._points.length; i++) {
                let p = this._points[i];
                ctx.lineTo(p.x, p.y);
            }
        }

        if (this._mode == 'curved') {
            this.bzCurve(ctx, this._points);
        }
    }

    _gradient(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Array} points 
     * @param {Number} f 
     * @param {Number} t 
     */
    bzCurve(ctx, points, f, t) {
        ctx.moveTo(points[0].x, points[0].y);

        let m = 0, dx1 = 0, dy1 = 0;

        let preP = points[0];
        for (let i = 1; i < points.length; i++) {
            let curP = points[i];
            // let nexP = points[i + 1];
            // let dx2, dy2;
            // if (nexP) {
            //     m = this._gradient(preP, nexP);
            //     dx2 = (nexP.x - curP.x) * -f;
            //     dy2 = dx2 * m * t;
            // } else {
            //     dx2 = 0;
            //     dy2 = 0;
            // }

            // ctx.bezierCurveTo(
            //     preP.x - dx1, preP.y - dy1,
            //     curP.x + dx2, curP.y + dy2,
            //     curP.x, curP.y
            // );
            ctx.bezierCurveTo((preP.x + curP.x) / 2, preP.y, (curP.x + preP.x) / 2,
                curP.y, curP.x, curP.y);
            // dx1 = dx2;
            // dy1 = dy2;
            preP = curP;
        }
    }

}