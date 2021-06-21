import { ActionFactory, CompositeAction } from "../actions";
import docmanager from "../store/doc-store-mapper";

const mixins = [docmanager];

export default {
    mixins,
    methods: {
        canChangeProperty(model, property) {
            return true;
        },

        changeProperty(model, property, value) {
            if (!this.document || !this.actionStack) return;
            if (!this.canChangeProperty(model, property)) return;
            this.excuteAction(ActionFactory.newChangePropertyAction(model, property, value));
        },

        changeModelsProperty(models, property, value) {
            if (!this.document || !this.actionStack) return;

            let action = new CompositeAction();

            models.forEach(selection => {
                if (!this.canChangeProperty(selection, property)) return;
                action.add(
                    ActionFactory.newChangePropertyAction(selection, property, value)
                );
            });
            this.excuteAction(action);
        },

        changeProperies(model, pvs) {
            if (!this.document || !this.actionStack) return;

            let action = new CompositeAction();
            for (let property in pvs) {
                if (!this.canChangeProperty(model, property)) continue;
                let value = pvs[property];
                action.add(
                    ActionFactory.newChangePropertyAction(model, property, value)
                );
            }
            this.excuteAction(action);
        },

        changeModelsProperties(models, properties) {
            if (!this.document || !this.actionStack) return;
            let action = new CompositeAction();
            models.forEach(selection => {
                let pa = new CompositeAction();
                for (let property in properties) {
                    if (!this.canChangeProperty(selection, property)) continue;
                    let value = properties[property];
                    pa.add(
                        ActionFactory.newChangePropertyAction(selection, property, value)
                    );
                }
                action.add(pa);
            });
            this.excuteAction(action);
        },

        getAnyPropertyValue(models, property, defaultValue) {
            if (!models || models.length == 0) return defaultValue;
            let v = models[0][property];
            for (let index = 1; index < models.length; index++) {
                const child = models[index];
                if (child[property] != v) return defaultValue;
            }
            return v == null ? defaultValue : v;
        }
    }
}