import CanvasKitUtils from "../canvaskit-utils.js";
import Rect from "./rect.js";

export default class CenterRect extends Rect {
    constructor(props) {
        super(props);
    }
    createMySelf() {
        return new CenterRect({ radiusx: this.radiusx, radiusy: this.radiusy });
    }

    drawPath(path) {
        let rect = CanvasKitUtils.newXYWHRect(-this.width / 2, -this.height / 2,
            this.width, this.height);
        if (this.radiusx != null && this.radiusy != null &&
            (this.radiusx != 0 || this.radiusy != 0)) {
            rect = CanvasKitUtils.newRRectXY(rect, this.radiusx, this.radiusy);
            path.addRRect(rect);
        } else {
            path.addRect(rect);
        }
    }

    calculateLocalBounds(out = { left: 0, top: 0, right: 0, bottom: 0 }) {
        out.left = -this.width / 2;
        out.top = -this.height / 2;
        out.right = this.width / 2;
        out.bottom = this.height / 2;
        return out;
    }


    // async toJsonObject() {
    //     let obj = await super.toJsonObject();
    //     obj.cx = obj.x, obj.cy = obj.y;
    //     delete obj.x, delete obj.y;
    //     return obj;
    // }

    getJsonObjectName(){return 'center-rect'}

    getSVGLabelName() {
        return 'rect';
    }

    getSVGPositionString() {
        return `x="${- this.width / 2}" y="${- this.height / 2}"`;
    }
}