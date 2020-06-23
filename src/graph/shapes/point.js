export default class Point {
    constructor(props = { x: 0, y: 0 }) {
        if (props.x == null) throw 'x不能为空'
        if (props.y == null) throw 'y不能为空'
        this._x = props.x;
        this._y = props.y;
        this.type = props.type;
        if (this.type == null) this.type = 0;
        this._in = props.in;
        this._out = props.out;
        this._radius = props.radius;
        this._dirty = false;
        this._parent;
    }

    get parent(){
        return this._parent;
    }

    get radius() { return this._radius; }
    set radius(r) {
        if (this._radius != r) {
            this._radius = r;
            this.fireDirty();
        }
    }

    set vertices(points) {
        if (points instanceof Array) {
            this.setVertices(points, 0);
        }
    }

    setVertices(points, offset) {
        if (this.type === 0) {
            this.x = points[offset];
            this.y = points[offset + 1];
            this.radius = points[offset + 2];
            return;
        } else {
            this.x = points[offset];
            this.y = points[offset + 1];
            this.setInX(points[offset + 2]);
            this.setInY(points[offset + 3]);
            this.setOutX(points[offset + 4]);
            this.setOutY(points[offset + 5]);
        }
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
            // 因为一个path上的点可能会有很多，为了不让path遍历查找dirty的点
            // 所以让加入path的point主动通知path dirty
            // 同样，为了让path在save的时候不需要遍历所有点让其dirty重置，所以
            // 让path加入dirty的点，仅保存dirty点即可
            this._parent.firePointDirty(this);
        }
    }
    saveDirty() { this._dirty = false; }
}