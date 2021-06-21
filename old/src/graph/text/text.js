import Figure from "../figure.js";


const ALIGN_CENTER = 'center';
const ALIGN_LEFT = 'left';
const ALIGN_RIGHT = 'right';

const BASELINE_MIDDLE = "middle";
const BASELINE_TOP = "top";
const BASELINE_BOTTOM = "bottom";
export default class Text extends Figure {
    constructor(params) {
        params = params || {};
        super(params);
        this._text = params['text'];
        this._fontFamily = params['fontFamily'] || 'arial';
        this._fontSize = params['fontSize'] == null ? 16 : params['fontSize'];
        this._fontWeight = params['fontWeight'] || 'normal';
        this._fontStyle = params['fontStyle'] || '';
        this.maxWidth = params['maxWidth'];
        this._color = params['color'] || '#0e0e0e';
        this._borderColor = params['borderColor'];
        this._borderWidth = params['borderWidth'] == null ? 0 : params['borderWidth'];
        this._width = 0;// 文字的宽度跟文本内容有关
        this.align = params['align'] || ALIGN_LEFT;
        this.baseLine = params['baseLine'] || BASELINE_TOP;
        this.lineHeight = params['lineHeight'] == null ? 1.5 : params['lineHeight'];
        this._textArray = [];
        this._textDirty = true;
    }

    // set anchor() { }
    // get anchor() { return super.anchor; }
    // 文字的x，y将是整个Figure的中心，这里需要复写
    // centerMe() {
    //     if (this._parent != null) {
    //         this.x = (this._parent.width) / 2;
    //         this.y = (this._parent.height) / 2;
    //     }
    // }

    /**
     * 因为文字的bounds跟align和baseline有关系，所以这里要复写
     */
    getVertex() {
        let x = 0, y = 0;
        let width = this.width;
        let height = this.height;
        if (this.align == ALIGN_CENTER) {
            x = -width / 2;
        }
        if (this.align == ALIGN_RIGHT) {
            x = -width;
        }

        if (this.baseline == BASELINE_MIDDLE) {
            y = -height / 2;
        }

        if (this.baseline == BASELINE_BOTTOM) {
            y = -height;
        }

        return [
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height]
        ]
    }

    get color() { return this._color; }
    set color(c) {
        if (this._color != c) {
            this._color = c;
            // this._contentDirty = true;
        }
    }

    get borderColor() { return this._borderColor; }
    set borderColor(c) {
        if (this._borderColor != c) {
            this._borderColor = c;
            // this._contentDirty = true;
        }
    }

    get borderWidth() { return this._borderWidth; }
    set borderWidth(c) {
        if (this._borderWidth != c) {
            this._borderWidth = c;
            // this._contentDirty = true;
        }
    }

    get fontStyle() { return this._fontStyle; };
    set fontStyle(s) {
        if (this._fontStyle != s) {
            this._fontStyle = s;
            this._contentDirty = true;
        }
    }
    get fontFamily() { return this._fontFamily; };
    set fontFamily(s) {
        if (this._fontFamily != s) {
            this._fontFamily = s;
            this._contentDirty = true;
        }
    }
    get fontSize() { return this._fontSize; };
    set fontSize(s) {
        if (this._fontSize != s) {
            this._fontSize = s;
            this._contentDirty = true;
        }
    }
    get fontWeight() { return this._fontWeight; };
    set fontWeight(s) {
        if (this._fontWeight != s) {
            this._fontWeight = s;
            this._contentDirty = true;
        }
    }

    get font() {
        return this.fontStyle + ' ' + this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;
    }

    set width(w) { }
    set height(h) { }

    get width() {
        if (this._contentDirty) {
            if (this._text != '' || this._text != null) {
                let parent = this.getRoot();
                if (parent != null && parent.ctx) {
                    parent.ctx.save();
                    parent.ctx.font = this.font;
                    let array = this._getTextArray();
                    let w = -Infinity;
                    for (let index = 0; index < array.length; index++) {
                        let str = array[index];
                        w = Math.max(parent.ctx.measureText(str).width, w);
                    }
                    this._width = w;
                    parent.ctx.restore();
                    this._contentDirty = false;
                }
            } else {
                return 0;
            }
        }
        if (this.maxWidth != null) {
            return Math.min(this._width, this.maxWidth);
        }
        return this._width;
    }
    // 我经常这么干,文字行的高度确实不是很好计算，特别是在没有dom的情况下。
    // 这里是设置一个百分比，通常字体的高度是字体大小的1.5倍左右(字符'j Í')
    // 有兴趣的朋友可以看看我在github的tielifa中是如何计算的
    get height() {
        return this._fontSize * this.lineHeight * this._getTextArray().length;
    }

    get text() { return this._text; };
    set text(t) {
        if (this._text != t) {
            this._text = t;
            this._contentDirty = true;
            this._textDirty = true;
        }
    }

    _getTextArray() {
        if (this._textDirty) {
            this._textArray = this._text.split('\n');
            this._textDirty = false;
        }
        return this._textArray;
    }

    addLine(str) {
        this._text += '\n' + str;
        this._textArray.push(str);
        this._contentDirty = true;
        this._textDirty = false;
    }

    removeLine(index) {
        if (index < 0 || index > this._textArray.length - 1) return;
        this._textArray.splice(index, 1);
        this._text = '';
        for (let index = 0; index < this._textArray.length; index++) {
            let str = this._textArray[index];
            this._text += str;
            if (index != this._textArray.length - 1) {
                this._text += '\n';
            }
        }
        this._contentDirty = true;
        this._textDirty = false;
    }

    canDraw() {
        return this._text != null && this._text.length != 0 && super.canDraw();
    }

    _applyCurrentDrawingStates(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        // 这里强制设置baseline为top，是为了让多行文字绘制的时候更好计算y的坐标
        // text figure的baseline可以做到baseline效果的，当然少了好几个选项，
        // 如果对其余baseline选项有兴趣的朋友可以看看我在github上的tielifa里怎么实现文字baseline设置的。
        ctx.textBaseline = 'top';
        ctx.textAlign = this.align;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        super._applyCurrentDrawingStates(ctx);
    }

    _drawSelf(ctx, w, h) {
        ctx.save();
        let textArray = this._getTextArray();
        let y = 0, x = 0;
        if (this.baseLine == BASELINE_TOP) {
            y = 0;
        }
        if (this.baseLine == BASELINE_MIDDLE) {
            y = -h / 2;
        }
        if (this.baseLine == BASELINE_BOTTOM) {
            y = -h;
        }
        if (this.maxWidth != null) {
            for (let index = 0; index < textArray.length; index++) {
                let str = textArray[index];
                ctx.fillText(str, x, y, this.maxWidth);
                if (this.borderWidth != 0 && this.borderColor != null) {
                    ctx.strokeText(str, x, y, this.maxWidth);
                }
                y += this.fontSize * this.lineHeight;
            }
        }
        else {
            for (let index = 0; index < textArray.length; index++) {
                let str = textArray[index];
                ctx.fillText(str, x, y);
                if (this.borderWidth != 0 && this.borderColor != null) {
                    ctx.strokeText(str, x, y);
                }
                y += this.fontSize * this.lineHeight;
            }
        }
        // ctx.fillStyle = 'red';
        // ctx.fillRect(-5, -5, 10, 10);
        ctx.restore();
    }
}