import Tool from "./tool.js";

export default class TranslateRootTool extends Tool {
    constructor(f, m, b) {
        super(f, m, b, 'move-root');
    }


    activeMove(x, y, l, t, r, b, dx, dy) {
        if (this.mainRoot) {
            // let m = this.mainRoot.worldMatrix.clone().invert();
            // let p1 = m.multiplyWithVertexDatas(x, y);
            // let p2 = m.multiplyWithVertexDatas(this.lx, this.ly);
            // let dx1 = p1[0] - p2[0];
            // let dy1 = p1[1] - p2[1];
            // console.log(dx, dy, dx1, dy1, dx / this.mainRoot.scalex);
            this.mainRoot.x += dx / this.mainRoot.scalex;
            this.mainRoot.y += dy / this.mainRoot.scaley;
            this.mainRoot.refresh();
        }
    }
}