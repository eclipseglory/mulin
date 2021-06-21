import Drawable from "../drawable.js";
import utils from "../utils.js";
import Matrix3 from "../math/matrix3.js";

/**
 * 几回图形绘制基类
 */
export default class Shape extends Drawable {
    constructor(props = {}) {
        super(props);
        this.fillStyles = [];
        this.strokeStyles = [];
        // this.fillStyle = props.fillStyle;
        // this.strokeStyle = props.strokeStyle;
        this._path2d;
        this._paths = [];
        this._verticesArray = null;
    }

    //// 属性 ////

    get paths() { return this._paths; }


    /// 方法 ////

    getPath(index) {
        return this._paths[index];
    }

    getShapePath(ctx) {
        if (this.isDirty()) {
            this._verticesArray = null;
            // 这些操作全是因为微信没有path2d造成的
            this._path2d = utils.createPath2D(ctx.wx_canvas);//ctx.wx_canvas.createPath2D();
            if (this._path2d != null) {
                this.createSubPath2D(ctx);
            }
            this.saveDirty();
        }
        return this._path2d;
    }

    fireWorldTransformDirty() {
        super.fireWorldTransformDirty();
        this._verticesArray = null;
    }

    addFillStyle(style) {
        if (this.fillStyles.indexOf(style) == -1)
            this.fillStyles.push(style);
    }

    addStrokeStyle(style) {
        if (this.strokeStyles.indexOf(style) == -1)
            this.strokeStyles.push(style);
    }

    removeFillStyle(style) {
        this.removeFillStyleAt(this.fillStyles.indexOf(style));
    }

    removeFillStyleAt(index) {
        if (index < 0 || index > this.fillStyles.length - 1) return;
        this.fillStyles.splice(index, 1);
    }

    removeStrokeStyle(style) {
        this.removeStrokeStyleAt(this.strokeStyles.indexOf(style));
    }

    removeStrokeStyleAt(index) {
        if (index < 0 || index > this.strokeStyles.length - 1) return;
        this.strokeStyles.splice(index, 1);
    }

    getShapeLength() {
        let sum = 0;
        this._paths.forEach(path => {
            sum += path.length;
        });
        return sum;
    }

    isDirty() {
        for (let index = 0; index < this._paths.length; index++) {
            const path = this._paths[index];
            if (path.isDirty()) return true;
        }
        return false;
    }

    saveDirty() {
        for (let index = 0; index < this._paths.length; index++) {
            const path = this._paths[index];
            path.saveDirty();
        }
    }

    addPath(path) {
        if (this._paths.indexOf(path) == -1) {
            this._paths.push(path);
            this._verticesArray = null;
        }
    }

    removePathAt(index) {
        if (index < 0 || index > this._paths.length - 1) return;
        this._paths.splice(index, 1);
        this._verticesArray = null;
    }

    removePath(path) {
        this.removePathAt(this._paths.indexOf(path));
    }

    canDraw() {
        return (this.fillStyles.length != 0 || this.strokeStyles.length != 0)
            && this._paths.length != 0 && super.canDraw();
    }

    drawPaths(ctx, w, h) {
        this._paths.forEach(p => {
            ctx.save();
            let matrix = p.getTransformMatrix();
            if (!matrix.isIdentity()) {
                let data = matrix.data;
                ctx.transform(data[0], data[3], data[1], data[4], data[2], data[5]);
            }
            p.createPath(ctx, p.width, p.height);
            ctx.restore();
        });
    }

    drawSelf(ctx, w, h) {
        let path = this.getSelfPath(ctx, w, h);
        this.fillStyles.forEach(fillStyle => {
            fillStyle.paint(ctx, path);
        });
        if (this.strokeStyles.length > 0) {
            let length = this.getShapeLength();
            this.strokeStyles.forEach(strokeStyle => {
                strokeStyle.paint(ctx, path, length);
            })
        }
    }

    getSelfPath(ctx, w, h) {
        let path2d = this.getShapePath(ctx);
        if (path2d == null) {
            // 没有path就硬画
            ctx.beginPath();// 清空之前的Path栈
            this.drawPaths(ctx, w, h);
        }
        return path2d;
    }

    createSubPath2D(ctx) {
        this._paths.forEach(p => {
            let matrix = p.getTransformMatrix();
            if (matrix.isIdentity()) {
                this._path2d.addPath(p.getPath2D(ctx));
            } else {
                this._path2d.addPath(p.getPath2D(ctx), matrix.toSVGMatrix());
            }
        });
    }

    _getTestStrokeWidth() {
        if (this.strokeStyles.length == 0) return 10;
        let style = this.strokeStyles[0];
        return Math.max(style.width, 10);
    }

    /**
     * Shape是可以没有大小的，它包含多个path，所以要定位需要查看坐标是否落在了它所包含的path中
     * @param {Number} x 
     * @param {Number} y 
     */
    containsPoint(ctx, x, y, matrix, strokeWidth) {
        if (x == null || y == null) return null;
        if (!ctx) return super.containsPoint(ctx, x, y, matrix, strokeWidth);
        let worldMatrix = this.getWorldTransformMatrix();
        if (matrix) {
            matrix = matrix.clone();
            matrix.simpleMultiply(worldMatrix);
            worldMatrix = matrx;
        }
        // 因为并不知道path是不是都是close的，所以直接让path判断
        for (let index = 0; index < this._paths.length; index++) {
            const path = this._paths[index];
            if (path.containsPoint(ctx, x, y, worldMatrix, this._getTestStrokeWidth())) {
                return true;
            }
        }
        return false;
    }

    getBounds() {
        let left, right, top, bottom;
        if (this._paths.length != 0) {
            let p = this.getPath(0);
            let bounds = p.getBounds();
            left = bounds[0];
            right = bounds[2];
            top = bounds[1];
            bottom = bounds[3];
            for (let i = 1; i < this._paths.length; i++) {
                let path = this.getPath(i);
                let b = path.getBounds();
                left = Math.min(left, b[0]);
                right = Math.max(right, b[2]);
                top = Math.min(top, b[1]);
                bottom = Math.max(bottom, b[3]);
            }
            let matrix = this.getWorldTransformMatrix();
            let p1 = matrix.multiplyWithVertexDatas(left, top);
            let p2 = matrix.multiplyWithVertexDatas(right, bottom);
            return [p1[0], p1[1], p2[0], p2[1]];
        } else {
            return null;
        }
    }

    getVertices() {
        if (this._verticesArray == null || this.isDirty()) {
            this._verticesArray = [];
            let matrix = this.getWorldTransformMatrix();
            let tempMatrix = new Matrix3();
            this._paths.forEach(path => {
                let vertices = path.getRowVertices();
                let m = path.getTransformMatrix();
                tempMatrix.from(matrix);
                tempMatrix.simpleMultiply(m);
                vertices.forEach(vertex => {
                    tempMatrix.multiplyWithVertex(vertex, vertex);
                })
                this._verticesArray.push(vertices);
            })
        }
        return this._verticesArray;
    }

}