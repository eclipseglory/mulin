import { Matrix3 } from "figures/math";
import ScaleTool from "./scale-tool.js";

export default class SEResizeTool extends ScaleTool {
    constructor(f, m, b) {
        super(f, m, b, 'se-resize');
    }
}