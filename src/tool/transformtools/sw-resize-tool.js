import ScaleTool from "./scale-tool.js";

export default class SWResizeTool extends ScaleTool {
    constructor(f, m, b) {
        super(f, m, b, 'sw-resize');
    }

    getTransformAnchor(feedback) {
        return { x: feedback.width, y: 0 };
    }

    processDx(dx) {
        return -dx;
    }
}