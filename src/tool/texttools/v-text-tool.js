import TextTool from "./text-tool";

export default class VTextTool extends TextTool {
    constructor(f, m, b, id = "v-text") {
        super(f, m, b, id);
    }

    createNewText(value, x, y) {
        let text = super.createNewText(value, x, y);
        text.vertical = true;
        return text;
    }
}