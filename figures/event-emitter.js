export default class EventEmitter {
    constructor() { }

    dispose() {
        if (this._eventHandlers) {
            this._eventHandlers.forEach((value, key) => {
                value.length = 0;
            })
            this._eventHandlers.clear();
            this._eventHandlers = null;
            delete this._eventHandlers;
        }
    }

    fireEvent(name, event) {
        if (this._eventHandlers == null) return;
        let hanlders = this._eventHandlers.get(name);
        if (hanlders) {
            hanlders.forEach(handler => {
                // Promise.resolve(event).then((event) => {
                handler({ source: this, event: event });
                // })
            })
        }
    }

    on(name, handler) {
        if (this._eventHandlers == null) {
            this._eventHandlers = new Map();
        }
        let handlers = this._eventHandlers.get(name);
        if (!handlers) {
            handlers = [];
            this._eventHandlers.set(name, handlers);
        }
        handlers.push(handler);
    }

    off(name, handler) {
        if (!this._eventHandlers) return;
        let handlers = this._eventHandlers.get(name);
        if (handlers) {
            let index = handlers.indexOf(handler);
            if (index != -1) handlers.splice(index, 1);
        }
    }
}