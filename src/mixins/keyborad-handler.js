import groupfiguresprocessor from "./group-figures-processor";
import selectiondeleteprocessor from "./selection-delete-processor";

export default {
    mixins: [groupfiguresprocessor, selectiondeleteprocessor],
    methods: {
        keydown(event) {
            if (!this.canHandlerInput) return
            if (this._deleteAction) {
                cancelAnimationFrame(this._deleteAction);
            }
            this._deleteAction = requestAnimationFrame(() => {
                if (event.code == 'Delete') {
                    this.deleteActionFired();
                }
                if (event.code == 'KeyZ') {
                    if (event.ctrlKey && !event.shiftKey) {
                        this.undoActionFired();
                        return;
                    }
                    if (event.ctrlKey && event.shiftKey) {
                        this.redoActionFired();
                        return;
                    }
                }
                if (event.code == 'Escape') {
                    this.currentTool = 'select'
                }

                if (event.code == 'KeyV') {
                    this.currentTool = 'select'
                }
                if (event.code == 'KeyT') {
                    this.currentTool = 'text'
                }
                if (event.code == 'KeyA') {
                    this.currentTool = 'vertex-select'
                }
                if (event.code == 'KeyW') {
                    this.currentTool = 'pen'
                }
                if (event.code == 'KeyG') {
                    if (event.shiftKey) {
                        this.groupActionFired();
                        return;
                    }
                    // 快捷键冲突，咋办？
                    if (event.altKey && event.shiftKey) {
                        this.ungroupActionFired();
                        return;
                    }
                }
            })

            if (event.code == 'Space') {
                this.spacePressed = true;
            }
        },
        keyup(event) {
            if (!this.canHandlerInput) return
            if (event.code == 'Space') {
                this.spacePressed = false;
            }
        },

        keypress(event) {
            // console.log('press');
            // if (!this.canHandlerInput) return
            // if (event.code == 'KeyZ') {
            //     if (event.ctrlKey && !event.shiftKey) {
            //         this.undoActionFired();
            //         return;
            //     }
            //     if (event.ctrlKey && event.shiftKey) {
            //         this.redoActionFired();
            //         return;
            //     }
            // }

            // if (event.code == 'KeyV') {
            //     this.currentTool = 'select'
            // }
            // if (event.code == 'KeyT') {
            //     this.currentTool = 'text'
            // }
            // if (event.code == 'KeyA') {
            //     this.currentTool = 'vertex-select'
            // }
            // if (event.code == 'KeyW') {
            //     this.currentTool = 'pen'
            // }
            // if (event.code == 'KeyG') {
            //     if (event.shiftKey) {
            //         this.groupActionFired();
            //         return;
            //     }
            //     // 快捷键冲突，咋办？
            //     if (event.altKey && event.shiftKey) {
            //         this.ungroupActionFired();
            //         return;
            //     }
            // }
        },

        groupActionFired() {
            if (this.canGroup && this.groupFigures) {
                this.groupFigures();
            }
        },

        ungroupActionFired() {
            if (this.canUnGroup && this.unGroupFigures) {
                this.unGroupFigures();
            }
        },

        deleteActionFired() {
            if (this.canDelete && this.deleteSelections) {
                this.deleteSelections();
            }
        },
        redoActionFired() {
            if (this.actionStack && this.document) {
                if (this.actionStack.canRedo()) this.redo();
            }
        },
        undoActionFired() {
            if (this.actionStack && this.document) {
                if (this.actionStack.canUndo()) this.undo();
            }
        }
    },
    mounted() {
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
        window.addEventListener('keypress', this.keypress);
    },
    data() {
        return {
            spacePressed: false,
            canHandlerInput: true
        }
    }
}