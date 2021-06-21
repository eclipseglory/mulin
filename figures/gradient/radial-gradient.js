import Gradient from './gradient';

export default class RadialGradient extends Gradient {
    constructor(x = 0, y = 0, radius = 0) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    get x() { return this._x }
    set x(v) {
        if (this._x != v) {
            this._x = v;
            this.deleteShader();
        }
    }

    get y() { return this._y }
    set y(v) {
        if (this._y != v) {
            this._y = v;
            this.deleteShader();
        }
    }

    get radius() { return this._radius }
    set radius(v) {
        if (this._radius != v) {
            this._radius = v;
            this.deleteShader();
        }
    }

    createShader(kit) {
        return kit.Shader.MakeRadialGradient([this.x, this.y], this.radius, this.createColorArray(),
            this.createPosArray(), kit.TileMode.Clamp);
    }


    clone() {
        let c = new RadialGradient(this.x, this.y, this.radius);
        this.colorStops.forEach(stop => {
            c.addColorStop(stop.clone())
        })
        return c;
    }
}