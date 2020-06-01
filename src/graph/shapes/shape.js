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

    get shapePath() {
        return this._path2d;
    }

    /// 方法 ////

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

    drawSelf(ctx, w, h) {
        if (this.isDirty()) {
            // 这些操作全是因为微信没有path2d造成的
            this._path2d = utils.createPath2D(ctx.wx_canvas);//ctx.wx_canvas.createPath2D();
            if (this._path2d && this._path2d.closePath == null) {
                this._path2d = null;
                //真机上path2d创建出来是一个object，根本不能用
            }
            if (this._path2d != null) {
                this.createSubPath2D(ctx);
            }
        }

        if (this._path2d == null) {
            // 没有path就硬画
            ctx.beginPath();
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

        // 不管是不直接硬画，都还是save一下
        this.saveDirty();

        this.fillStyles.forEach(fillStyle => {
            fillStyle.paint(ctx, this._path2d);
        });
        if (this.strokeStyles.length > 0) {
            let length = this.getShapeLength();
            this.strokeStyles.forEach(strokeStyle => {
                strokeStyle.paint(ctx, this._path2d, length);
            })
        }
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
}