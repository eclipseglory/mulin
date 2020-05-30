import Drawable from "./drawable.js";

export default class Group extends Drawable {
    constructor(props = { anchorX: 0, anchorY: 0 }) {
        super(props);
    }
}