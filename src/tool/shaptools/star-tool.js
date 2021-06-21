import { shape } from "figures";
import ShapeTool from "./shape-tool.js";

export default class StarTool extends ShapeTool {
    constructor(f, m, b, id = 'star') {
        super(f, m, b, id);
    }
    createShape() {
        return new shape.CenterStar({ name: 'Star' });
    }
}