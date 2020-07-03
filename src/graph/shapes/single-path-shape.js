import Shape from "./shape.js";
import FillStyle from "./paint-style/fill-style.js";
import StrokeStyle from "./paint-style/stroke-style.js";
import Color from "../color.js";

export default class SinglePathShape extends Shape {
    constructor(props = {}) {
        super(props);
        this._fillStyle = new FillStyle({ color: new Color() });
        this._strokeStyle = new StrokeStyle({ color: new Color(), width: 0 });
        this.fillStyles.push(this._fillStyle);
        this.strokeStyles.push(this._strokeStyle);
        this._singlePath = this.createSinglePath(props);
        if (this._singlePath) {
            this.addPath(this._singlePath);
        }
    }

    get isClose() {
        return true;
    }

    createSinglePath() {

    }
    get width() {
        if (this._singlePath)
            return this._singlePath.width;
    }

    set width(w) {
        if (this._singlePath)
            this._singlePath.width = w;
    }

    get height() {
        if (this._singlePath)
            return this._singlePath.height;
    }

    set height(w) {
        if (this._singlePath)
            this._singlePath.height = w;
    }

    get color() {
        return this._fillStyle.color;
    }

    set color(c) {
        this._fillStyle.color = c;
    }

    set borderColor(c) {
        this._strokeStyle.color = c;
    }

    get borderColor() {
        return this._strokeStyle.color;
    }

    get borderWidth() {
        return this._strokeStyle.width;
    }

    set borderWidth(w) {
        this._strokeStyle.width = w;
    }
}