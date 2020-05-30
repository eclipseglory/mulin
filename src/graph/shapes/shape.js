import Figure from "../figure.js";
import utils from "../utils.js";

/**
 * 几回图形绘制基类
 */
export default class Shape extends Figure {
    constructor(params = {}) {
        super(params);
        this.fillStyle = params.fillStyle;
        this.strokeStyle = params.strokeStyle;
        // this.color = params['color'] == null ? '#000000' : params['color'];
        // this.borderColor = params['borderColor']; //默认不绘制border
        // this.borderWidth = params['borderWidth'] == null ? 0 : params['borderWidth']; // ctx默认的线宽度是1，不能改小
        // this.borderStyle = params['borderWidth'] == null ? 'solid' : params['borderWidth'];

        this._paths = [];
        this._path2D = null;
    }

    getShapeLength() {
        let l = 0;
        this._paths.forEach(path => {
            l += path.pathLength;
        })
        return l;
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
        return (this.fillStyle != null || this.strokeStyle != null)
            && this._paths.length != 0 && this.opacity != 0
            && !this.hidden;
    }

    _drawSelf(ctx, w, h) {
        if (this._contentDirty) {
            // 真机上不允许createPath2D参数为null
            this._path2D = utils.createPath2D(ctx.wx_canvas);//ctx.wx_canvas.createPath2D();
            if (this._path2D && this._path2D.beginPath == null) {
                this._path2D = null;
                //真机上path2d创建出来是一个object，根本不能用
            }
            if (this._path2D != null) {
                this._paths.forEach(path => {
                    let p = path.createPath(ctx);
                    let matrix = path._calculateTransformMatrix();
                    this._path2D.addPath(p, matrix.toSVGMatrix());
                });
            }
        }
        if (this._path2D == null) {
            ctx.beginPath();
            this._paths.forEach(path => {
                ctx.save();
                path._applyCurrentTransform(ctx);
                path.createPath(ctx);
                ctx.restore();
            });
        } else {
        }

        if (this._clip) {
            if (this._path2D != null) {
                ctx.clip(this.path2D);
            } else {
                ctx.clip();
            }
        }
        if (this.fillStyle) {
            this.fillStyle.paint(ctx, this._path2D);
        }
        if (this.strokeStyle) {
            this.strokeStyle.paint(ctx, this._path2D, this.getShapeLength());
        }
    }
}