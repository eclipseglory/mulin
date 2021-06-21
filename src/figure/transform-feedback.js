import { shape, CanvasKitUtils } from 'figures';
import ResizeAnchor from "./resize-anchor.js";
import RotateAnchor from "./rotate-anchor";
import NoboundsRect from "./nobounds-rect";
import Tool from "../tool/tool";

export default class TransformFeedback extends shape.Rect {
    constructor(props) {
        super(props);
        this.anchorSize = props == null || props.as == null ? 6 : props.as;
        this.padding = props == null || props.padding == null ? 5 : props.padding;
        this.feedbackContainer = new NoboundsRect({ a: 0, showBorder: false });
        this.addChild(this.feedbackContainer);

        this.rotateAnchor = new RotateAnchor({
            width: this.anchorSize, height: this.anchorSize,
            r: 22, g: 199, b: 154
        });
        this.addChild(this.rotateAnchor);

        this.topAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.topAnchor);
        this.bottomAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.bottomAnchor);
        this.leftAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.leftAnchor);
        this.rightAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.rightAnchor);
        this.seAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.seAnchor);
        this.neAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.neAnchor);
        this.swAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.swAnchor);
        this.nwAnchor = new ResizeAnchor({ width: this.anchorSize, height: this.anchorSize });
        this.addChild(this.nwAnchor);

        this.anchor = { x: 0.5, y: 0.5 };

        let bcolor = Tool.FEEDBACK_B_COLOR;
        this.br = bcolor[0]; this.bg = bcolor[1]; this.bb = bcolor[2];
        this.a = 0;
    }

    initFeedbackContainer() {
        if (!this.feedbackContainer) return;
        this.feedbackContainer.width = this.width;
        this.feedbackContainer.height = this.height;
        this.feedbackContainer.rotation = 0;
        this.feedbackContainer.scalex = this.feedbackContainer.scaley = 1;
        this.feedbackContainer.skewx = this.feedbackContainer.skewy = 0;
    }

    addFeedback(figure) {
        this.feedbackContainer.addChild(figure);
    }

    removeFeedback(figure) {
        this.feedbackContainer.removeChild(figure);
    }

    updateAnchorsPostion() {
        if (this.topAnchor) {
            this.topAnchor.y = - this.padding;
            this.topAnchor.x = this.width / 2;
        }
        if (this.bottomAnchor) {
            this.bottomAnchor.y = this.height + this.padding;
            this.bottomAnchor.x = this.width / 2;
        }
        if (this.leftAnchor) {
            this.leftAnchor.y = this.height / 2;
            this.leftAnchor.x = - this.padding;
        }
        if (this.rightAnchor) {
            this.rightAnchor.y = this.height / 2;
            this.rightAnchor.x = this.width + this.padding;
        }
        if (this.seAnchor) {
            this.seAnchor.y = this.height + this.padding;
            this.seAnchor.x = this.width + this.padding;
        }
        if (this.neAnchor) {
            this.neAnchor.y = -this.padding;
            this.neAnchor.x = this.width + this.padding;
        }
        if (this.swAnchor) {
            this.swAnchor.y = this.height + this.padding;
            this.swAnchor.x = - this.padding;
        }

        if (this.nwAnchor) {
            this.nwAnchor.y = -this.padding;
            this.nwAnchor.x = -this.padding;
        }

        if (this.rotateAnchor) {
            this.rotateAnchor.y = - this.padding - this.rotateAnchor.width * 2;
            this.rotateAnchor.x = this.width + this.padding + this.rotateAnchor.height * 2;
        }

        if (this.feedbackContainer) {
            let w = this.feedbackContainer.width;
            let h = this.feedbackContainer.height;
            if (this.width == 0) this.feedbackContainer.scalex = 0;
            if (this.height == 0) this.feedbackContainer.scaley = 0;
            if (w != 0) this.feedbackContainer.scalex = this.width / w;
            if (h != 0) this.feedbackContainer.scaley = this.height / h;
        }
    }

    get width() { return super.width }
    set width(w) {
        if (w != super.width) {
            super.width = w;
            this.updateAnchorsPostion();
        }
    }

    get height() { return super.height }
    set height(h) {
        if (h != super.height) {
            super.height = h;
            this.updateAnchorsPostion();
        }
    }

    calculateLocalBounds(b = { left, top, right, bottom }) {
        b.left = -this.padding - this.anchorSize / 2 - this.anchorSize;
        b.top = -this.padding - this.anchorSize / 2 - this.anchorSize * 3;
        b.right = this.width + this.padding + this.anchorSize / 2 + this.anchorSize * 3;
        b.bottom = this.height + this.padding + this.anchorSize / 2 + this.anchorSize;
        return b;
    }

    drawPath(path) {
        let p = this.padding;
        path.addRect(CanvasKitUtils.newXYWHRect(-p, -p, this.width + p * 2, this.height + p * 2));
    }

    drawSelf(canvas) {
        super.drawSelf(canvas);
        this._paint.setStyle(CanvasKitUtils.strokeStyle);

        let x1 = this.width / 2;
        let x2 = x1;
        let y1 = this.height / 2 - this.anchorSize;
        let y2 = y1 + this.anchorSize * 2;
        canvas.drawLine(x1, y1, x2, y2, this._paint);

        x1 = this.width / 2 - this.anchorSize;
        x2 = x1 + this.anchorSize * 2;
        y1 = this.height / 2;
        y2 = y1;
        canvas.drawLine(x1, y1, x2, y2, this._paint);
    }

}