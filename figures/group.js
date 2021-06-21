import CanvasKitUtils from "./canvaskit-utils.js";
import Figure from "./figure.js";
// TODO #10 : bug:Group中的图形修改后Group的bounds不会修改
export default class Group extends Figure {
    constructor(props) {
        super(props);
        this._dontApplyToChildren = false;
    }

    get showBorder() {
        return this._getAnyPropertyValue('showBorder', true);
    }

    set showBorder(s) {
        this._setAllChildren('showBorder', s);
    }

    get borderWidth() {
        return this._getAnyPropertyValue('borderWidth', 0);
    }

    set borderWidth(s) {
        this._setAllChildren('borderWidth', s);
    }

    get miter() {
        return this._getAnyPropertyValue('miter', 0);
    }

    set miter(s) {
        this._setAllChildren('miter', s);
    }

    get join() {
        return this._getAnyPropertyValue('join', CanvasKitUtils.StrokeJoin.Bevel);
    }

    set join(s) {
        this._setAllChildren('join', s);
    }


    get cap() {
        return this._getAnyPropertyValue('cap', CanvasKitUtils.StrokeCap.Butt);
    }

    set cap(s) {
        this._setAllChildren('cap', s);
    }

    get br() {
        return this._getAnyPropertyValue('br', 0);
    }

    set br(v) {
        this._setAllChildren('br', v);
    }

    get bb() {
        return this._getAnyPropertyValue('bb', 0);
    }

    set bb(v) {
        this._setAllChildren('bb', v);
    }

    get bg() {
        return this._getAnyPropertyValue('bg', 0);
    }

    set bg(v) {
        this._setAllChildren('bg', v);
    }

    get ba() {
        return this._getAnyPropertyValue('ba', 1);
    }

    set ba(v) {
        this._setAllChildren('ba', v);
    }


    get fill() {
        return this._getAnyPropertyValue('fill', true);
    }

    set fill(v) {
        this._setAllChildren('fill', v);
    }

    get r() {
        return this._getAnyPropertyValue('r', 0);
    }

    set r(v) {
        this._setAllChildren('r', v);
    }

    get b() {
        return this._getAnyPropertyValue('b', 0);
    }

    set b(v) {
        this._setAllChildren('b', v);
    }

    get g() {
        return this._getAnyPropertyValue('g', 0);
    }

    set g(v) {
        this._setAllChildren('g', v);
    }

    get a() {
        return this._getAnyPropertyValue('a', 1);
    }

    set a(v) {
        this._setAllChildren('a', v);
    }

    _getAnyPropertyValue(property, defaultValue) {
        if (this.children.length == 0) return defaultValue;
        let v = this.children[0][property];
        for (let index = 1; index < this.children.length; index++) {
            const child = this.children[index];
            if (child[property] != v) return defaultValue;
        }
        return v;
    }

    _setAllChildren(property, value) {
        if (this._dontApplyToChildren) return;
        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            child[property] = value;
        }
    }

    getPath() {
        if (!this._path) {
            this.getTarget()._path = CanvasKitUtils.newPath();
            this.children.forEach(child => {
                if (child.getPath) {
                    let cp = child.getTarget().getPath().copy();
                    cp.transform(child.matrix.data);
                    this.getTarget()._path.addPath(cp);
                }
            })
        }
        return this._path;
    }

    insertChild(child, index) {
        let r = super.insertChild(child, index);
        if (r) {
            this.deletePath();
            child.on('transformDirty', this._childDirty)
            child.on('boundsDirty', this._childDirty)
        }
        return r;
    }

    _childDirty = () => {
        this.deletePath();
    }

    removeAt(index) {
        let c = super.removeAt(index);
        if (c) {
            this.deletePath();
            c.off('transformDirty', this._childDirty)
            c.off('boundsDirty', this._childDirty)
        }
        return c;
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
        this.children.forEach(c => {
            c.off('transformDirty', this._childDirty)
            c.off('boundsDirty', this._childDirty)
        })
        super.dispose();
    }

    clone() {
        this._dontApplyToChildren = true;
        let c = super.clone();
        this._dontApplyToChildren = false;
        return c;
    }

    createMySelf() {
        return new Group();
    }

    getJsonObjectName(){return 'group'}

    async toJsonObject() {
        let obj = await super.toJsonObject();
        delete obj.alpha;
        delete obj.a;
        delete obj.r;
        delete obj.g;
        delete obj.b;
        return obj;
    }

    getSVGLabelName() {
        return 'g';
    }

    getSVGDimensionString() { }
}