export default class Action {
    constructor(name) {
        this.name = name;
    }

    excute() { }
    redo() { }
    undo() { }
    disposeRedo() { }
    disposeUndo() { }
    dispose() { }
}