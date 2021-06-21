import Point from "../point.js";
import Transformable from "../transformable.js";
import Star from "./star.js";

export default class CenterStar extends Star {
    constructor(props) {
        super(props);
    }

    createMySelf() {
        return new CenterStar({ radius: this.radius, corners: this.corners });
    }

    _configPathPoints(path) {
        let pointsCount = this.corners * 2;
        for (let i = 0; i < pointsCount; i++) {
            path.addPoint(new Point());
        }
        let count = this.corners;
        let delta = Transformable.PI2 / count;

        let outAngleOffset = - Transformable.HALF_PI;
        let outIndexOffset = 0;

        let inAngleOffset = outAngleOffset + delta / 2;
        let inIndexOffset = 1;

        let a = this.width / 2;
        let a1 = a * this.radius;
        let b = this.height / 2;
        let b1 = b * this.radius;

        let offsetx = 0;  //this.width / 2;
        let offsety = 0; //this.height / 2;

        for (let i = 0, angle = 0, index = 0; i < count; i++) {
            let theta = angle + outAngleOffset;
            let x = Math.cos(theta) * a;
            let y = Math.sin(theta) * b;
            let p1 = path.points[index + outIndexOffset];
            p1.x = x + offsetx; p1.y = y + offsety;

            theta = angle + inAngleOffset;
            x = Math.cos(theta) * a1;
            y = Math.sin(theta) * b1;
            let p2 = path.points[index + inIndexOffset];
            p2.x = x + offsetx; p2.y = y + offsety;
            angle += delta;
            index += 2;
        }
    }

    // async toJsonObject() {
    //     let obj = await super.toJsonObject();
    //     obj.cx = obj.x, obj.cy = obj.y;
    //     delete obj.x, delete obj.y;
    //     return obj;
    // }

    getJsonObjectName() { return 'center-star' }
}