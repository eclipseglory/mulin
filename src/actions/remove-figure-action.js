import Action from "./action.js";

export default class RemoveFigureAction extends Action {
    constructor(child, parent, name = '删除图形') {
        super(name);
        this.child = child;
        this.parent = parent;
    }

    excute() {
        this.index = this.parent.children.indexOf(this.child);
        this.parent.removeChild(this.child);
    }

    redo() {
        this.excute();
    }

    undo() {
        this.parent.insertChild(this.child, this.index);
    }

    dispose() {
        if (this.parent) {
            this.parent.dispose();
        }
        this.parent = null;
        if (this.figure) {
            this.figure.dispose();
        }
        this.figure = null;
    }

    disposeUndo() {
        if (this.figure) {
            this.figure.dispose();
        }
        this.figure = null;
    }
}