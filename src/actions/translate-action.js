import Action from "./action.js";

export default class TranslateAction extends Action {
    constructor(figure, dx, dy, name = '移动图形') {
        super(name);
        this.figure = figure;
        this.dx = dx;
        this.dy = dy;
    }

    excute() {
        let f = this.figure;
        f.x += this.dx;
        f.y += this.dy;

    }

    redo() {
        this.excute();
    }

    undo() {
        let f = this.figure;
        f.x -= this.dx;
        f.y -= this.dy;
    }

    dispose() {
        if (this.figure) {
            this.figure.dispose();
        }
        this.figure = null;
    }
}