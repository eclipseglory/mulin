import Tool from "../tool.js";

export default class TranslateTool extends Tool {
    constructor(f, m, b) {
        super(f, m, b, 'move');
        this.startPosition = {};
    }

    prepare(args) {
        if (args) {
            this.currentFeedbacks = args.currentFeedbacks;
            this.transformFeedback = args.transformFeedback;
        }
    }

    toolActived(x, y) {
        super.toolActived(x, y);
        if (this.currentFeedbacks && this.currentFeedbacks.length > 0) {
            let first = this.currentFeedbacks[0];
            this.startPosition = first.worldMatrix.decompose().translation;
        }
    }

    activeMove(x, y, l, t, r, b, dx, dy) {
        super.activeMove(x, y, l, t, r, b);
        if (this.currentFeedbacks && this.transformFeedback) {
            let m = this.transformFeedback.worldMatrix.invert();
            let lp = m.multiplyWithVertexDatas(this.lx, this.ly);
            let p = m.multiplyWithVertexDatas(x, y);
            dx = p[0] - lp[0];
            dy = p[1] - lp[1];
            this.currentFeedbacks.forEach(fb => {
                fb.a = 0.2, fb.ba = 0.8; // TODO : fix this error
                fb.x += dx;
                fb.y += dy;
            });
            this.frontRoot.refresh();
        }
    }

    toolDeactived(x, y, event) {
        super.toolDeactived(x, y);
        let dx = this.ex - this.sx;
        let dy = this.ey - this.sy;
        if (dx == 0 && dy == 0) return;

        // 这里默认移动元素都是mainroot的子节点
        if (event.altKey) {
            let cloneFigures = [];
            this.currentSelections.forEach(s => {
                let sc = s.clone();
                sc.x += dx / this.mainRoot.scalex;
                sc.y += dy / this.mainRoot.scaley;
                cloneFigures.push(sc);
            });
            return { type: 'new', figures: cloneFigures }
        } else {
            let figures = [];
            this.currentSelections.forEach(s => figures.push(s));
            return {
                type: 'move',
                figures: figures, dx: dx / this.mainRoot.scalex,
                dy: dy / this.mainRoot.scaley
            };
        }
    }
}