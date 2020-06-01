import Transformable from "./transformable.js";

export default class Drawable extends Transformable {
    constructor(props = {}) {
        super(props);
        this.drawOrder = props.drawOrder;
        this.name = props.name;
        this.id = props.id;
        this.blendMode = props.blendMode || 'source-over';
        this.opacity = props.opacity;
        if (this.opacity == null) this.opacity = 1;
        this._visible = props.visible;
        if (this._visible == null) this.visible = true;

        this._children = [];
        this._parent;
    }
    /// 属性 ////
    get visible() { return this._visible; }

    set visible(v) { this._visible = v; }


    /// 方法////

    /**
     * 添加一个绘制子节点。如果子节点已经添加到某节点下，该方法会抛出异常
     * @param {Figure} child 
     */
    addChild(child) {
        if (child._parent != null) {
            throw new Error('子节点不能同时挂在多个父节点下,请先将该子节点从原父节点移除后再添加');
        }
        this._children.push(child);
        child._parent = this;
    }

    /**
     * 删除一个子节点
     * @param {Figure} child 
     */
    removeChild(child) {
        this.removeChildAt(this._children.indexOf(child));
    }

    /**
     * 删除对应位置的子节点
     * @param {Number} index 
     */
    removeChildAt(index) {
        if (index < 0 || index > this._children.length - 1) return;
        let c = this._children.splice(index, 1);
        if (c != null && c.length == 1) {
            c[0]._parent = null;
        }
    }
    /**
     * 是否可以绘制
     */
    canDraw() {
        return this.opacity != 0 && this.visible && this.scaleX != 0 && this.scaleY != 0;
    }

    applyDrawingStates(context) {
        context.globalAlpha = this.opacity;
        context.globalCompositeOperation = this.blendMode;
    }

    draw(context) {
        if (!this.canDraw()) return;
        context.save();
        this.applyCurrentTransform(context);
        this.applyDrawingStates(context);
        this.drawSelf(context, this.width, this.height);
        this.drawChildren(context);
        context.restore();
    }

    drawChildren(context) {
        this._children.forEach(child => {
            child.draw(context);
        });
    }

    /**
     * 应用当前矩阵变换。
     * @param {CanvasRenderingContext2D} context 
     */
    applyCurrentTransform(context) {
        let matrix = this.getTransformMatrix();
        let data = matrix.data;
        // 这里注意，CanvasRenderingContext2D的参数（a,b,c,d,e,f）的transform数据对应矩阵和我自己的只有6个数的3x3矩阵：
        // a,c,e    a0 a1 a2
        // b,d,f => a3 a4 a5
        // 0,0,1    0  0  1
        // 所以我要给的参数是：(a0,a3,a1,a4,a2,a5)
        context.transform(data[0], data[3], data[1], data[4], data[2], data[5]);
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