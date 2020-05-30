import Figure from "../figure.js";
import utils from "../utils.js";

export default class Path extends Figure {
    constructor(params = {}) {
        super(params);
        this._path;
        this._length;
    }

    get pathLength() {
        if (this._length == null) {
            this._length = this.calculatePathLength();
        }
        return this._length;
    }

    calculatePathLength() { }

    fireContentDirty() {
        super.fireContentDirty();
        this._length = null;
    }

    createPath(ctx) {
        if (this.contentDirty) {
            if (this._path == null) {
                this._path = utils.createPath2D(ctx.wx_canvas);//ctx.wx_canvas.createPath2D();
                if (this._path && this._path.beginPath == null) {
                    this._path = null;
                    //真机上path2d创建出来是一个object，根本不能用
                }
            }
            if (this._path) {
                this._createShapePath(this._path, this.width, this.height);
                this.saveContentDirty();
            }
        }
        if (!this._path) {
            this._createShapePath(ctx, this.width, this.height);
        } else {
            return this._path;
        }
    }

    _createShapePath(path, w, h) {

    }
}