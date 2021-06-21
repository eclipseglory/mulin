import Action from "./action.js";
export default class InsertPointAction extends Action {
    constructor(point, path, index, name = '添加顶点') {
        super(name);
        this.point = point;
        this.path = path;
        this.index = index;
    }

    excute() {
        this.path.insertPoint(this.point, this.index);
    }

    redo() {
        this.path.insertPoint(this.point.clone(), this.index);
    }

    undo() {
        this.path.deleteAt(this.index);
    }

    dispose() {
        if (this.path) {
            this.path.dispose();
        }
        this.path = null;
        this.point = null;
    }
}