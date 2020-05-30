export default class Point {
    constructor(props = { x: 0, y: 0 }) {
        if (props.x == null) throw 'x不能为空'
        if (props.y == null) throw 'y不能为空'
        this._x = props.x;
        this._y = props.y;
        this.type = props.type;
        this._in = props.in;
        this._out = props.out;

        this._dirty = false;
        this._parent;
    }

    get dirty() { return this._dirty; }

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
    get out() { return this._out; }

    setInX(v) {
        if (this.in == null) {
            this._in = [0, 0];
        }
        if (this.in[0] != v) {
            this.in[0] = v;
            this.fireDirty();
        }
    }

    setInY(v) {
        if (this.in == null) {
            this._in = [0, 0];
        }
        if (this.in[1] != v) {
            this.in[1] = v;
            this.fireDirty();
        }
    }

    setOutX(v) {
        if (this.out == null) {
            this._out = [0, 0];
        }
        if (this.out[0] != v) {
            this.out[0] = v;
            this.fireDirty();
        }
    }

    setOutY(v) {
        if (this.out == null) {
            this._out = [0, 0];
        }
        if (this.out[1] != v) {
            this.out[1] = v;
            this.fireDirty();
        }
    }

    fireDirty() {
        if (this._parent) {
            this._dirty = true;
            this._parent.firePointDirty(this);
        }
    }
    saveDirty() { this._dirty = false; }
}