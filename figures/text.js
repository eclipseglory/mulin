import CanvasKitUtils from "./canvaskit-utils";
import Figure from "./figure";
import Utils from "./utils";

export default class Text extends Figure {
    constructor(props) {
        super(props);
        this.r = props == null || props.r == null ? 0 : props.r;
        this.g = props == null || props.g == null ? 0 : props.g;
        this.b = props == null || props.b == null ? 0 : props.b;
        this.a = props == null || props.a == null ? 1 : props.a;
        this.showBorder = props == null || props.showBorder == null ? 0 : props.showBorder;
        this.size = props == null || props.size == null ? 10 : props.size;
        this.text = props == null || props.text == null ? '' : props.text;
        this.fontFamily = props == null || props.fontFamily == null ? 'Arial' : props.fontFamily;
        this.lineSpace = props == null || props.lineSpace == null ? 0 : props.lineSpace;
        this.letterSpace = props == null || props.letterSpace == null ? 0 : props.letterSpace;
        this.hAlign = props == null || props.hAlign == null ? 'left' : props.hAlign;
        // 等同于Baseline
        this.vAlign = props == null || props.vAlign == null ? 'middle' : props.vAlign;
        this.leftToRight = props == null || props.leftToRight == null ? false : props.leftToRight;
        this.vertical = props == null || props.vertical == null ? false : props.vertical;
        this.glyphsArray = null;
    }

    get isVisible() {
        return this.visible && this.size != 0 && this.text != null && this.text.length != 0;
    }

    getFont() {
        if (this._font == null) {
            this._font = CanvasKitUtils.newFont({
                family: this.fontFamily
            }, this.size);
        }
        return this._font;
    }

    _createVerticalGlyphs(glyphsArray, msgs, font, minLineHeight, percent) {
        let maxLineHeight = -Infinity;
        for (let index = 0; index < msgs.length; index++) {
            const msg = msgs[index];
            if (msg == null || msg.length == 0) continue;
            let glyphsInfo = {};
            let result = CanvasKitUtils.getGlyphIdsAndBounds(font, msg);
            let ids = result.ids;
            glyphsInfo.ids = ids;
            glyphsInfo.text = msg;
            glyphsInfo.bounds = result.bounds;
            glyphsInfo.maxLetterWidth = minLineHeight;
            let lineHeight = 0;
            for (let i = 0; i < result.bounds.length; i++) {
                lineHeight += minLineHeight + this.letterSpace;
                glyphsInfo.maxLetterWidth = Math.max(result.bounds[i][4],
                    glyphsInfo.maxLetterWidth);
            }
            lineHeight -= this.letterSpace;
            glyphsInfo.height = lineHeight;
            glyphsInfo.count = msg.length;
            glyphsArray.push(glyphsInfo);
            maxLineHeight = Math.max(maxLineHeight, lineHeight);
        }
        this.height = maxLineHeight;
        this.width = minLineHeight * this.glyphsArray.length;
        this.width += this.lineSpace * (this.glyphsArray.length - 1);
        let offsetX = -this.width / 2;
        let offsetY = -this.height / 2;
        let tb = CanvasKitUtils.getFontTopBottom(font);
        let x = 0;
        for (let index = 0; index < glyphsArray.length; index++) {
            const glyphsInfo = glyphsArray[index];
            let positions = new Float32Array(glyphsInfo.count * 2);
            let y = -tb.top * percent;
            if (this.hAlign == 'center') {
                y += (maxLineHeight - glyphsInfo.height) / 2;
            }
            if (this.hAlign == 'right') {
                y += maxLineHeight - glyphsInfo.height;
            }
            glyphsInfo.offsetX = x + offsetX;
            glyphsInfo.offsetY = y + offsetY;
            for (let i = 0; i < glyphsInfo.bounds.length; i++) {
                const bound = glyphsInfo.bounds[i];
                if (this.vAlign == 'middle') {
                    positions[i * 2] = x + ((glyphsInfo.maxLetterWidth - bound[4]) / 2) * percent + offsetX;
                }
                if (this.vAlign == 'top') positions[i * 2] = x + offsetX;
                if (this.vAlign == 'bottom') {
                    positions[i * 2] = x + (glyphsInfo.maxLetterWidth - bound[4]) * percent + offsetX;
                }
                positions[i * 2 + 1] = y + offsetY;
                y += minLineHeight + this.letterSpace;
            }
            x += minLineHeight + this.lineSpace
            glyphsInfo.positions = positions;
        }
    }

    _createHorizontalGlyphs(glyphsArray, msgs, font, minLineHeight, percent) {
        let maxLineWidth = -Infinity;
        for (let index = 0; index < msgs.length; index++) {
            const msg = msgs[index];
            if (msg == null || msg.length == 0) continue;
            let glyphsInfo = {};
            let result = CanvasKitUtils.getGlyphIdsAndBounds(font, msg);
            let ids = result.ids;
            glyphsInfo.ids = ids;
            glyphsInfo.text = msg;
            glyphsInfo.bounds = result.bounds;
            let lineWidth = 0;
            for (let i = 0; i < result.bounds.length; i++) {
                const bound = result.bounds[i];
                lineWidth += bound[4] * percent + this.letterSpace;
            }
            lineWidth -= this.letterSpace;
            glyphsInfo.width = lineWidth;
            glyphsInfo.count = msg.length;
            glyphsArray.push(glyphsInfo);
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }
        this.width = maxLineWidth;
        this.height = minLineHeight * this.glyphsArray.length;
        this.height += this.lineSpace * (this.glyphsArray.length - 1);
        let offsetX = -this.width / 2;
        let offsetY = -this.height / 2;
        let tb = CanvasKitUtils.getFontTopBottom(font);
        let y = 0;
        for (let index = 0; index < glyphsArray.length; index++, y += minLineHeight + this.lineSpace) {
            const glyphsInfo = glyphsArray[index];
            let positions = new Float32Array(glyphsInfo.count * 2);
            let x = 0;
            if (this.hAlign == 'center') {
                x = maxLineWidth - glyphsInfo.width;
                x *= 0.5;
            }
            if (this.hAlign == 'right') {
                x = maxLineWidth - glyphsInfo.width;
            }
            glyphsInfo.offsetX = x + offsetX;
            glyphsInfo.offsetY = y + offsetY;
            for (let i = 0; i < glyphsInfo.bounds.length; i++) {
                const bound = glyphsInfo.bounds[i];
                if (this.vAlign == 'middle') positions[i * 2 + 1] = y - tb.top * percent + offsetY;
                if (this.vAlign == 'top') {
                    positions[i * 2 + 1] = -bound[1] * percent + y + offsetY;

                }
                if (this.vAlign == 'bottom') {
                    let delta = (tb.bottom - bound[3]) * percent;
                    positions[i * 2 + 1] = y - tb.top * percent + delta + offsetY;
                }
                positions[i * 2] = x + offsetX;
                x += bound[4] * percent + this.letterSpace;
            }
            glyphsInfo.positions = positions;
        }
    }

    getGlyphsMap() {
        if (!this.isVisible) return;
        if (this.glyphsArray == null) {
            this.glyphsArray = [];
            let font = this.getFont();
            if (!font) return;
            let msgs = this.text.split('\n');
            let percent = this.size / 100;
            let minLineHeight = CanvasKitUtils.getFontLineHeight(font);
            if (minLineHeight == null) {
                minLineHeight = this.size * 1.5;
            }
            else {
                minLineHeight *= percent;
            }
            if (this.vertical) {
                this._createVerticalGlyphs(this.glyphsArray, msgs, font, minLineHeight, percent);
            } else {
                this._createHorizontalGlyphs(this.glyphsArray, msgs, font, minLineHeight, percent);
            }
        }
        return this.glyphsArray;
    }

    deleteGlyphsMap() {
        if (this.glyphsArray) {
            this.glyphsArray.forEach(glyphMap => {
                for (let c in glyphMap) {
                    delete glyphMap[c];
                }
            })
            this.glyphsArray.length = 0;
            this.glyphsArray = null;
        }
    }

    deleteFont() {
        if (this._font) this.getTarget()._font.delete();
        this._font = null;
    }

    drawSelf(canvas) {
        let glyphs = this.getGlyphsMap();
        if (!glyphs || glyphs.length == 0) return;

        // debug:
        {
            // this._paint.setColorComponents(1, 0, 0, 1);
            // let rect = CanvasKitUtils.newXYWHRect(0, 0, this.width, this.height);
            // canvas.drawRect(rect, this._paint);
        }
        let pathEffect = this.getPathEffect();
        if (pathEffect) this._paint.setPathEffect(pathEffect);
        this._paint.setShader(null);
        if (this.fill > 0) {
            this._paint.setStyle(CanvasKitUtils.fillStyle);
            if (this.fill == 1) this._paint.setColorComponents(this.r / 255, this.g / 255, this.b / 255, this.alpha * this.a);
            if (this.fill == 2) {
                let s = this.linearGradient.getShader();
                if (s) this._paint.setShader(s);
            }
            if (this.fill == 3) {
                let s = this.radialGradient.getShader();
                if (s) this._paint.setShader(s);
            }
            glyphs.forEach(glyphMap => {
                canvas.drawGlyphs(glyphMap.ids, glyphMap.positions, 0, 0, this.getFont(), this._paint);
            })
        }

        if (this.showBorder > 0 && this.borderWidth != null && this.borderWidth > 0 && this.ba > 0) {
            this._paint.setStrokeWidth(this.borderWidth);
            this._paint.setStyle(CanvasKitUtils.strokeStyle);
            if (this.showBorder == 1) this._paint.setColorComponents(this.br / 255, this.bg / 255, this.bb / 255, this.alpha * this.ba);
            if (this.showBorder == 2) {
                let s = this.borderLinearGradient.getShader();
                if (s) this._paint.setShader(s);
            }
            if (this.showBorder == 3) {
                let s = this.borderRadialGradient.getShader();
                if (s) this._paint.setShader(s);
            }
            glyphs.forEach(glyphMap => {
                canvas.drawGlyphs(glyphMap.ids, glyphMap.positions, 0, 0, this.getFont(), this._paint);
            })
        }

    }

    get fontFamily() { return this._fontFamily }
    set fontFamily(s) {
        if (s != this._fontFamily) {
            this._fontFamily = s;
            this.deleteFont();
            this.deleteGlyphsMap();
        }
    }
    get size() { return this._size }
    set size(s) {
        if (s != this._size) {
            this._size = s;
            this.deleteFont();
            this.deleteGlyphsMap();
        }
    }
    get text() { return this._text }
    set text(s) {
        if (s != this._text) {
            this._text = s;
            this.deleteGlyphsMap();
        }
    }

    get lineSpace() { return this._lineSpace }
    set lineSpace(s) {
        if (s != this._lineSpace) {
            this._lineSpace = s;
            this.deleteGlyphsMap();
        }
    }

    get letterSpace() { return this._letterSpace }
    set letterSpace(s) {
        if (s != this._letterSpace) {
            this._letterSpace = s;
            this.deleteGlyphsMap();
        }
    }

    get hAlign() { return this._hAlign }
    set hAlign(s) {
        if (s != this._hAlign) {
            this._hAlign = s;
            this.deleteGlyphsMap();
        }
    }

    get vAlign() { return this._vAlign }
    set vAlign(s) {
        if (s != this._vAlign) {
            this._vAlign = s;
            this.deleteGlyphsMap();
        }
    }

    get leftToRight() { return this._leftToRight }
    set leftToRight(s) {
        if (s != this._leftToRight) {
            this._leftToRight = s;
            this.deleteGlyphsMap();
        }
    }

    get vertical() { return this._vertical }
    set vertical(s) {
        if (s != this._vertical) {
            this._vertical = s;
            this.deleteGlyphsMap();
        }
    }

    get children() { return }
    set children(s) { }
    get showChildren() { return false }
    set showChildren(s) { }
    get clip() { return false }
    set clip(c) { }

    dispose() {
        if (this.isDisposed) return;
        this.deleteGlyphsMap();
        this.deleteFont();
        super.dispose();
    }

    calculateLocalBounds(out = { left, top, right, bottom }) {
        out.left = -this.width / 2;
        out.top = -this.height / 2;
        out.right = this.width / 2;
        out.bottom = this.height / 2;
        return out;
    }

    createMySelf() {
        return new Text({
            r: this.r, b: this.b,
            g: this.g, a: this.a,
            size: this.size, text: this.text,
            fontFamily: this.fontFamily, lineSpace: this.lineSpace,
            letterSpace: this.letterSpace,
            hAlign: this.hAlign, vAlign: this.vAlign, leftToRight: this.leftToRight,
            vertical: this.vertical
        })
    }

    getJsonObjectName() {
        if (this.vertical) return 'v-text';
        return 'text';
    }

    getSVGLabelName() { return 'text' }

    getSVGPositionString() {
        return `x="${-this.width / 2}" y="${-this.height / 2}"`
    }

    getSVGDimensionString() { }

    getSVGExtensionString() {
        let str = super.getSVGExtensionString();
        str += ` dominant-baseline="hanging" font-size="${this.size}" font-family="${this.fontFamily}"`;
        if (this.vertical) {
            str += ` writing-mode="tb"`;
        }
        return str;
    }

    getSVGCDATA() {
        let glyphs = this.getGlyphsMap();
        if (glyphs && glyphs.length > 0) {
            let str = '';
            glyphs.forEach(glyphMap => {
                // TODO : FIX 竖写文字导出的SVG是错的！
                if (this.vertical) {
                    str += `\n<tspan glyph-orientation-vertical="0" x="${glyphMap.offsetX}" y="${glyphMap.offsetY}" letter-spacing="${this.letterSpace}">${glyphMap.text}</tspan>`;
                } else {
                    str += `\n<tspan x="${glyphMap.offsetX}" y="${glyphMap.offsetY}" letter-spacing="${this.letterSpace}">${glyphMap.text}</tspan>`;
                }
            })
            return str;
        }
    }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        obj.size = this.size;
        obj.text = this.text;
        obj.fontFamily = this.fontFamily;
        obj.lineSpace = this.lineSpace;
        obj.letterSpace = this.letterSpace;
        obj.hAlign = this.hAlign;
        obj.vAlign = this.vAlign;
        obj.leftToRight = this.leftToRight;
        obj.vertical = this.vertical;
        return obj;
    }
}