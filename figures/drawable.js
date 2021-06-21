import CanvasKitUtils from "./canvaskit-utils.js";
import Transformable from "./transformable.js";


const XML_TAB = '   ';
export default class Drawable extends Transformable {
    constructor(props) {
        super(props);
        this._id = CanvasKitUtils.newID();
        this.children = [];
        this.showChildren = true;
        this.visible = true;
        this.clip = false;
    }

    get id() { return this._id; }

    set id(id) { this._id = id }

    get isVisible() {
        return this.visible && this.width != 0 && this.height != 0
            && this.scaley != 0 && this.scalex != 0;
    }

    draw(ctx) {
        if (!this.isVisible) return;
        ctx.save();
        this.beforeDrawSelf();

        this.beforeTransform();
        this.transform(ctx);

        if (this.clip) this.applyClip(ctx);

        this.drawSelf(ctx);
        this.beforeDrawChildren();
        this.drawChildren(ctx);
        ctx.restore();
    }

    applyClip(ctx) {

    }


    beforeTransform() { }

    transform(ctx) {
        ctx.concat(this.matrix.data);
    }

    beforeDrawSelf() { }

    drawSelf(painter) { }

    beforeDrawChildren() { }

    drawChildren(painter) {
        if (!this.showChildren) return;
        this.children.forEach((child) => {
            child.draw(painter);
        });
    }

    addChild(child) {
        return this.insertChild(child, this.children.length);
    }

    insertChild(child, index) {
        if (index == -1 || !child) return false;
        if (child.parent != null) {
            console.warn('cannot add child because it has a parent,please delete it first');
            return;
        }
        if (index >= this.children.length) {
            this.children.push(child);
            child.parent = this;
            this.fireEvent('addChild', {
                parent: this, child: child,
                index: this.children.length - 1
            });
            return true;
        }
        this.children.push(child);
        child.parent = this;
        for (let i = this.children.length - 1; i > index; i--) {
            let temp = this.children[i];
            this.children[i] = this.children[i - 1];
            this.children[i - 1] = temp;
        }
        this.fireEvent('addChild', {
            parent: this, child: child,
            index: index
        });
        return true;
    }

    indexOfChild(child) {
        return this.children.indexOf(child);
    }

    removeChild(child) {
        if (!child) return;
        let index = this.indexOfChild(child);
        return this.removeAt(index);
    }

    removeAt(index) {
        if (index == -1) return;
        let r = this.children.splice(index, 1);
        if (r && r[0]) {
            let child = r[0];
            child.parent = null;
            this.fireEvent('removeChild', { parent: this, child: child });
            return child;
        }
    }

    /**
     * @deprecated
     * @param { } from 
     * @param {*} to 
     * @returns 
     */
    moveIndex(from, to) {
        if (from == to || from < 0 || from > this.children.length - 1
            || to < 0 || to > this.children.length - 1) {
            console.warn(`invalidate from/to index value :${from} -> ${to}`);
            return;
        }
        if (from > to) {
            for (let i = from; i > to; i--) {
                let t = this.children[from - 1];
                this.children[from - 1] = this.children[from];
                this.children[from] = t;
            }
        }
        if (from < to) {
            for (let i = from; i < to; i++) {
                let t = this.children[from];
                this.children[from] = this.children[from + 1];
                this.children[from + 1] = t;
            }
        }
    }

    dispose() {
        if (this.isDisposed) return;
        if (this.children) {
            this.children.forEach((child) => {
                child.dispose();
            })
            this.children.length = 0;
        }
        super.dispose();
    }

    clone() {
        // if(!this.visible) return; // 不显示的图形是不是也要克隆呢？
        let me = super.clone();
        if (me) {
            me.visible = this.visible;
            me.clip = this.clip;
            if (this.children) {
                this.children.forEach(c => {
                    let cc = c.clone();
                    if (cc) me.addChild(cc)
                })
            }
            return me;
        }
    }

    getJsonObjectName() { return 'drawable' }

    async toJsonObject() {
        let obj = await super.toJsonObject()
        obj.visible = this.visible;
        obj.id = this.id;
        obj.clip = this.clip;
        obj.showChildren = this.showChildren;
        if (this.children && this.children.length != 0) {
            obj.children = [];
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                obj.children.push(await child.toJsonObject())
            }
        }
        return obj;
    }

    getSVGCDATA() { }

    getSVGDefs() { }

    getSVGAppendContents() { }

    async getSVGString(tab = XML_TAB, defines = []) {
        let str = `<${this.getSVGLabelName()} id="${this.id}"`;
        let postionStr = this.getSVGPositionString();
        if (postionStr) str += ` ${postionStr}`;
        let dimension = this.getSVGDimensionString();
        if (dimension) str += ` ${dimension}`;
        let transform = this.getSVGTransformString();
        if (transform) str += ` transform="${transform}"`;
        let extension = this.getSVGExtensionString();
        if (extension) str += ` ${extension}`;
        let cdata = this.getSVGCDATA();
        let def = this.getSVGDefs();
        if (def && defines) defines.push(def);
        if ((this.children && this.children.length > 0) || cdata != null) {
            str += ">";
            if (cdata) {
                str += `\n${tab}${cdata}`;
            }
            if ((this.children && this.children.length > 0)) {
                for (let i = 0; i < this.children.length; i++) {
                    const child = this.children[i];
                    try {
                        let csvg = await child.getSVGString(tab + XML_TAB, defines);
                        if (csvg) {
                            str += `\n${tab}${csvg}`;
                        }
                    } catch (e) {
                        // 容错
                        console.warn(e);
                    }
                }
            }
            let extendsContents = this.getSVGAppendContents(defines);
            if (extendsContents) {
                str += `\n${tab}${extendsContents}`;
            }
            str += `\n</${this.getSVGLabelName()}>`;
            return str;
        } else {
            let extendsContents = this.getSVGAppendContents(defines);
            if (extendsContents) {
                str += `\n${tab}${extendsContents}`;
                str += `\n</${this.getSVGLabelName()}>`;
            } else str += '/>';
            return str;
        }
    }

    getSVGTransformString() {
        let str = `translate(${this.x} ${this.y})`;
        if (this.rotation != 0) {
            if (str) str += ' '; else str = '';
            str += `rotate(${this.rotation * 180 / Math.PI})`
        }
        if (this.scalex != 1 || this.scaley != 1) {
            if (str) str += ' '; else str = '';
            str += `scale(${this.scalex} ${this.scaley})`
        }
        if (this.skewx != 0) {
            if (str) str += ' '; else str = '';
            str += `skewX(${this.skewx * 180 / Math.PI})`
        }
        if (this.skewy != 0) {
            if (str) str += ' '; else str = '';
            str += `skewY(${this.skewy * 180 / Math.PI})`
        }
        return str;
    }

    getSVGPositionString() {
        // 默认是0，0
    }

    getSVGDimensionString() {
        return `width="${this.width}" height="${this.height}"`;
    }

    getSVGLabelName() {
        return '';
    }

    getSVGExtensionString() { }
}