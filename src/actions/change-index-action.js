import Action from "./action.js"
export default class ChangeIndexAction extends Action {
    constructor(figure, index) {
        super('Change Index');
        this.figure = figure;
        this.index = index;
        this.oldIndex = this.figure.parent.indexOfChild(this.figure);
    }

    excute() {
        let parent = this.figure.parent;
        parent.removeChild(this.figure);
        parent.insertChild(this.figure, this.index);
    }

    redo() { this.excute() }

    undo() {
        let parent = this.figure.parent;
        parent.removeChild(this.figure);
        parent.insertChild(this.figure, this.oldIndex);
    }

    dispose() {
        if (this.figure) this.figure.dispose();
        this.figure = null;
    }
}