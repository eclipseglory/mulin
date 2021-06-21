import Gradient from "./gradient";

export default class LinearGradient extends Gradient {
    constructor(props) {
        super(props);
        this.x1 = props == null || props.x1 == null ? 0 : props.x1;
        this.y1 = props == null || props.y1 == null ? 0 : props.y1;
        this.x2 = props == null || props.x2 == null ? 0 : props.x2;
        this.y2 = props == null || props.y2 == null ? 0 : props.y2;
    }

    get x1() {
        return this._x1;
    }

    set x1(v) {
        if (this._x1 != v) {
            this._x1 = v;
            this.deleteShader();
        }
    }
    get x2() {
        return this._x2;
    }

    set x2(v) {
        if (this._x2 != v) {
            this._x2 = v;
            this.deleteShader();
        }
    }

    get y1() {
        return this._y1;
    }

    set y1(v) {
        if (this._y1 != v) {
            this._y1 = v;
            this.deleteShader();
        }
    }

    get y2() {
        return this._y2;
    }

    set y2(v) {
        if (this._y2 != v) {
            this._y2 = v;
            this.deleteShader();
        }
    }


    createShader(kit) {
        let stops = this.createColorArray();
        let pos = this.createPosArray();
        return kit.Shader.MakeLinearGradient([this.x1, this.y1], [this.x2, this.y2], stops, pos,
            kit.TileMode.Clamp);
    }

    clone() {
        let c = new LinearGradient({ x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 });
        this.colorStops.forEach(stop => {
            c.addColorStop(stop.clone())
        })
        return c;
    }
}