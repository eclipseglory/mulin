import Shape from "./shape.js"
import Path from "../path.js"
import CanvasKitUtils from "../canvaskit-utils.js";

export default class VerticesShape extends Shape {
    constructor(props) {
        super(props);
        this.boundsRect = new Float32Array(4);
    }

    get pointsCount() {
        return this.getPathModel().points.length;
    }

    deletePathModel() {
        if (this._pathModel) {
            this._pathModel.off('dirty', this._pathModelChanged);
            this._pathModel.dispose();
            this._pathModel.parent = null;
            this._pathModel = null;
        }
    }

    insertPoint(point, index) {
        return this.getPathModel().insertPoint(point, index);
    }

    deleteAt(index) {
        return this.getPathModel().deleteAt(index);
    }

    addPoint(point) {
        let pathModel = this.getPathModel();
        return pathModel.addPoint(point);
    }

    deletePoint(point) {
        let pathModel = this.getPathModel();
        return pathModel.deletePoint(point);
    }

    drawPath(path) {
        let model = this.getPathModel();
        model.draw(path);
    }

    _pathModelChanged = () => {
        this.fireShapeDirty();
        // this.fireBoundsDirty();
    }

    _configPathPoints(path) { }


    _createPathModel(close = true) {
        let path = new Path(close);
        this._configPathPoints(path);
        return path;
    }

    getPathModel() {
        if (this._pathModel == null) {
            this._pathModel = this._createPathModel();
            this._pathModel.parent = this;
            this._pathModel.on('dirty', this._pathModelChanged);
        }
        return this._pathModel;
    }

    dispose() {
        if (this.isDisposed) return;
        delete this.boundsRect;
        this.deletePathModel();
        super.dispose();
    }

    calculateLocalBounds(out = { left, top, right, bottom }) {
        this.getTarget().getPath().getBounds(this.boundsRect);
        let a = this.boundsRect;
        let w = a[2] - a[0];
        if (w < 6) {
            a[0] -= 3;
            a[2] += 3
        }
        let h = a[3] - a[1];
        if (h < 6) {
            a[1] -= 3;
            a[3] += 3
        }
        out.left = a[0];
        out.top = a[1];
        out.right = a[2];
        out.bottom = a[3];

        return out;
    }

    containsPoint(x, y, isWorld = true) {
        this._containsPoint = undefined;
        let x1 = x;
        let y1 = y;
        if (isWorld) {
            let m = this.worldMatrix.clone();
            let realPoint = m.invert().multiplyWithVertexDatas(x1, y1);
            x1 = realPoint[0]; y1 = realPoint[1];
        }
        let count = this.getPathModel().pointsCount;
        if (count == 2) {
            // 只处理这种只有两个顶点且直连的
            let p1 = this.getPathModel().getPoint(0);
            let p2 = this.getPathModel().getPoint(1);
            if (p1.in == null && p1.out == null && p2.in == null && p2.out == null) {
                let h = this.borderWidth;
                if (h < 6) h = 6;
                let w = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
                if (w < 6) w = 6;
                let left = Math.min(p1.x, p2.x);
                let right = Math.max(p1.x, p2.x);
                let top = Math.min(p1.y, p2.y);
                let bottom = Math.max(p1.y, p2.y);
                return x1 > left && x1 < right && y1 > top && y1 < bottom
            }
        }
        let r = this.getTarget().getPath().contains(x1, y1);
        return r;
    }

    clone() {
        let me = super.clone();
        if (me) {
            me._pathModel = this.getPathModel().clone();
            me._pathModel.on('dirty', me._pathModelChanged);
            me._pathModel.parent = me;
            return me;
        }
    }


    getSVGLabelName() {
        return 'path';
    }
    getSVGDimensionString() { }

    getSVGExtensionString() {
        let ext = super.getSVGExtensionString();
        let path = this.getTarget().getPath();
        if (path) {
            if (!ext) ext = ''
            ext += ` d="${path.toSVGString()}"`;
        }
        return ext;
    }
}