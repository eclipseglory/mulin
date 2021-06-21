import { Utils, math } from 'figures';
import ScaleTool from './scale-tool.js';

export default class NResizeTool extends ScaleTool {
    constructor(f, n, b) {
        super(f, n, b, 'n-resize');
    }

    get isIllegalData() {
        return this.ey - this.sy == 0;
    }

    getTransformAnchor(feedback) {
        return { x: 0, y: feedback.height }
    }

    processDx() { return 0 }
    processDy(dy) { return -dy };
}