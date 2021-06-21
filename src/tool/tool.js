import { EventEmitter, Text, Utils as u } from "figures";
import Utils from "../utils.js";
import FeedbackFigure from "../figure/feedback-figure.js";
import TextFeedbackFigure from "../figure/text-feedback-figure.js";

export default class Tool extends EventEmitter {
    constructor(frontRoot, mainRoot, backendRoot, id) {
        super();
        this.frontRoot = frontRoot;
        this.mainRoot = mainRoot;
        this.backendRoot = backendRoot;
        this.id = id;
        this.actived = false;
        this.using = false;
        this.currentFeedbacks;
    }

    set currentSelections(selections) {
        this._selections = selections;
    }

    get currentSelections() { return this._selections };

    get defaultCursor() {
        let c = Utils.CURSOR[this.id];
        if (c) return c;
        return 'default';
    }

    toolTipUpdate(msg) {
        this.fireEvent('updateTooltip', { tooltip: msg });
    }

    updateCurrentSelections(selections) {
        this.currentSelections = selections;
    }

    addNewFigure(figure, name = '图形') {
        this.fireEvent('addFigure', { figure, name });
    }

    changeCursor(cursor) {
        this.fireEvent('cursorChange', { cursor });
    }

    switchTool(toolId, x, y, args) {
        this.fireEvent('toolSwitch', { id: toolId, x, y, args });
    }

    fireSelectionChangeEvent(selections, type = 'new') {
        this.fireEvent('selectionChange', { type: type, selections: selections });
    }

    prepare(args) {
        this.using = true;
    }

    unUse(args) {
        this.using = false;
        cancelAnimationFrame(this._moveRefreshId);
        this._moveRefreshId = null;
    }

    active(x, y, event) {
        if (event) event.preventDefault(); // 阻止其他事件发生
        // if (this.actived) return; 这里不知道为什么，actived属性有时候会是false
        if (this._moveRefreshId)
            cancelAnimationFrame(this._moveRefreshId);
        this.sx = x;
        this.sy = y;
        this.lx = x;
        this.ly = y;
        this.actived = true;
        this.fireEvent('active', { id: this.id, x, y });
        this.toolActived(x, y, event);
    }

    move(x, y, event) {
        if (this._moveRefreshId) {
            cancelAnimationFrame(this._moveRefreshId);
        }
        this._moveRefreshId = requestAnimationFrame(() => {
            let tooltip;
            if (this.actived) {
                let dx = x - this.lx;
                let dy = y - this.ly;
                let l = Math.min(x, this.sx);
                let t = Math.min(y, this.sy);
                let r = Math.max(x, this.sx);
                let b = Math.max(y, this.sy);
                tooltip = this.activeMove(x, y, l, t, r, b, dx, dy, event);
                this.lx = x;
                this.ly = y;
            } else {
                tooltip = this.hoverMove(x, y, event);
            }
            if (!tooltip) tooltip = `x:${x},y:${y}`;
            this.toolTipUpdate(tooltip);
        })
    }

    activeMove(x, y, l, t, r, b, dx, dy, event) {
    }

    hoverMove(x, y, event) {
    }

    deactive(x, y, event) {
        if (!this.actived) return;
        if (this._moveRefreshId)
            cancelAnimationFrame(this._moveRefreshId);
        this.ex = x;
        this.ey = y;
        try {
            let result = this.toolDeactived(x, y, event);
            this.fireEvent('complete', { id: this.id, result });
        } catch (e) {
            console.error(e);
        } finally {
            this.reset();
        }
    }

    reset() {
        this.actived = false;
        cancelAnimationFrame(this._moveRefreshId);
        this._moveRefreshId = null;
        this.sx = this.sy = this.ex = this.ey = this.lx = this.ly = null;
    }

    toolActived(x, y, event) { }

    toolDeactived(x, y, event) { }

    static createDelegateFigure(target, copyPose = true) {
        let f;
        if (target instanceof Text) {
            f = new TextFeedbackFigure();
            f.copyGlyphs(target);
        } else {
            f = new FeedbackFigure();
            f.copyPath(target);
            if (target.borderWidth != null) {
                f.borderWidth = target.borderWidth;
            }
        }

        f.relatedSelection = target;
        this.setFeedbackColors(f);
        if (copyPose) {
            let m = target.worldMatrix;
            let pose = m.decompose();
            u.applyPose(f, pose);
        }
        return f;
    }

    static setFeedbackColors(f) {
        f.br = this.FEEDBACK_B_COLOR[0];
        f.bg = this.FEEDBACK_B_COLOR[1];
        f.bb = this.FEEDBACK_B_COLOR[2];
        f.ba = 0.8;

        f.r = this.FEEDBACK_COLOR[0];
        f.g = this.FEEDBACK_COLOR[1];
        f.b = this.FEEDBACK_COLOR[2];
        f.a = 0.5;
    }


    static setErrorColors(f) {
        f.showBorder = false;
        f.r = 255;
        f.g = 0;
        f.b = 0;
        f.a = 1;
    }

    static copyPoseDatas(from, to) {
        if (!from || !to) return;
        to.x = from.x;
        to.y = from.y;
        to.scalex = from.scalex;
        to.scaley = from.scaley;
        to.skewx = from.skewx;
        to.skewy = from.skewy;
        to.rotation = from.rotation;
        to.width = from.width;
        to.height = from.height;
    }

    static get FEEDBACK_COLOR() {
        return FB_COLOR;
    }

    static get FEEDBACK_B_COLOR() {
        return FB_B_COLOR;
    }
}

const FB_COLOR = [9, 124, 244];
const FB_B_COLOR = [14, 98, 234];