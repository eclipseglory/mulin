import Action from "./action.js";

export default class CompositeAction extends Action {
    constructor(name = "Composite Actions") {
        super(name)
        this.actions = [];
    }

    get isEmpty() {
        return this.actions.length == 0
    }

    add(action) {
        if (!action) return;
        this.actions.push(action);
    }

    remove(action) {
        if (!action) return;
        let index = this.actions.indexOf(action);
        if (index != -1) {
            this.actions.splice(index, 1);
        }
    }

    excute() {
        this.actions.forEach((action) => {
            action.excute();
        })
    }

    redo() {
        this.excute();
    }

    undo() {
        for (let i = this.actions.length - 1; i >= 0; i--) {
            let a = this.actions[i];
            a.undo();
        }
    }

    // TODO: Composite action是一组action，很有可能dispose的时候误删一些数据，怎么处理？
    disposeRedo() {
        // this.actions.forEach(action => {
        //     action.disposeRedo();
        // })
    }

    disposeUndo() {
        // this.actions.forEach(action => {
        //     action.diposeUndo();
        // })
    }

    dispose() {
        this.actions.forEach(action => {
            action.dispose();
        })
    }
}