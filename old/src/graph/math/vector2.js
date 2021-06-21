export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get mod() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let m = this.mod;
        if (m == 0) return;
        this.x = this.x / m;
        this.y = this.y / m;
    }

    scale(v) {
        this.x *= v;
        this.y *= v;
    }

    dot(x, y) {
        return this.x * x + this.y * y;
    }
}