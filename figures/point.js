import EventEmitter from "./event-emitter.js";

export default class Point extends EventEmitter {
    constructor(x = 0, y = 0, type = 0) {
        super();
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
        this._type = type == null ? 0 : type; //表示直连
        this.parent;
    }

    get type() { return this._type }

    set type(t) {
        if (this._type != t) {
            this._type = t;
            // 需不需要刷新？？
        }
    }

    fireDirty() {
        this.fireEvent('dirty', true);
    }

    get x() { return this._x; }
    set x(v) {
        if (this._x != v) {
            this._x = v;
            this.fireDirty();
        }
    };

    get y() { return this._y; }
    set y(v) {
        if (this._y != v) {
            this._y = v;
            this.fireDirty();
        }
    };

    get in() { return this._in; }
    set in(i) {
        if (i != this._in) {
            this._in = i;
            this.fireDirty();
        }
    }
    get out() { return this._out; }
    set out(i) {
        if (i != this._out) {
            this._out = i;
            this.fireDirty();
        }
    }

    get inX() { if (this.in) return this.in[0] }
    set inX(x) {
        if (this._in == null) this._in = [this.x, this.y];
        if (x != this._in[0]) {
            this._in[0] = x;
            this.fireDirty();
        }
    }
    get inY() { if (this.in) return this.in[1] }
    set inY(y) {
        if (this._in == null) this._in = [this.x, this.y];
        if (y != this._in[1]) {
            this._in[1] = y;
            this.fireDirty();
        }
    }

    get outX() { if (this.out) return this.out[0] }
    set outX(x) {
        if (this._out == null) this._out = [this.x, this.y];
        if (x != this._out[0]) {
            this._out[0] = x;
            this.fireDirty();
        }
    }
    get outY() { if (this.out) return this.out[1] }
    set outY(y) {
        if (this._out == null) this._out = [this.x, this.y];
        if (y != this._out[1]) {
            this._out[1] = y;
            this.fireDirty();
        }
    }

    copyFrom(point) {
        if (this.equals(point)) return;
        this.type = point.type;
        this.x = point.x;
        this.y = point.y;
        if (point.in) {
            this.inX = point.inX;
            this.inY = point.inY;
        } else {
            this._in = null;
        }
        if (point.out) {
            this.outX = point.outX;
            this.outY = point.outY;
        } else {
            this._out = null;
        }
    }

    clone() {
        let p = new Point();
        p.copyFrom(this);
        return p;
    }

    equals(p) {
        if (!p) return false;
        if (p == this) return true;
        if (p.x != this.x || p.y != this.y) return false;
        if (!((p.in && this.in) || (!p.in && !this.in)) || !((p.out && this.out) || (!p.out && !this.out))) {
            return false;
        }

        if (p.in && this.in) {
            if (p.inX != this.inX) return false;
            if (p.inY != this.inY) return false;
        }

        if (p.out && this.out) {
            if (p.outX != this.outX) return false;
            if (p.outY != this.outY) return false;
        }
        return true;
    }
}