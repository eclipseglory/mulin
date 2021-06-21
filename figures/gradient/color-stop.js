export default class ColorStop {
    constructor(r = 1, g = 1, b = 1, a = 1, pos = 0) {
        this._values = new Float32Array(4);
        this._values[0] = r;
        this._values[1] = g;
        this._values[2] = b;
        this._values[3] = a;
        this.pos = pos;
    }

    get color() { return this._values }

    get pos() { return this._pos }
    set pos(p) { this._pos = p }

    equals(color) {
        if (this == color) return true;
        return color.color[0] == this._values[0] &&
            color.color[1] == this._values[1] &&
            color.color[2] == this._values[2] &&
            color.color[3] == this._values[3] && color.pos == this.pos;
    }

    clone() {
        return new ColorStop(this.color[0], this.color[1], this.color[2], this.color[3], this.pos);
    }

    dispose() {
        this._values = null;
    }
}