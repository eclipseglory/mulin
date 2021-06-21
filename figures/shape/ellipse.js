import CanvasKitUtils from "../canvaskit-utils.js";
import Shape from "./shape.js";

export default class Ellipse extends Shape {
    constructor(props) {
        super(props);
    }

    get radiusx() {
        return this.width / 2;
    }

    set radiusx(x) {
        this.width = x * 2;
    }


    get radiusy() {
        return this.height / 2;
    }

    set radiusy(y) {
        this.height = y * 2
    }

    drawPath(path) {
        let rect = CanvasKitUtils.newXYWHRect(0, 0, this.width, this.height);
        path.addOval(rect);
    }

    createMySelf() {
        return new Ellipse({ radiusx: this.radiusx, radiusy: this.radiusy });
    }

    getJsonObjectName() { return 'ellipse' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.radiusx = this.radiusx;
        obj.radiusy = this.radiusy;
        return obj;
    }
}