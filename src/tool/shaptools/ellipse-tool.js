import { shape } from "figures";
import ShapeTool from "./shape-tool.js";

export default class EllipseTool extends ShapeTool {
    constructor(fr, mr, br, id = 'ellipse') {
        super(fr, mr, br, id);
    }

    createShape(x, y) {
        return new shape.CenterEllipse({ name: 'Ellipse' });
    }
}