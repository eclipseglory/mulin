import { RootFigure, CanvasKitUtils } from "figures";

const MAX_SIZE = 16382;

export default class DocumentRoot extends RootFigure {
    constructor(surface, width, height, props) {
        super(surface, props);
        this.screanWidth = width;
        this.screanHeight = height;
        this.zoom = props == null || props.zoom == null ? 1 : props.zoom;
        this.padding = 50;
    }


    init() {
        let screanWidth = this.screanWidth;
        let screanHeight = this.screanHeight;
        let disW = this.width + this.padding * 2;
        let disH = this.height + this.padding * 2;
        let zx = disW > screanWidth ? screanWidth / disW : 1;
        let zy = disH > screanHeight ? screanHeight / disH : 1;
        let z = Math.min(zy, zx);
        if (z < 1) {
            z = Math.max(z, 0.25);
            this.zoom = z;
        } else {
            let minW = screanWidth * 0.5 + this.padding * 2;
            let minH = screanHeight * 0.5 + this.padding * 2;
            zy = disH < minH ? minH / this.width : 1;
            zx = disW < minW ? minW / this.height : 1;
            let z1 = Math.min(zy, zx);
            z1 = Math.min(z1, 5);
            this.zoom = z1;
        }
        this.placeAtCenter();
    }

    placeAtCenter() {
        let screanWidth = this.screanWidth;
        let screanHeight = this.screanHeight;
        let cw = this.width * this.zoom;
        let ch = this.height * this.zoom;
        let dw = (screanWidth - cw) / 2;
        let dh = (screanHeight - ch) / 2;
        this.x = dw;
        this.y = dh;
    }


    get zoom() { return this._zoom }
    set zoom(z) {
        this._zoom = z;
        this.scalex = z;
        this.scaley = z;
    }

    configPath(path) {
        path.addRect(CanvasKitUtils.newXYWHRect(0, 0, this.width, this.height));
    }

    calculateLocalBounds(b = { left: 0, top: 0, right: 0, bottom: 0 }) {
        b.left = -(MAX_SIZE - this.width) / 2;
        b.top = -(MAX_SIZE - this.height) / 2;
        b.right = b.left + MAX_SIZE;
        b.bottom = b.top + MAX_SIZE;
        return b;
    }


    getDocPath() {
        if (this._path == null) {
            this._path = CanvasKitUtils.newPath();
            this.configPath(this._path);
        }
        return this._path;
    }

    getPaint() {
        if (this._paint == null) {
            this._paint = CanvasKitUtils.newPaint();
        }
        return this._paint;
    }


    drawSelf(canvas) {
        super.drawSelf(canvas);
        let path = this.getDocPath();
        let paint = this.getPaint();
        paint.setColorComponents(1, 1, 1, 1);
        paint.setStyle(CanvasKitUtils.fillStyle);
        canvas.drawPath(path, paint);


        paint.setColorComponents(0, 0, 0, 1);
        paint.setStyle(CanvasKitUtils.strokeStyle);
        canvas.drawPath(path, paint);
    }

    deletePath() {
        if (this._path) {
            this.getTarget()._path.delete();
            this._path = null;
        }
    }

    dispose() {
        if (this.isDisposed) return;
        this.deletePath();
        let p = this.getTarget()._paint;
        if (p) p.delete();
        this._paint = null;
        super.dispose();
    }

    async toJsonObject() {
        let json = await super.toJsonObject();
        json.zoom = this.zoom;
        json.padding = this.padding;
        json.type = 'document'
        return json;
    }
}