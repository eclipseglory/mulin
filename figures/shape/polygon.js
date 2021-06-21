import Point from "../point.js";
import VerticesShape from "./vertices-shape.js";

export default class Polygon extends VerticesShape {
    constructor(props) {
        super(props);
        this.sides = props == null || props.sides == null ? 5 : props.sides;
    }

    _configPathPoints(path) {
        let a = this.width / 2;
        let b = this.height / 2;
        let theta = -Math.PI / 2;
        let delta = Math.PI * 2 / this.sides;
        let offsetx = this.width / 2;
        let offsety = this.height / 2;
        for (let i = 0; i < this.sides; i++) {
            let x = Math.cos(theta) * a + offsetx;
            let y = Math.sin(theta) * b + offsety;
            path.addPoint(new Point(x, y));
            theta += delta;
        }
    }

    fireShapeDirty() {
        if (this._pathModel) {
            this._pathModel.dispose();
            this._pathModel = null;
        }
        super.fireShapeDirty();
    }

    get sides() { return this._sides; }
    set sides(s) {
        if (this._sides != s) {
            this._sides = s;
            this.fireShapeDirty();
        }
    }

    createMySelf() {
        return new Polygon({ sides: this.sides });
    }

    getJsonObjectName() { return 'polygon' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.sides = this.sides;
        return obj;
    }
}