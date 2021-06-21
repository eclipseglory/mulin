import { shape } from "figures";
import ShapeTool from "./shape-tool.js";

export default class RectTool extends ShapeTool {
    constructor(fr, mr, br, id = 'rect') {
        super(fr, mr, br, id);
    }
    createShape(x, y) {
        return new shape.CenterRect({ name: 'Rectangle' });
    }
}