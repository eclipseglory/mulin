import ScaleTool from "./scale-tool.js";

export default class NWResizeTool extends ScaleTool {
    constructor(f, m, b) {
        super(f, m, b, 'nw-resize');
    }

    getTransformAnchor(feedback) {
        return { x: feedback.width, y: feedback.height };
    }
    processDx(dx) { return -dx };
    processDy(dy) { return -dy };
}