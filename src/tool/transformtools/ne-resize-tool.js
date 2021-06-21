import ScaleTool from "./scale-tool.js";

export default class NEResizeTool extends ScaleTool {
    constructor(f, m, b) {
        super(f, m, b, 'ne-resize');
    }
    getTransformAnchor(feedback) {
        return { x: 0, y: feedback.height };
    }
    processDy(dy) { return -dy };
}