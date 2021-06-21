export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }


    get radian() {
        return Math.atan2(this.y, this.x);
    }

    normalize() {
        let m = this.magnitude;
        if (m == 0) return;
        this.x = this.x / m;
        this.y = this.y / m;
        return this;
    }

    scale(v) {
        this.x *= v;
        this.y *= v;
        return this;
    }

    dot(x, y) {
        return this.x * x + this.y * y;
    }

    plus(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    rotate(radian) {
        let cos = Math.cos(radian), sin = Math.sin(radian);
        let y = this.x * sin + this.y * cos;
        let x = this.x * cos - this.y * sin;
        this.x = x;
        this.y = y;
        return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}