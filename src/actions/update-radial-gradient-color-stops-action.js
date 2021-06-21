import UpdateLinearGradientColorStopsAction from "./update-linear-gradient-color-stops-action";

export default class UpdateRadialGradientColorStopsAction extends UpdateLinearGradientColorStopsAction {
    constructor(model, colorstops, pk = 'radicalGradient') {
        super(model, colorstops, pk);
    }
}