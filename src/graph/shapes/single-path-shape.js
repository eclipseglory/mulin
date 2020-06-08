import Shape from "./shape.js";
import FillStyle from "./paint-style/fill-style.js";
import StrokeStyle from "./paint-style/stroke-style.js";

export default class SinglePathShape extends Shape {
    constructor(props = {}) {
        super(props);
        this._fillStyle = new FillStyle({ color: [0, 0, 0] });
        this._strokeStyle = new StrokeStyle({ color: [0, 0, 0], width: 0 });
        this.fillStyles.push(this._fillStyle);
        this.strokeStyles.push(this._strokeStyle);
    }

    get color() {
        return this._fillStyle.color.color;
    }

    set color(c) {
        this._fillStyle.color.color = c;
    }

    set borderColor(c) {
        this._strokeStyle.color.color = c;
    }

    get borderColor() {
        return this._strokeStyle.color.color;
    }

    get borderWidth() {
        return this._strokeStyle.width;
    }

    set borderWidth(w) {
        this._strokeStyle.width = w;
    }
}