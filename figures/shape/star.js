import Point from "../point.js";
import Transformable from "../transformable.js";
import VerticesShape from "./vertices-shape.js";

export default class Star extends VerticesShape {
    constructor(props) {
        super(props);
        this.radius = props == null || props.radius == null ? 0.5 : props.radius;
        this.corners = props == null || props.corners == null ? 5 : Math.floor(props.corners);
    }

    createMySelf() {
        return new Star({ radius: this.radius, corners: this.corners });
    }

    fireShapeDirty() {
        if (this._pathModel) {
            this._pathModel.dispose();
            this._pathModel = null;
        }
        super.fireShapeDirty();
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

        let offsetx = this.width / 2;
        let offsety = this.height / 2;

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

    get radius() { return this._radius; }
    set radius(r) {
        if (this._radius != r) {
            this._radius = r;
            this.fireShapeDirty();
        }
    }

    get corners() { return this._corners; }
    set corners(r) {
        let ir = Math.floor(r);
        if (this._corners != ir) {
            this._corners = ir;
            this.fireShapeDirty();
        }
    }

    getJsonObjectName() { return 'star' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.corners = this.corners;
        obj.radius = this.radius;
        return obj;
    }
}