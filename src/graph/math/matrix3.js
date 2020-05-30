
let _TEMP = null;
let _TEMP2 = null;

/**
 * 只有两列数据的3x3矩阵。反正最后一列是固定的
 */
export default class Matrix3 {

    constructor(array = new Float32Array(6)) {
        this._array = array;
        this.identity();
    }

    /** 这个方法仅允许我使用 */
    static get TEMP() {
        if (_TEMP == null) {
            _TEMP = new Matrix3();
            _TEMP.identity();
        }
        return _TEMP;
    }

    /** 这个方法仅允许我使用 */
    static get TEMP2() {
        if (_TEMP2 == null) {
            _TEMP2 = new Matrix3();
            _TEMP.identity();
        }
        return _TEMP2;
    }

    static copyFrom(from, to) {
        let t = to.data;
        let f = from.data;
        t[0] = f[0];
        t[1] = f[1];
        t[2] = f[2];
        t[3] = f[3];
        t[4] = f[4];
        t[5] = f[5];
    }

    get data() {
        return this._array;
    }

    static IdentityMatrix(out) {
        if (out == null) out = new Float32Array(6);
        let m3 = new Matrix3(out);
        return m3.identity();
    }

    identity() {
        let out = this._array;
        out[0] = 1, out[1] = 0, out[2] = 0;
        out[3] = 0, out[4] = 1, out[5] = 0;
        return this;
    }

    rotate(radian) {
        // let m = this.data;
        let c = Math.cos(radian);
        let s = Math.sin(radian);
        // m[0] = c, m[1] = -s, m[2] = 0;
        // m[3] = s, m[4] = c, m[5] = 0;
        this.multiplyWithDatas(c, s, -s, c, 0, 0);
        return this;
    }

    scale(scalex, scaley) {
        // let m = this.data;
        // m[0] = scalex, m[1] = 0, m[2] = 0;
        // m[3] = 0, m[4] = scaley, m[5] = 0;
        this.multiplyWithDatas(scalex, 0, 0, scaley, 0, 0);
        return this;
    }

    translate(x, y) {
        // let m = this.data;
        // m[0] = 1, m[1] = 0, m[2] = x;
        // m[3] = 0, m[4] = 1, m[5] = y;
        this.multiplyWithDatas(1, 0, 0, 1, x, y);
        return this;
    }

    multiplyWithVertexDatas(x, y, out) {
        if (out == null) out = new Float32Array(2);
        let a = this.data;
        out[0] = a[0] * x + a[1] * y + a[2];// z补位是1
        out[1] = a[3] * x + a[4] * y + a[5];
        return out;
    }

    multiplyWithVertex(p, out) {
        return this.multiplyWithVertexDatas(p[0], p[1], out);
    }

    multiplyWithDatas(b00, b01, b10, b11, b20, b21) {
        let a = this.data;
        let out = this.data;
        let a00 = a[0], a01 = a[3];//, a02 = a[2];
        let a10 = a[1], a11 = a[4];//, a12 = a[5];
        let a20 = a[2], a21 = a[5];//, a22 = a[8];

        out[0] = b00 * a00 + b01 * a10;// + b02 * a20;
        out[3] = b00 * a01 + b01 * a11;// + b02 * a21;
        // out[2] = 0;//b00 * a02 + b01 * a12 + b02 * a22;

        out[1] = b10 * a00 + b11 * a10;// + b12 * a20;
        out[4] = b10 * a01 + b11 * a11;// + b12 * a21;
        // out[5] = 0;//b10 * a02 + b11 * a12 + b12 * a22;

        out[2] = b20 * a00 + b21 * a10 + a20;// b22 * a20;
        out[5] = b20 * a01 + b21 * a11 + a21;//b22 * a21;
        // out[8] = 1;//b20 * a02 + b21 * a12 + b22 * a22;
        return this;
    }

    /**
     * 和一个3x3的6个数据矩阵相乘
     * @param {Matrix3} m 
     */
    multiply(m) {
        let b = m.data;
        return this.multiplyWithDatas(b[0], b[3], b[1], b[4], b[2], b[5]);
        // let b00 = b[0], b01 = b[3];// b02 = b[2];
        // let b10 = b[1], b11 = b[4];// b12 = b[5];
        // let b20 = b[2], b21 = b[5];// b22 = b[8];
    }

    toSVGMatrix() {
        let data = this.data;
        return { a: data[0], b: data[3], c: data[1], d: data[4], e: data[2], f: data[5] };
    }
}