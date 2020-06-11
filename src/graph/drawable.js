import Transformable from "./transformable.js";
import utils from "./utils.js";

export default class Drawable extends Transformable {
    constructor(props = {}) {
        super(props);
        this.drawOrder = props.drawOrder;
        this.name = props.name;
        this.id = props.id;
        this.blendMode = props.blendMode || 'source-over';
        this._visible = props.visible;
        if (this._visible == null) this.visible = true;

        this.clips = props.clips;
    }
    /// 属性 ////
    get visible() { return this._visible; }

    set visible(v) { this._visible = v; }


    /// 方法////

    addClip(shape, intersect) {
        if (this.clips == null) this.clips = [];
        this.clips.push({ shape: shape, intersect: intersect });
    }

    /**
     * 是否可以绘制
     */
    canDraw() {
        return this.opacity != 0 && this.visible && this.scaleX != 0 && this.scaleY != 0;
    }

    applyDrawingStates(context) {
        context.globalAlpha = this.globalOpacity;
        context.globalCompositeOperation = this.blendMode;
    }

    getClipRegion() {
        // TODO 有个问题没实现：
        // 在Canvas2d中，如果有多个Clips，只能剪切第一个，没剪切一次会替换上一次的剪切区域
        // 所以这里只使用数组中最后一个剪切区域
        // 但给出的剪切区域是多个，需要将多个图形作为一个剪切区域呢
        let region;
        if (this.clips) {
            region = this.clips[this.clips.length - 1];
        }
        if (region) return region;

        if (this._parent) {
            region = this._parent.getClipRegion();
        }
        return region;
    }

    _clipRegion(ctx, region) {
        let intersect = region.intersect;
        let shape = region.shape;
        if (shape.drawPaths == null) return;
        let path = shape.getShapePath(ctx);
        let m = shape.getWorldTransformMatrix();
        if (m == null) {
            return false;
        }
        if (path) {
            ctx.setTransform(m.toSVGMatrix());
            if (intersect) ctx.clip(path); else ctx.clip(path, 'evenodd');

        } else {
            ctx.beginPath();//清空之前的path栈
            ctx.setTransform(m.toSVGMatrix());
            shape.drawPaths(ctx, shape.width, shape.height);
            ctx.closePath();
            if (intersect) ctx.clip(); else ctx.clip('evenodd');
        }
        return true;
    }

    clip(ctx) {
        let region = this.getClipRegion();
        let lastClipRegion = ctx.lastClipRegion;
        if (region == null && lastClipRegion == null) {
            return true;
        }
        if (region != null && lastClipRegion != null) {
            if (region.shape == lastClipRegion.shape
                && region.intersect == lastClipRegion.intersect) {
                // 如果是相同的剪切区域和相同的剪切方式，则不再剪切
                return true;
            } else {
                ctx.restore();
                ctx.save();
                ctx.lastClipRegion = region;
                return this._clipRegion(ctx, region);
            }
        }
        if (region == null || lastClipRegion == null) {
            let r = region;
            r = r || lastClipRegion;
            ctx.lastClipRegion = r;
            ctx.restore();
            ctx.save();
            return this._clipRegion(ctx, r);
        }
        return false;
    }

    draw(context, clip = true) {
        if (!this.canDraw()) return;
        if (clip) {
            // 剪切区域保存给兄弟节点,子节点会继承剪切区域，并且通过对比查看是否需要剪切
            let notEmpty = this.clip(context);
            if (!notEmpty) {
                // 如果剪切区域是一个scale为0的区域，则说明图形绘制在一个没有大小的区域内
                // 则不需要绘制
                return;
            }
        }
        let tempRegion = context.lastClipRegion;

        // 如果计算矩阵成功就进行绘制，否则就不绘制
        // 所谓计算成功是说，scale不为0
        if (this.applyCurrentTransform(context)) {
            context.save();
            this.applyDrawingStates(context);
            this.drawSelf(context, this.width, this.height);
            context.restore();
            this.drawChildren(context, clip);
        }

        context.lastClipRegion = tempRegion;
    }

    /**
     * 该方法提供给非本canvas的context使用。一般是建立一个path，外部context自行填充或者描边
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} w 
     * @param {Number} h 
     */
    getSelfPath(ctx, w, h) {
    }

    drawChildren(context, clip) {
        this._children.forEach(child => {
            child.draw(context, clip);
        });
    }

    /**
     * 应用当前矩阵变换。
     * @param {CanvasRenderingContext2D} context 
     */
    applyCurrentTransform(context) {
        let matrix = this.getWorldTransformMatrix();
        if (matrix == null) return false;
        let data = matrix.data;
        // 这里注意，CanvasRenderingContext2D的参数（a,b,c,d,e,f）的transform数据对应矩阵和我自己的只有6个数的3x3矩阵：
        // a,c,e    a0 a1 a2
        // b,d,f => a3 a4 a5
        // 0,0,1    0  0  1
        // 所以我要给的参数是：(a0,a3,a1,a4,a2,a5)
        context.setTransform(data[0], data[3], data[1], data[4], data[2], data[5]);
        return true;
    }

    /**
     * 绘制自身,需要继承类复写。
     * 所有Drawable绘制都是从{0,0}点开始的，切勿使用自身的x和y，否则绘制结果会出问题
     * @param {CanvasRenderingContext2D} context 
     * @param {Number} width Figure绘制区域宽度
     * @param {Number} height Figure绘制区域高度
     */
    drawSelf(context, width, height) {
        // 需要覆写
    }
}