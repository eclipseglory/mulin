import Drawable from "../drawable.js";
import utils from "../utils.js";

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
    }

    //// 属性 ////

    /// 方法 ////

    getPath(index) {
        return this._paths[index];
    }

    getShapePath(ctx) {
        if (this.isDirty()) {
            // 这些操作全是因为微信没有path2d造成的
            this._path2d = utils.createPath2D(ctx.wx_canvas);//ctx.wx_canvas.createPath2D();
            if (this._path2d != null) {
                this.createSubPath2D(ctx);
            }
            this.saveDirty();
        }
        return this._path2d;
    }

    addFillStyle(style) {
        this.fillStyles.push(style);
    }

    addStrokeStyle(style) {
        this.strokeStyles.push(style);
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
        if (this._paths.indexOf(path) == -1)
            this._paths.push(path);
    }

    removePathAt(index) {
        if (index < 0 || index > this._paths.length - 1) return;
        this._paths.splice(index, 1);
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

    /**
     * Shape是可以没有大小的，它包含多个path，所以要定位需要查看坐标是否落在了它所包含的path中
     * @param {Number} x 
     * @param {Number} y 
     */
    containsPoint(x, y, matrix) {
        if (x == null || y == null) return null;
        let worldMatrix = this.getWorldTransformMatrix();
        if (matrix) {
            worldMatrix = worldMatrix.clone();
            worldMatrix.simpleMultiply(matrix);
        }
        for (let index = 0; index < this._paths.length; index++) {
            const path = this._paths[index];
            if (path.containsPoint(x, y, worldMatrix)) {
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

}