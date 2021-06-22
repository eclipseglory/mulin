import { mapActions, mapGetters, mapMutations, mapState } from "vuex"

export default {
    computed: {
        ...mapState({
            document: (state) => {
                return state.document;
            },

            documentChildren: (state) => {
                if (state.document != null)
                    return state.document.children;
            },
            documentIsEmpty: (state) => {
                if (state.document != null)
                    return state.document.name
            },

            status: (state) => {
                return state.status;
            },

            selections: state => state.selections,
            actionStack: state => state.actionStack
        }),
        ...mapGetters(['documentIsEmpty', 'isEmptySelections', 'fonts','images'])
    },

    methods: {
        ...mapMutations(['updateDocument', 'updateStatus', 'updateSelections', 'addImage', 'removeImage']),
        ...mapActions(['cleanActionStack', 'redo', 'undo', 'excuteAction',
            'addSelection', 'removeSelection', 'removeSelections', 'concatSelections', 'cleanSelections'])
    }
}