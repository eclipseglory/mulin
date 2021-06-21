import ActionFactory from "../actions/action-factory.js";
import { Figure } from "figures";

export default {
    methods: {
        bringFront() {
            if (!this.selections || !this.actionStack) return;
            let s = this.selections[0];
            let index = this.document.indexOfChild(s);
            index += 1;
            let action = ActionFactory.newChangeIndexAction(s, index);
            this.excuteAction(action);
        },
        sendBack() {
            if (!this.selections || !this.actionStack) return;
            let s = this.selections[0];
            let index = this.document.indexOfChild(s);
            index -= 1;
            let action = ActionFactory.newChangeIndexAction(s, index);
            this.excuteAction(action);
        },
    },
    computed: {
        canBringFront() {
            if (this.selections && this.selections.length == 1
                && this.actionStack != null) {
                let s = this.selections[0];
                if (s instanceof Figure) {
                    if (
                        this.document.children[this.document.children.length - 1] != s
                    )
                        return true;
                }
            }
            return false;
        },
        canSendBack() {
            if (this.selections && this.selections.length == 1
                && this.actionStack != null) {
                let s = this.selections[0];
                if (s instanceof Figure) {
                    let t = this.document.children[0] == s;
                    if (this.document.children[0] != s) return true;
                }
            }
            return false;
        },
    }
}
