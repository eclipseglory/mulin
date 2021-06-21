import { Text } from "figures";

export default class TextFeedbackFigure extends Text {
    constructor(props) {
        super(props);
        this.relatedSelection;
        this.relateFigure;
    }

    fireShapeDirty() { }

    copyGlyphs(target) {
        this.deleteGlyphsMap();
        this.size = target.size;
        this.fontFamily = target.fontFamily;
        this.height = target.height;
        this.width = target.width;
        let gm = target.getTarget().getGlyphsMap();
        this.glyphsArray = []
        gm.forEach(g => {
            let ids = new Uint16Array(g.ids.length);
            for (let i = 0; i < ids.length; i++) {
                ids[i] = g.ids[i];
            }
            let positions = new Float32Array(g.positions.length)
            for (let i = 0; i < positions.length; i++) {
                positions[i] = g.positions[i];
            }
            this.glyphsArray.push({ ids, positions });
        })
    }

    isVisible() {
        return this.visible && (this.scalex != 0 || this.scaley != 0);
    }
}