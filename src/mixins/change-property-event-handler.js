import { ActionFactory, CompositeAction } from "../actions";
import modelpropertychangeprocessor from "./model-property-change-processor";

export default {
    mixins: [modelpropertychangeprocessor],
    methods: {
        propertyChange(events) {
            let action = new CompositeAction();
            events.forEach((event) => {
                let model = event.model;
                let property = event.property;
                let value = event.value;
                if (!model || !property) return;
                action.add(
                    ActionFactory.newChangePropertyAction(model, property, value)
                );
            });
            this.excuteAction(action);
        }
    }
}