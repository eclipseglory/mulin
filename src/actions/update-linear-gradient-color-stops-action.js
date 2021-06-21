import Action from "./action";

export default class UpdateLinearGradientColorStopsAction extends Action {
    constructor(model, colorstops, pk = "linearGradient") {
        super('Update gradient');
        this.model = model;
        this.pk = pk;
        this.colorStops = colorstops;
        this.old = [];
        let gradient = this.getGrarident();
        gradient.colorStops.forEach(stop => this.old.push(stop.clone()));
    }

    getGrarident() {
        return this.model[this.pk];
    }

    excute() {
        let gradient = this.getGrarident();
        gradient.replaceColorStops(this.colorStops);
    }

    redo() {
        this.excute();
    }

    undo() {
        let gradient = this.getGrarident();
        gradient.replaceColorStops(this.old);
    }
}