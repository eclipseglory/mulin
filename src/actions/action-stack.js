export default class ActionStack {
    constructor(max = 100) {
        this.max = max;
        this.redos = [];
        this.undos = [];
    }

    excute(action) {
        action.excute();
        if (this.undos.length >= this.max) {
            let a = this.undos.shift();
            a.disposeUndo();
        }
        this.undos.push(action);
        this.redos.forEach(redo => {
            redo.disposeRedo();
        })
        this.redos.length = 0;
    }

    canRedo() {
        return this.redos.length > 0;
    }

    canUndo() {
        return this.undos.length > 0;
    }

    redo() {
        if (this.canRedo()) {
            let action = this.redos.pop();
            action.redo();
            this.undos.push(action);
        }
    }

    undo() {
        if (this.canUndo()) {
            let action = this.undos.pop();
            action.undo();
            this.redos.push(action);
        }
    }
    // 这个dispose后还能继续使用
    dispose() {
        this.undos.forEach(undo => {
            undo.dispose();
        })
        this.undos.length = 0;
        this.redos.forEach(redo => {
            redo.dispose();
        })
        this.redos.length = 0;
    }
}