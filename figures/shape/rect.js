import CanvasKitUtils from "../canvaskit-utils.js";
import Shape from "./shape.js";

export default class Rect extends Shape {
    constructor(props) {
        super(props);
        this.radiusx = props == null || props.radiusx == null ? 0 : props.radiusx;
        this.radiusy = props == null || props.radiusy == null ? 0 : props.radiusy;
        if (props != null && props.radius != null) {
            this.radius = props.radius;
        }
    }

    set radius(r) {
        this.radiusy = r;
        this.radiusx = r;
    }

    get radiusx() {
        return this._radiusx;
    }

    set radiusx(x) {
        if (this._radiusx != x) {
            this._radiusx = x;
            this.fireShapeDirty();
        }
    }


    get radiusy() {
        return this._radiusy;
    }

    set radiusy(y) {
        if (this._radiusy != y) {
            this._radiusy = y;
            this.fireShapeDirty();
        }
    }


    drawPath(path) {
        let rect = CanvasKitUtils.newXYWHRect(0, 0, this.width, this.height);
        if (this.radiusx != null && this.radiusy != null &&
            (this.radiusx != 0 || this.radiusy != 0)) {
            rect = CanvasKitUtils.newRRectXY(rect, this.radiusx, this.radiusy);
            path.addRRect(rect);
        } else {
            path.addRect(rect);
        }
    }

    createMySelf() {
        return new Rect({ radiusx: this.radiusx, radiusy: this.radiusy });
    }

    getJsonObjectName() { return 'rect' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.radiusx = this.radiusx;
        obj.radiusy = this.radiusy;
        return obj;
    }
}