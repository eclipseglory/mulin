import Action from "./action.js";
export default class DeletePointAction extends Action {
    constructor(path, index, name = '删除顶点') {
        super(name);
        this.path = path;
        this.index = index;
    }

    excute() {
        this.point = this.path.deleteAt(this.index);
    }

    undo() {
        this.path.insertPoint(this.point.clone(), this.index);
    }

    redo() {
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