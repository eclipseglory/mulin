import utils from "../utils.js";
import Transformable from "../transformable.js";

export default class Path extends Transformable {
    constructor(props = {}) {
        super(props);
        this._points = [];
        this._path;
        this._isClose = props.isClose;
        if (this._isClose == null) this._isClose = false;
        this._dirty = false;
        if (this._points.length != 0) this._dirty = true;
        this._path2d;
        this._dirtyPoints = [];
        this._length = null;
    }

    //// 属性 ////

    get width() {
        return super.width;
    }

    set width(w) {
        if (this.width != w) {
            super.width = w;
            this.fireDirty();
        }
    }

    get height() {
        return super.height;
    }

    set height(w) {
        if (this.height != w) {
            super.height = w;
            this.fireDirty();
        }
    }

    get length() {
        if (this._length == null) {
            this._length = this.calculatePathLength();
        }
        return this._length;
    }

    get isClose() { return this._isClose; }
    set isClose(c) {
        if (this._isClose != c) {
            this._isClose = c;
            this._dirty = true;
            this._length = null;
        }
    }

    set pathVertices(vertices) {
        for (let index = 0, offset = 0; index < this._points.length; index++) {
            const point = this._points[index];
            point.setVertices(vertices, offset);
            if (point.type == 0) {
                offset += 3;
            } else {
                offset += 6;
            }
        }
    }

    //// 方法 ///////

    addPoint(p) {
        if (p._parent == this) return;
        if (p._parent != null) throw '该点已经添加到其他线上，请先用它之前线删除它';
        this._points.push(p);
        p._parent = this;
        this.fireDirty();
    }

    removePointAt(index) {
        if (index < 0 || index > this._points.length - 1) return;
        let p = this._points[index];
        p._parent = null;
        this._points.splice(index, 1);

        let di = this._dirtyPoints.indexOf(p);
        if (di != -1) this._dirtyPoints.splice(di, 1);
        this.fireDirty();
    }

    removePoint(p) {
        this.removePointAt(this._points.indexOf(p));
    }

    isDirty() {
        return this._dirty || this._dirtyPoints.length != 0;
    }

    fireDirty() {
        this._dirty = true;
        this._length = null;
    }

    firePointDirty(p) {
        let index = this._dirtyPoints.indexOf(p);
        if (index == -1) {
            this._dirtyPoints.push(p);
            this.fireDirty();
        }
    }

    saveDirty() {
        this._dirty = false;
        this._dirtyPoints.forEach(point => {
            point.saveDirty();
        });
        this._dirtyPoints.length = 0;
    }

    getPath2D(ctx) {
        if (this.isDirty()) {
            this._path2d = utils.createPath2D(ctx.wx_canvas);//ctx.wx_canvas.createPath2D();
            if (this._path2d && this._path2d.closePath == null) {
                this._path2d = null;
                //真机上path2d创建出来是一个object，根本不能用
            }
            if (this._path2d != null) {
                this.createPath(this._path2d, this.width, this.height);
            }
        }
        return this._path2d;
    }

    createPath(ctx, w, h) {
        if (this._points.length <= 1) return;//至少两个点
        let start = this._points[0];
        let prePoint = start;
        let nextPoint;
        if (start == null) return;
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < this._points.length; i++) {
            nextPoint = this._points[i];
            this._lineToNext(prePoint, nextPoint, ctx);
            prePoint = nextPoint;
        }
        if (this._isClose) {
            nextPoint = start;
            this._lineToNext(prePoint, nextPoint, ctx);
        }
        this.saveDirty();
    }

    _lineToNext(prePoint, nextPoint, ctx) {
        let pout = prePoint.out;
        let nin = nextPoint.in;
        if (prePoint.type == 0 && nextPoint.type == 0) {
            ctx.lineTo(nextPoint.x, nextPoint.y);
            return;
        }
        if (pout == null && nin == null) {
            ctx.lineTo(nextPoint.x, nextPoint.y);
        } else {
            let control = pout;
            let control1 = nin;
            if (control == null || control1 == null) {
                let c = control;
                c = c || control1;
                ctx.quadraticCurveTo(c[0], c[1], nextPoint.x, nextPoint.y);
            } else {
                ctx.bezierCurveTo(control[0], control[1], control1[0], control1[1], nextPoint.x, nextPoint.y);
            }
        }
    }
    calculatePathLength() {
        let sum = 0;
        let start, next;
        for (let i = 0; i < this._points.length - 1; i++) {
            start = this._points[i];
            next = this._points[i + 1];
            sum += this._calculateSegmentLength(start, next);
        }
        if (this.isClose) {
            start = next;
            next = this._points[0];
            sum += this._calculateSegmentLength(start, next);
        }
        return sum;
    }

    _calculateSegmentLength(p1, p2) {
        let pout = p1.out;
        let nin = p2.in;
        if (pout == null && nin == null) {
            let deltax = p2.x - p1.x;
            let deltay = p2.y - p1.y;
            return Math.sqrt(deltax * deltax + deltay * deltay);
        } else {
            let control = pout;
            let control1 = nin;
            if (control == null || control1 == null) {
                let c = control;
                c = c || control1;
                return utils.bezierLength(p1, { x: c[0], y: c[1] }, p2);
            } else {
                return utils.bezierLength(p1, { x: control[0], y: control[1] }, { x: control1[0], y: control1[1] }, p2);
            }
        }
    }

    getRowVertices() {
        // 按道理说，贝塞尔曲线之类不能按照这种方法来返回围城shape的顶点，但为了计算快，则直接采用直连的方式
        let vertices = [];
        this._points.forEach(point => {
            vertices.push([point.x, point.y]);
        })
        return vertices;
    }

}