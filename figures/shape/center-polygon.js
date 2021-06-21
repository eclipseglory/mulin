import Point from "../point.js";
import Polygon from "./polygon.js";

export default class CenterPolygon extends Polygon {
    constructor(props) {
        super(props);
    }

    createMySelf() {
        return new CenterPolygon({ sides: this.sides });
    }
    getJsonObjectName(){return 'center-polygon'}

    _configPathPoints(path) {
        let a = this.width / 2;
        let b = this.height / 2;
        let theta = -Math.PI / 2;
        let delta = Math.PI * 2 / this.sides;
        let offsetx = 0;//this.width / 2;
        let offsety = 0;//this.height / 2;
        for (let i = 0; i < this.sides; i++) {
            let x = Math.cos(theta) * a + offsetx;
            let y = Math.sin(theta) * b + offsety;
            path.addPoint(new Point(x, y));
            theta += delta;
        }
    }

    // async toJsonObject() {
    //     let obj = await super.toJsonObject();
    //     obj.cx = obj.x, obj.cy = obj.y;
    //     delete obj.x, delete obj.y;
    //     return obj;
    // }
}