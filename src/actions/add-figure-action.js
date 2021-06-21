import Action from "./action.js";

export default class AddFigureAction extends Action {
    constructor(child, parent, name = '添加图形') {
        super(name);
        this.child = child;
        this.parent = parent;
    }

    excute() {
        if (this.index != null) {
            this.parent.insertChild(this.child, this.index);
        } else
            this.parent.addChild(this.child);
    }

    redo() {
        this.excute();
    }

    undo() {
        this.index = this.parent.children.indexOf(this.child);
        this.parent.removeChild(this.child);
    }

    dispose() {
        if (this.parent)
            this.parent.dispose();
        if (this.child)
            this.child.dispose();
        this.parent = null;
        this.child = null;
    }

    disposeRedo() {
        if (this.child)
            this.child.dispose();
        this.child = null;
    }

    disposeUndo() {

    }
}