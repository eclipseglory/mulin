import CanvasKitUtils from "./canvaskit-utils.js";
import Drawable from "./drawable.js";
import ColorStop from "./gradient/color-stop.js";
import LinearGradient from "./gradient/linear-gradient.js";
import RadialGradient from "./gradient/radial-gradient.js";
import sat from "./math/sat.js";
import QuadTreeNode from "./quadtree/quadtree-node.js";
import Utils from "./utils.js";

export default class Figure extends Drawable {
    constructor(props) {
        super(props);
        this.name = props == null || props.name == null ? 'Figure' : props.name;
        this.useQuadTree = false; // 默认不使用QuadTree
        this._paint = CanvasKitUtils.newPaint();
        this.quadtree = new QuadTreeNode({ left: 0, top: 0, right: this.width, bottom: this.height });
        this.blendMode = props == null || props.blendMode == null ? CanvasKitUtils.BlendMode.SrcOver : props.blendMode;
        this.alpha = props == null || props.alpha == null ? 1 : props.alpha;

        this.fill = props == null || props.fill == null ? 1 : props.fill;
        this.showBorder = props == null || props.showBorder == null ? 1 : props.showBorder;

        this.borderWidth = props == null || props.borderWidth == null ? 1 : props.borderWidth;
        this.dashOffset = props == null || props.dashOffset == null ? 0 : props.dashOffset;
        this.dashLength = props == null || props.dashLength == null ? 0 : props.dashLength;

        this.r = props == null || props.r == null ? 255 : props.r;
        this.g = props == null || props.g == null ? 255 : props.g;
        this.b = props == null || props.b == null ? 255 : props.b;
        this.a = props == null || props.a == null ? 1 : props.a;

        this.br = props == null || props.br == null ? 0 : props.br;
        this.bg = props == null || props.bg == null ? 0 : props.bg;
        this.bb = props == null || props.bb == null ? 0 : props.bb;
        this.ba = props == null || props.ba == null ? 1 : props.ba;
    }

    getPathEffect() {
        if (!this._pathEffect) {
            if (this.dashLength > 0)
                this._pathEffect = CanvasKitUtils.CanvasKit.PathEffect.MakeDash(
                    [this.dashLength, this.dashLength], this.dashOffset);
        }
        return this._pathEffect;
    }

    deletePathEffect() {
        if (this._pathEffect) {
            this.getTarget()._pathEffect.delete();
            this._pathEffect = null;
        }
    }

    get dashOffset() { return this._dashOffset }
    set dashOffset(d) {
        if (d != this._dashOffset) {
            this._dashOffset = d;
            this.deletePathEffect();
        }
    }

    get dashLength() { return this._dashLength }
    set dashLength(d) {
        if (d != this._dashLength) {
            this._dashLength = d;
            this.deletePathEffect();
        }
    }

    get blendMode() {
        if (this._paint) return this.getTarget()._paint.getBlendMode();
    }

    set blendMode(mode) {
        if (this._paint) this.getTarget()._paint.setBlendMode(mode);
    }

    get borderLinearGradient() {
        if (this._borderLinearGradient == null) {
            let bounds = this.bounds;
            this._borderLinearGradient = new LinearGradient({ x1: bounds.left, y: 0, x2: bounds.right, y2: 0 })
            this._borderLinearGradient.addColorStop(new ColorStop(this.br, this.bb, this.bg, this.ba, 0));
            this._borderLinearGradient.addColorStop(new ColorStop(0, 0, 0, 1, 1));
        }
        return this._borderLinearGradient;
    }

    set borderLinearGradient(v) { this._borderLinearGradient = v }

    get borderRadialGradient() {
        if (this._borderRadicalGradient == null) {
            let bounds = this.bounds;
            let x = (bounds.left + bounds.right) / 2;
            let y = (bounds.top + bounds.bottom) / 2;
            let r = Utils.distance(x, y, bounds.left, bounds.top);
            this._borderRadicalGradient = new RadialGradient(x, y, r);
            this._borderRadicalGradient.addColorStop(new ColorStop(this.br, this.bb, this.bg, this.ba, 0));
            this._borderRadicalGradient.addColorStop(new ColorStop(0, 0, 0, 1, 1));
        }
        return this._borderRadicalGradient;
    }

    set borderRadialGradient(v) { this._borderRadicalGradient = v }

    get linearGradient() {
        if (this._linearGradient == null) {
            let bounds = this.bounds;
            this._linearGradient = new LinearGradient({ x1: bounds.left, y: 0, x2: bounds.right, y2: 0 })
            this._linearGradient.addColorStop(new ColorStop(this.r, this.b, this.g, this.a, 0));
            this._linearGradient.addColorStop(new ColorStop(0, 0, 0, 1, 1));
        }
        return this._linearGradient;
    }

    set linearGradient(v) { this._linearGradient = v }

    get radialGradient() {
        if (this._radicalGradient == null) {
            let bounds = this.bounds;
            let x = (bounds.left + bounds.right) / 2;
            let y = (bounds.top + bounds.bottom) / 2;
            let r = Utils.distance(x, y, bounds.left, bounds.top);
            this._radicalGradient = new RadialGradient(x, y, r);
            this._radicalGradient.addColorStop(new ColorStop(this.r, this.b, this.g, this.a, 0));
            this._radicalGradient.addColorStop(new ColorStop(0, 0, 0, 1, 1));
        }
        return this._radicalGradient;
    }

    set radialGradient(v) { this._radicalGradient = v }

    get width() { return super.width }
    set width(w) {
        if (this.width != w) {
            super.width = w;
            this._recreateQuadTree();
        }
    }

    get height() { return super.height }
    set height(w) {
        if (this.height != w) {
            super.height = w;
            this._recreateQuadTree();
        }
    }

    insertChildQuadNode(child) {
        if (!this.useQuadTree) return;
        if (!this.quadtree) {
            this.quadtree = new QuadTreeNode({
                left: 0, top: 0,
                right: this.width, bottom: this.height
            });
        }
        this.quadtree.insert(child.getQuadTreeNode());
        console.log('新加入quadnode', this.quadtree, this.quadtree.nodes.length);
    }

    get matrix() {
        if (this._transformDirty) {
            this.updateRelatedQuadTree();
        }
        return super.matrix;
    }

    updateRelatedQuadTree() {
        if (this._quadTreeNode && this.parent.useQuadTree) {
            console.log('位置改变更新quadnode', this._quadTreeNode);
            QuadTreeNode.deleteNodeForce(this._quadTreeNode);
            console.log('强制删除quadnode', this.parent.quadtree);
            this._quadTreeNode = null;
            // Promise.resolve().then(() => {
            if (this.parent) {
                this.parent.insertChildQuadNode(this);
            }
            // });
        }
    }

    _recreateQuadTree() {
        if (!this.useQuadTree) return;
        if (this._reQT == null) {
            this._reQT = 0;
        }
        this._reQT++;
        let id = this._reQT;
        // Promise.resolve(id).then((id) => {
        if (id != this._reQT) {
            return;
        }
        if (this.quadtree) this.quadtree.dispose();
        this.quadtree = new QuadTreeNode({
            left: 0, top: 0,
            right: this.width, bottom: this.height
        });
        this.children.forEach((child) => {
            let qn = child.getQuadTreeNode(this.matrix);
            if (qn) this.quadtree.insert(qn);
        });
        this._reQT = null;
        // });
    }

    getQuadTreeNode() {
        if (!this._quadTreeNode) {
            let b = this.worldBounds;
            this._quadTreeNode = {
                bounds: {
                    left: b.left, top: b.top,
                    right: b.right, bottom: b.bottom
                }, value: this
            };
        }
        return this._quadTreeNode;
    }

    insertChild(child, index) {
        let flag = super.insertChild(child, index);
        if (!flag) return flag;
        if (this.parent) {
            this.parent.recordAdd(child);
        } else {
            this.recordAdd(child);
        }
        this.insertChildQuadNode(child);
        return flag;
    }

    recordAdd(child) { };

    recordRemove(child) { }

    removeChild(child) {
        let removed = super.removeChild(child);
        if (!removed) return;
        if (this.parent) {
            this.parent.recordRemove(child);
        } else {
            this.recordRemove(child);
        }
        if (child && this.quadtree && this.useQuadTree) {
            QuadTreeNode.deleteNodeForce(child._quadTreeNode);
            console.log('删除quadnode', child._quadTreeNode);
        }
        return removed;
    }

    /**
     * 只返回自己的子节点，不涉及孙子节点
     * @param {Object} bounds  这是一个world bounds
     */
    findChildren(bounds) {
        let m = this.worldMatrix.clone();
        m.invert();
        try {
            let b = Utils.transformToRelatedBounds(bounds, m);
            if (this.quadtree && this.useQuadTree) {
                let nodes = this.quadtree.findNodes(b);
                return nodes;
            } else {
                let nodes = [];
                this.children.forEach(c => {
                    if (Utils.isContacted(c.worldBounds, bounds)) {
                        nodes.push(c);
                    }
                })
                return nodes;
            }
        } catch (e) {
            console.error(e)
        }
    }

    findFigure(x, y) {
        if (!this.isVisible) return null;
        let m = this.worldMatrix.clone();
        let realPoint = m.invert().multiplyWithVertexDatas(x, y);
        if (this.containsPoint(realPoint[0], realPoint[1], false)) {
            if (this.quadtree && this.useQuadTree) {
                let qnode = this.quadtree.findSingleNode(realPoint[0], realPoint[1]);
                // 这里四叉树返回结果是一个近似的，需要二次判断哦
                if (qnode) {
                    let figure = qnode.value;
                    return figure.findFigure(x, y);
                }
                return this;
            } else {
                if (this.children) {
                    for (let i = this.children.length - 1; i >= 0; i--) {
                        let child = this.children[i];
                        let f = child.findFigure(x, y);
                        if (f) return f;
                    }
                }
                return this;
            }
        } else {
            return null;
        }
    }

    drawSelf(ctx) {
        super.drawSelf(ctx);
        // DEBUG:
        // {
        //     let paint = CanvasKitUtils.newPaint();
        //     if (this.useQuadTree) {
        //         paint.setStyle(CanvasKitUtils.strokeStyle);
        //         paint.setColorComponents(1, 0, 0, 1);
        //         drawQuadTreeArea(this.quadtree);
        //         paint.delete();
        //         function drawQuadTreeArea(node) {
        //             if (node) {
        //                 if (node.nodes.length != 0) {
        //                     let b = node.bounds;
        //                     ctx.drawRect(CanvasKitUtils.newXYWHRect(b.left, b.top,
        //                         b.right - b.left, b.bottom - b.top), paint);
        //                 }
        //                 node.areas.forEach(drawQuadTreeArea);
        //             }
        //         }
        //     }
        // }
    }

    getJsonObjectName() { return 'figure' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.name = this.name == null ? obj.name : this.name;
        obj.alpha = this.alpha;
        obj.r = this.r;
        obj.b = this.b;
        obj.g = this.g;
        obj.a = this.a;
        obj.fill = this.fill;
        obj.showBorder = this.showBorder;
        if (this.showBoder != 0) {
            obj.border = {};
            let border = obj.border;
            border.dashLength = this.dashLength;
            border.dashOffset = this.dashOffset;
            border.r = this.br, border.b = this.bb, border.g = this.bg, border.a = this.ba;
        }
        return obj;
    }

    deletePaint() {
        if (this._paint) {
            this.getTarget()._paint.delete();
            this._paint = null;
        }
    }

    dispose() {
        if (this.isDisposed) return;
        if (this.quadtree) this.quadtree.dispose();
        if (this._radicalGradient) {
            this._radicalGradient.dispose();
            this._radicalGradient = null;
        }
        if (this._linearGradient) {
            this._linearGradient.dispose();
            this._linearGradient = null;
        }
        if (this._borderLinearGradient) {
            this._borderLinearGradient.dispose();
            this._borderLinearGradient = null;
        }
        if (this._borderRadicalGradient) {
            this._borderRadicalGradient.dispose();
            this._borderRadicalGradient = null;
        }
        this.deletePaint();
        this.deletePathEffect();
        super.dispose();
    }

    getSVGExtensionString() {
        let str = '';
        if (this.fill > 0) {
            if (this.fill == 1) {
                str += ` fill="${Utils.transformRGBToHex(this.r, this.g, this.b)}"`
                if (this.a != 1) {
                    str += ` fill-opacity:"${this.a}"`;
                }
            }
            if (this.fill == 2) {
                str += ` fill="url(#fill-linear-gradient-${this.id})"`;
            }
            if (this.fill == 3) {
                str += ` fill="url(#fill-radical-gradient-${this.id})"`;
            }
        } else {
            str = 'fill="none"';
        }

        if (this.showBorder > 0) {
            if (this.dashLength != 0)
                str += ` stroke-dasharray="${this.dashLength} ${this.dashLength}"`
            if (this.dashOffset != 0) {
                str += ` stroke-dashoffset="${this.dashOffset}"`
            }
            if (this.borderWidth != null)
                str += ` stroke-width="${this.borderWidth}"`
            if (this.showBorder == 1) {
                str += ` stroke="${Utils.transformRGBToHex(this.br, this.bg, this.bb)}"`
                if (this.ba != 1) {
                    str += ` stroke-opacity="${this.ba}"`;
                }
            }
            if (this.showBorder == 2) {
                str += ` stroke="url(#stroke-linear-gradient-${this.id})"`;
            }
            if (this.showBorder == 3) {
                str += ` stroke="url(#stroke-radical-gradient-${this.id})"`;
            }
        } else {
            str += ' stroke="none"';
        }
        return str;
    }

    _createStopSVGString(gradient) {
        let str = '';
        let stops = gradient.colorStops;
        stops.forEach(stop => {
            str += `\n\t<stop offset="${stop.pos}" stop-color="${Utils.transformRGBToHex(stop.color[0],
                stop.color[1], stop.color[2])}" stop-opacity="${stop.color[3]}"/>`
        });
        return str;
    }

    getSVGDefs() {
        let str = ''
        if (this.fill == 2) {
            let gradient = this.linearGradient;
            str += `\n<linearGradient id="fill-linear-gradient-${this.id}" gradientUnits="userSpaceOnUse" 
                            x1="${gradient.x1}" y1="${gradient.y1}" x2="${gradient.x2}" y2="${gradient.y2}">`;
            str += this._createStopSVGString(gradient);
            str += `\n</linearGradient>`
        }
        if (this.fill == 3) {
            let gradient = this.radialGradient;
            str += `\n<radialGradient id="fill-radical-gradient-${this.id}" gradientUnits="userSpaceOnUse" 
                            cx="${gradient.x}" cy="${gradient.y}" r="${gradient.radius}">`;
            str += this._createStopSVGString(gradient);
            str += `\n</radialGradient>`
        }

        if (this.showBorder == 2) {
            let gradient = this.borderLinearGradient;
            str += `\n<linearGradient id="stroke-linear-gradient-${this.id}" gradientUnits="userSpaceOnUse" 
                            x1="${gradient.x1}" y1="${gradient.y1}" x2="${gradient.x2}" y2="${gradient.y2}">`;
            str += this._createStopSVGString(gradient);
            str += `\n</linearGradient>`
        }
        if (this.showBorder == 3) {
            let gradient = this.borderRadialGradient;
            str += `\n<radialGradient id="stroke-radical-gradient-${this.id}" gradientUnits="userSpaceOnUse" 
                            cx="${gradient.x}" cy="${gradient.y}" r="${gradient.radius}">`;
            str += this._createStopSVGString(gradient);
            str += `\n</radialGradient>`
        }
        return str;
    }

    clone() {
        let me = super.clone();
        if (me) {
            me.name = this.name;
            me.useQuadTree = this.useQuadTree; // 默认不使用QuadTree
            me.alpha = this.alpha;

            me.r = this.r;
            me.g = this.g;
            me.b = this.b;
            me.a = this.a;

            me.br = this.br;
            me.bg = this.bg;
            me.bb = this.bb;
            me.ba = this.ba;
            me.fill = this.fill;
            me.showBorder = this.showBorder;

            me.dashLength = this.dashLength;
            me.dashOffset = this.dashOffset;

            if (this._linearGradient) {
                me._linearGradient = this._linearGradient.clone();
            }
            if (this._radicalGradient) {
                me._radicalGradient = this._radicalGradient.clone();
            }
            if (this._borderLinearGradient) {
                me._borderLinearGradient = this._borderLinearGradient.clone();
            }
            if (this._borderRadicalGradient) {
                me._borderRadicalGradient = this._borderRadicalGradient.clone();
            }
            return me;
        }
    }
}