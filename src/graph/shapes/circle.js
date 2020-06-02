import Shape from "./shape.js";
import CirclePath from "./circle-path.js";

export default class Circle extends Shape {
    constructor(params = {}) {
        super(params);
        this._circlePath = new CirclePath(); //加一个圆形path进去
        this._radius = params['radius'] == null ? 0 : params['radius'];
        this._circlePath.width = this._radius * 2;
        this._circlePath.height = this._circlePath.width;
        this._angle = params['angle'] == null ? 360 : params['angle'];
        this._center;
        this.addPath(this._circlePath);
    }
    // 不允许再设置宽度和高度，统一设置半径
    set width(v) {
    }

    set height(v) {
    }

    get width() {
        return this.radius * 2;
    }

    get height() {
        return this.radius * 2;
    }

    get angle() {
        return this._angle;
    }

    set angle(v) {
        if (this._angle != v) {
            this._angle = v;
            if (Math.abs(this._angle) >= 360) {
                if (this._angle < 0)
                    this._angle = -360;
                else this._angle = 360;
            }
        }
    }

    get radius() {
        return this._radius;
    }

    set radius(v) {
        if (this._radius != v) {
            this._radius = v;
            this._circlePath.width = v * 2;
            this._circlePath.height = v * 2;
        }
    }

    get center() {
        if (!this._center) {
            this._center = { x: 0, y: 0 };
        }
        this._center.x = this.x + this._radius;
        this._center.y = this.y + this._radius;
        return this._center;
    }

    canDraw() {
        return super.canDraw() && this.radius != 0;
    }
}