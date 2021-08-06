export default class Animation {
    constructor(id, duration = 1000, timingFunction = [0, 0, 0, 0]) {
        this.id = id;
        this.timingFunction = timingFunction;
        this.duration = duration;
    }

    addKeyFrame(keyFrame = { time: 0, model: null, property: null, value: null, timingFunction=[0, 0, 0, 0] }) {

    }

    runAt(time) {
        
    }
}

class KeyFrame {
    constructor(time) {
        this.map = new Map();
    }
    addChange(model, property, endValue) {
        let record = this.map.get(model);
        if (!record) {
            record = {};
            this.map.set(model, record);
        }
        record.get(property)
    }
}