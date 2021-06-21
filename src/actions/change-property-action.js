import Action from "./action.js";

export default class ChangePropertyAction extends Action {
    constructor(model, property, value) {
        super('更改属性值')
        this.model = model;
        this.property = property;
        this.value = value;
    }

    excute() {
        if (this.oldValue == undefined) {
            this.oldValue = this.model[this.property];
        }
        this.model[this.property] = this.value;
    }

    redo() {
        this.excute();
    }

    undo() {
        this.model[this.property] = this.oldValue;
    }


    dispose() {
        if (this.model && this.model.dispose) {
            this.model.dispose();
        }
        this.model = null;
    }

    disposeRedo() {
    }

    disposeUndo() {
    }
}