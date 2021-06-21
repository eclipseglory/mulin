import PathShape from "./path-shape"
export default class Line extends PathShape {
    constructor(props) {
        super(props);
    }

    set close(s) { }
    get close() { return false }

    isVisible() {
        return this.visible;
    }

    get showBorder() { return true };
    set showBorder(b) { }

    get fill() { return false; }
    set fill(f) { }


    getJsonObjectName() { return 'line' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        delete obj.width;
        delete obj.height;
        delete obj.fill;
        delete obj.close;
        delete obj.points;
        delete obj.a;
        delete obj.r;
        delete obj.b;
        delete obj.g;
        let p1 = this.getPathModel().getPoint(0);
        let p2 = this.getPathModel().getPoint(1);
        if (p1)
            obj.from = { x: p1.x, y: p1.y }
        if (p2)
            obj.to = { x: p2.x, y: p2.y }
        return obj;
    }

    getSVGLabelName() { return 'line' }

    getSVGPositionString() {
        let p1 = this.getPathModel().getPoint(0);
        let p2 = this.getPathModel().getPoint(1);
        return `x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"`
    }

    getSVGDimensionString() { }
}