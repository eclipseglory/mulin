import Action from "./action.js";

export default class PoseChangeAction extends Action {
    constructor(figure, pose) {
        super('姿势更改');
        this.pose = pose;
        this.figure = figure;
        this.old = {
            x: figure.x,
            y: figure.y,
            rotation: figure.rotation,
            scalex: figure.scalex,
            scaley: figure.scaley,
            skewx: figure.skewx,
            skewy: figure.skewy
        }
    }

    excute() {
        this.figure.x = this.pose.translation.x;
        this.figure.y = this.pose.translation.y;
        this.figure.rotation = this.pose.rotation;
        this.figure.scalex = this.pose.scale.x;
        this.figure.scaley = this.pose.scale.y;
        this.figure.skewx = this.pose.skew.x;
        this.figure.skewy = this.pose.skew.y;
    }

    redo() {
        this.excute();
    }

    undo() {
        this.figure.x = this.old.x;
        this.figure.y = this.old.y;
        this.figure.rotation = this.old.rotation;
        this.figure.scalex = this.old.scalex;
        this.figure.scaley = this.old.scaley;
        this.figure.skewx = this.old.skewx;
        this.figure.skewy = this.old.skewy;
    }

    dispose() {
        if (this.figure) {
            this.figure.dispose();
        }
        this.figure = null;
    }
}