import EventEmitter from "./event-emitter.js";

export default class Path extends EventEmitter {
    constructor(c = false) {
        super();
        this._points = [];
        this._closed = c;
        this.parent;
    }

    get isClosed() {
        return this._closed;
    }

    get pointsCount() {
        return this._points.length;
    }

    get points() {
        return this._points;
    }

    close() {
        this._closed = true;
    }

    open() {
        this._closed = false;
    }

    draw(ctx) {
        if (!ctx || this._points.length <= 1) return;//至少两个点
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
        if (this.isClosed) {
            nextPoint = start;
            this._lineToNext(prePoint, nextPoint, ctx);
        }
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
                ctx.quadTo(c[0], c[1], nextPoint.x, nextPoint.y);
            } else {
                ctx.cubicTo(control[0], control[1], control1[0], control1[1], nextPoint.x, nextPoint.y);
            }
        }
    }

    dispose() {
        if (this._points) {
            this._points.forEach(p => { p.dispose(); p.parent = null; })
            this._points.length = 0;
        }
        delete this._points;
        super.dispose();
    }

    getPoint(index) {
        return this.points[index];
    }

    deleteAt(index) {
        if (index == -1) return;
        let r = this._points.splice(index, 1);
        if (r && r[0]) {
            let point = r[0];
            point.dispose();
            point.parent = null;
            this.fireEvent('dirty');
            return point;
        }
    }

    deletePoint(point) {
        let index = this.getPointIndex(point);
        return this.deleteAt(index);
    }

    getPointIndex(point) {
        if (!point) return -1;
        for (let i = 0; i < this._points.length; i++) {
            const p = this._points[i];
            if (p.equals(point)) {
                return i;
            }
        }
        return -1;
    }


    addPoint(point) {
        this.insertPoint(point, this._points.length);
    }

    insertPoint(point, index) {
        if (index == -1 || !point) return false;
        if (index >= this._points.length) {
            this._points.push(point);
            point.parent = this;
            point.on('dirty', () => {
                this.fireEvent('dirty')
            });
            this.fireEvent('dirty')
            return true;
        }
        this._points.push(point);
        point.on('dirty', () => {
            this.fireEvent('dirty')
        });
        for (let i = this._points.length - 1; i > index; i--) {
            let temp = this._points[i];
            this._points[i] = this._points[i - 1];
            this._points[i - 1] = temp;
        }
        this.fireEvent('dirty')
        return true;
    }

    clone() {
        let c = new Path(this.isClosed);
        if (this._points) {
            this._points.forEach(p => {
                c.addPoint(p.clone());
            })
        }
        return c;
    }

}