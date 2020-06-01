export default class Color {
    constructor(color = [0, 0, 0]) {
        this._color;
        if (color.length == 3) {
            this._color = ['rgba(', color[0], ',', color[1], ',', color[2], ',', 1, ')'];
        }
        if (color.length == 4) {
            this._color = ['rgba(', color[0], ',', color[1], ',', color[2], ',', color[3], ')'];
        }
        this._colorString;
    }


    _converColorValue(v) {
        if (v >= 0 && v <= 1) {
            return Math.floor(255 * v);
        }
        return v;
    }

    set color(array) {
        if (array instanceof Array) {
            this.setColor(array, 0, array.length == 4);
        }
    }

    setColor(array, offset, includeAlpha) {
        this.r = array[offset];
        this.g = array[offset + 1];
        this.b = array[offset + 2];
        if (includeAlpha) {
            this.a = array[offset + 3];
        }
        return this._colorString == null;
    }

    get color() {
        if (this._colorString == null) {
            if (this._color[7] == 1) {
                let r = this._color[1].toString(16);
                if (r.length == 1) r = '0' + r;

                let g = this._color[3].toString(16);
                if (g.length == 1) g = '0' + g;

                let b = this._color[5].toString(16);
                if (b.length == 1) b = '0' + b;

                this._colorString = '#' + r + g + b;
            } else
                this._colorString = this._color.join('');
        }
        return this._colorString;
    }

    get r() { return this._color[1]; };
    set r(r) {
        r = this._converColorValue(r);
        if (r != this._color[1]) {
            this._color[1] = r;
            this._colorString = null;
        }
    }

    set g(r) {
        r = this._converColorValue(r);
        if (r != this._color[3]) {
            this._color[3] = r;
            this._colorString = null;
        }
    }
    get g() { return this._color[3]; };

    set b(r) {
        r = this._converColorValue(r);
        if (r != this._color[5]) {
            this._color[5] = r;
            this._colorString = null;
        }
    }
    get b() { return this._color[5]; };

    set a(r) {
        if (r != this._color[7]) {
            this._color[7] = r;
            this._colorString = null;
        }
    }
    get a() { return this._color[7]; };
}