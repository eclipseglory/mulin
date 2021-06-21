export default {
    methods: {
        confirm(event) {
            event.target.select();
            //   event.target.blur();
        },
        selectText(event) {
            event.target.select();
        },
    }
}