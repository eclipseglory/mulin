import VerticesShape from "./vertices-shape.js";

export default class PathShape extends VerticesShape {
    constructor(props) {
        super(props)
        this.close = props == null || props.close == null ? false : props.close;
    }

    _createPathModel() {
        return super._createPathModel(this.close);
    }

    createMySelf() {
        return new PathShape({ close: this.close });
    }

    clone() {
        let me = super.clone();
        if (me) {
            let p = me.getPathModel();
            if (this.close) p.close(); else p.open()
            return me;
        }
    }


    get width() {
        return this._width;
    }

    set width(h) { }

    get height() {
        return this._height;
    }

    set height(h) { }

    get isVisible() {
        return this.visible && this.scalex != 0 && this.scaley != 0;
    }

    get close() { return this._close }
    set close(c) {
        if (this._close != c) {
            this._close = c;
            if (this._close) this.getPathModel().close();
            else this.getPathModel().open();
            this.fireShapeDirty();
        }
    }

    getJsonObjectName() { return 'path-shape' }

    async toJsonObject() {
        let obj = await super.toJsonObject();
        delete obj.width;
        delete obj.height;
        obj.close = this.close;
        obj.pathSvg = this.getTarget().getPath().toSVGString();
        obj.points = [];
        let pathModel = this.getPathModel();
        pathModel.points.forEach(p => {
            let pp = { x: p.x, y: p.y, type: p.type };
            if (p.in) {
                pp.in = { x: p.inX, y: p.inY };
            }
            if (p.out) {
                pp.out = { x: p.outX, y: p.outY };
            }
            obj.points.push(pp);
        })
        return obj;
    }
}