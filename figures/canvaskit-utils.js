const MAX_ID = Math.pow(2, 31);

const _canvas_kit = Symbol('Canvaskit instance');

const DEFAULT_FONTS = [
    {
        path: 'Roboto-Regular.ttf',
        descriptors: { family: 'Roboto' }
    },

    {
        path: 'msyh.ttf',
        descriptors: { family: '微软雅黑' }
    },

    {
        path: 'Arial.ttf',
        descriptors: { family: 'Arial' }
    },
];


export default class CanvasKitUtils {


    // null means use the default typeface (which is currently NotoMono)
    static get fontCache() {
        if (this._fontCache == null) {
            this._fontCache = {};
            const fontMgr = this.FontMgr;
            let count = fontMgr.countFamilies();
            for (let i = 0; i < count; i++) {
                let fn = fontMgr.getFamilyName(i)
                this._fontCache[fn] = { '*': null }
            }
        }
        return this._fontCache;
    }

    static _fontCache;

    // descriptors is like https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
    // The ones currently supported are family, style, variant, weight.
    static addToFontCache(typeface, descriptors) {
        var key = (descriptors['style'] || 'normal') + '|' +
            (descriptors['variant'] || 'normal') + '|' +
            (descriptors['weight'] || 'normal');
        var fam = descriptors['family'];
        if (!this.fontCache[fam]) {
            // preload with a fallback to this typeface
            this.fontCache[fam] = {
                '*': typeface,
            };
        }
        this.fontCache[fam][key] = typeface;
    }

    static getFromFontCache(descriptors) {
        var key = (descriptors['style'] || 'normal') + '|' +
            (descriptors['variant'] || 'normal') + '|' +
            (descriptors['weight'] || 'normal');
        var fam = descriptors['family'];
        if (!this.fontCache[fam]) {
            return null;
        }
        return this.fontCache[fam][key] || this.fontCache[fam]['*'];
    }

    static get BlendMode() {
        if (this.CanvasKit) return this.CanvasKit.BlendMode;
    }

    static newFont(descriptors, size) {
        let tf = this.getFromFontCache(descriptors);
        if (!tf) {
            tf = this.getFromFontCache({
                family: 'Arial'
            });
        }
        var key = (descriptors['style'] || 'normal') + '|' +
            (descriptors['variant'] || 'normal') + '|' +
            (descriptors['weight'] || 'normal');
        var fam = descriptors['family'];
        let font = new CanvasKit.Font(tf, size);
        font.key = `${fam}:${key}`;
        return font;
    }

    static _glyphboundsCache = {}

    static _initFontMaxHeight(font) {
        let key = font.key == null ? '*' : font.key;
        let gc = this._glyphboundsCache[key];
        let f = font;
        let size = font.getSize();
        font.setSize(100);
        if (!gc) {
            let ids = f.getGlyphIDs('|');
            let bounds = f.getGlyphBounds(ids);
            let widths = f.getGlyphWidths(ids);
            let lk = ids[0].toString();
            this._glyphboundsCache[key] = {
                glyphbounds: {
                },
                glyphIds: {
                    '|': ids[0]
                },
                minLineHeight: 0
            }
            gc = this._glyphboundsCache[key];
            gc.glyphbounds[lk] = new Float32Array(6);
            gc.glyphbounds[lk][0] = bounds[0];
            gc.glyphbounds[lk][1] = bounds[1];
            gc.glyphbounds[lk][2] = bounds[2];
            gc.glyphbounds[lk][3] = bounds[3];
            gc.glyphbounds[lk][4] = widths[0];
            gc.glyphbounds[lk][5] = (widths[0] - bounds[2] + bounds[0]) / 2;
            gc.minLineHeight = bounds[3] - bounds[1];
            gc.top = bounds[1];
            gc.bottom = bounds[3];
        }
        font.setSize(size);
        return gc;
    }

    static getFontLineHeight(font) {
        let gc = this._initFontMaxHeight(font);
        return gc.minLineHeight;
    }

    static getFontTopBottom(font) {
        let gc = this._initFontMaxHeight(font);
        return { top: gc.top, bottom: gc.bottom };
    }

    static getGlyphIdsAndBounds(font, str) {
        let size = font.getSize();
        font.setSize(100);
        let f = font;
        let gc = this._initFontMaxHeight(font);
        let returnBounds = new Array(str.length);
        let returnIds = new Uint16Array(str.length);
        let missing = '', missingIndex = [];
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            let id = gc.glyphIds[char];
            if (!id) {
                missing += char;
                missingIndex.push(i);
            } else {
                returnIds[i] = id;
                let bounds = gc.glyphbounds[id];
                returnBounds[i] = bounds;
            }
        }

        if (missing.length != 0) {
            let ids = f.getGlyphIDs(missing);
            let bounds = f.getGlyphBounds(ids);
            let widths = f.getGlyphWidths(ids);
            for (let i = 0; i < missing.length; i++) {
                let id = ids[i];
                let char = missing[i];
                let index = missingIndex[i];
                if (gc.glyphIds[char] != null) {
                    let id = gc.glyphIds[char];
                    returnIds[index] = id;
                    returnBounds[index] = gc.glyphbounds[id];
                } else {
                    gc.glyphIds[char] = id;
                    gc.glyphbounds[id] = new Float32Array(6);
                    gc.glyphbounds[id][0] = bounds[i * 4];
                    gc.glyphbounds[id][1] = bounds[i * 4 + 1];
                    gc.glyphbounds[id][2] = bounds[i * 4 + 2];
                    gc.glyphbounds[id][3] = bounds[i * 4 + 3];
                    gc.glyphbounds[id][4] = widths[i];
                    gc.glyphbounds[id][5] = (widths[i] - bounds[i * 4 + 2] + bounds[i * 4]) / 2;
                    returnIds[index] = id;
                    returnBounds[index] = gc.glyphbounds[id];
                }
            }
        }
        font.setSize(size);
        return { ids: returnIds, bounds: returnBounds };
    }


    static get DEFAULT_FONTS() {
        return DEFAULT_FONTS;
    }

    static currentId;

    static get CanvasKit() { return this[_canvas_kit]; }

    static newID() {
        if (this.currentId == null) {
            this.currentId = 0;//Math.floor(Math.random() * MAX_ID);
        }
        this.currentId += 1;
        if (this.currentId > MAX_ID) {
            this.currentId = 0;
        }
        return this.currentId;
    }

    static initCanvasKit(path) {
        return new Promise((resolve, reject) => {
            CanvasKitInit({
                locateFile: (file) => path + file,
            }).then((CanvasKit) => {
                if (window) window.CanvasKit = CanvasKit;
                this[_canvas_kit] = CanvasKit;
                resolve(CanvasKit);
            });
        });
    }

    static get FontMgr() {
        return this.CanvasKit.FontMgr.RefDefault();
    }

    static loadFont(buffer, descriptors = { family: 'unknown' }) {
        var newFont = this.FontMgr.MakeTypefaceFromData(buffer);
        if (!newFont) return false;
        this.addToFontCache(newFont, descriptors);
        return true;
    }

    static get ClipOp() {
        return CanvasKit.ClipOp;
    }

    static get StrokeCap() {
        return CanvasKit.StrokeCap;
    }

    static get StrokeJoin() {
        return CanvasKit.StrokeJoin;
    }

    static makeCanvasSurface(id) {
        let s;
        try {
            s = CanvasKit.MakeCanvasSurface(id);
        } catch (e) {
            console.warn('Can not create webgl context', e);
            try {
                s = CanvasKit.MakeSWCanvasSurface(id);
            } catch (e) {
                console.error('fail to create canvas surface');
            }
        }
        return s;
    }

    static newPaint() {
        if (CanvasKit) return new CanvasKit.Paint();
    }

    static newPath() {
        if (CanvasKit) return new CanvasKit.Path();
    }

    static get TRANSPARENT() {
        return CanvasKit.TRANSPARENT;
    }

    static get fillStyle() {
        return CanvasKit.PaintStyle.Fill;
    }


    static get strokeStyle() {
        return CanvasKit.PaintStyle.Stroke;
    }

    static newXYWHRect(x, y, w, h, flag = false) {
        return CanvasKit.XYWHRect(x, y, w, h, flag);
    }

    static newRRectXY(rect, radiusx, radiusy, flag = false) {
        return CanvasKit.RRectXY(rect, radiusx, radiusy, flag);
    }

    static getJoinText(j) {
        if (j.value == this.StrokeJoin.Bevel.value) return 'bevel';
        if (j.value == this.StrokeJoin.Round.value) return 'round';
        if (j.value == this.StrokeJoin.Miter.value) return 'miter';
    }

    static getCapText(j) {
        if (j.value == this.StrokeCap.Butt.value) return 'butt';
        if (j.value == this.StrokeCap.Round.value) return 'round';
        if (j.value == this.StrokeCap.Square.value) return 'square';
    }

    static get BlendModeOptions() {
        if (!this._modeOptions) {
            this._modeOptions = new Map();
            let map = this._modeOptions;
            map.set(this.CanvasKit.BlendMode.Clear.value, {
                name: 'Clear', mode: this.CanvasKit.BlendMode.Clear,
            });
            map.set(this.CanvasKit.BlendMode.Src.value, { name: 'Src', mode: this.CanvasKit.BlendMode.Src });
            map.set(this.CanvasKit.BlendMode.Dst.value, { name: 'Dst', mode: this.CanvasKit.BlendMode.Dst });
            map.set(this.CanvasKit.BlendMode.SrcOver.value, {
                name: 'SrcOver', mode: this.CanvasKit.BlendMode.SrcOver,
                description: "This is the default setting and draws new shapes on top of the existing canvas content."
            });
            map.set(this.CanvasKit.BlendMode.DstOver.value, {
                name: 'DstOver', mode: this.CanvasKit.BlendMode.DstOver,
                description: "New shapes are drawn behind the existing canvas content."
            });
            map.set(this.CanvasKit.BlendMode.SrcIn.value, {
                name: 'SrcIn', mode: this.CanvasKit.BlendMode.SrcIn,
                description: "The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent."
            });
            map.set(this.CanvasKit.BlendMode.DstIn.value, { name: 'DstIn', mode: this.CanvasKit.BlendMode.DstIn });
            map.set(this.CanvasKit.BlendMode.SrcOut.value, {
                name: 'SrcOut', mode: this.CanvasKit.BlendMode.SrcOut,
                description: "The new shape is drawn where it doesn't overlap the existing canvas content."
            });
            map.set(this.CanvasKit.BlendMode.DstOut.value, { name: 'DstOut', mode: this.CanvasKit.BlendMode.DstOut });
            map.set(this.CanvasKit.BlendMode.SrcATop.value, {
                name: 'SrcATop', mode: this.CanvasKit.BlendMode.SrcATop,
                description: "The new shape is only drawn where it overlaps the existing canvas content."
            });
            map.set(this.CanvasKit.BlendMode.DstATop.value, { name: 'DstATop', mode: this.CanvasKit.BlendMode.DstATop });
            map.set(this.CanvasKit.BlendMode.Xor.value, { name: 'Xor', mode: this.CanvasKit.BlendMode.Xor });
            map.set(this.CanvasKit.BlendMode.Plus.value, { name: 'Plus', mode: this.CanvasKit.BlendMode.Plus });
            map.set(this.CanvasKit.BlendMode.Modulate.value, { name: 'Modulate', mode: this.CanvasKit.BlendMode.Modulate });
            map.set(this.CanvasKit.BlendMode.Screen.value, { name: 'Screen', mode: this.CanvasKit.BlendMode.Screen });
            map.set(this.CanvasKit.BlendMode.Overlay.value, { name: 'Overlay', mode: this.CanvasKit.BlendMode.Overlay });
            map.set(this.CanvasKit.BlendMode.Darken.value, { name: 'Darken', mode: this.CanvasKit.BlendMode.Darken });
            map.set(this.CanvasKit.BlendMode.Lighten.value, { name: 'Lighten', mode: this.CanvasKit.BlendMode.Lighten });
            map.set(this.CanvasKit.BlendMode.ColorDodge.value, { name: 'ColorDodge', mode: this.CanvasKit.BlendMode.ColorDodge });
            map.set(this.CanvasKit.BlendMode.HardLight.value, { name: 'HardLight', mode: this.CanvasKit.BlendMode.HardLight });
            map.set(this.CanvasKit.BlendMode.SoftLight.value, { name: 'SoftLight', mode: this.CanvasKit.BlendMode.SoftLight });
            map.set(this.CanvasKit.BlendMode.Difference.value, { name: 'Difference', mode: this.CanvasKit.BlendMode.Difference });
            map.set(this.CanvasKit.BlendMode.Exclusion.value, { name: 'Exclusion', mode: this.CanvasKit.BlendMode.Exclusion });
            map.set(this.CanvasKit.BlendMode.Multiply.value, { name: 'Multiply', mode: this.CanvasKit.BlendMode.Multiply });
            map.set(this.CanvasKit.BlendMode.Hue.value, { name: 'Hue', mode: this.CanvasKit.BlendMode.Hue });
            map.set(this.CanvasKit.BlendMode.Saturation.value, { name: 'Saturation', mode: this.CanvasKit.BlendMode.Saturation });
            map.set(this.CanvasKit.BlendMode.Color.value, { name: 'Color', mode: this.CanvasKit.BlendMode.Color });
            map.set(this.CanvasKit.BlendMode.Luminosity.value, { name: 'Luminosity', mode: this.CanvasKit.BlendMode.Luminosity });
        }
        return this._modeOptions;
    }
}


