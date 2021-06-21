import ShapeTool from "./shape-tool.js";
import { shape } from "figures";

export default class PolygonTool extends ShapeTool {
    constructor(fr, mr, br, id = 'polygon') {
        super(fr, mr, br, id);
    }

    createShape(x, y) {
        return new shape.CenterPolygon({ name: 'Polygon' });
    }
}