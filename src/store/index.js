import { createStore } from 'vuex'
import { Point } from 'figures';
import ActionStack from "../actions/action-stack.js";

const state = {
  document: null,
  status: '',
  selections: [],
  actionStack: new ActionStack(),
  defaultFont: {
    family: 'Arial',
    size: 10
  },
  images: [],
  fonts: []
}

const mutations = {
  addFontFamily(state, font) {
    state.fonts.push(font);
  },
  addImage(state, img) {
    state.images.push(img);
  },
  removeImage(img) {
    let index = state.images.indexOf(img);
    if (index != -1) state.images.splice(index, 1);
  },
  updateDocument(state, newDoc) {
    state.document = newDoc
  },
  updateStatus(state, msg) {
    state.status = msg;
  },

  concatSelections(state, ss) {
    if (state.selections && ss instanceof Array) {
      state.selections = state.selections.concat(ss);
    }
  },

  updateSelections(state, s) {
    state.selections = s
  },

  addSelection(state, s) {
    if (state.selections && s)
      state.selections.push(s);
  },
  removeSelection(state, s) {
    if (state.selections && s) {
      let index = state.selections.indexOf(s);
      if (index != -1) state.selections.splice(index, 1);
    }
  },
  cleanSelections(state) {
    if (state.selections)
      state.selections.splice(0);
  },
  sortSelections(state) {
    if (state.selections && state.document) {
      state.selections.sort((a, b) => {
        if (a instanceof Point || b instanceof Point) return 0;
        state.document.indexOfChild(b) - state.document.indexOfChild(a);
      })
    }
  }
}

const getters = {
  documentIsEmpty(state) {
    return state.document == null || state.document.children.length == 0
  },

  isEmptySelections(state) {
    return state.selections == null || state.selections.length == 0
  },

  images(state) {
    return state.images;
  },

  fonts(state) {
    return state.fonts;
  }
}

const actions = {
  excuteAction({ commit, state }, action) {
    state.actionStack.excute(action);
  },

  redo({ commit, state }) {
    state.actionStack.redo();
  },

  undo({ commit, state }) {
    state.actionStack.undo();
  },

  cleanActionStack({ commit, state }) {
    state.actionStack.dispose();
  },

  addSelection({ commit, state }, f) {
    commit('addSelection', f);
    commit('sortSelections')
  },
  removeSelection({ commit, state }, f) {
    commit('removeSelection', f);
    commit('sortSelections')
  },

  removeSelections({ commit, state }, f) {
    f.forEach(a => {
      commit('removeSelection', actions);
    })
    commit('sortSelections')
  },

  cleanSelections({ commit, state }) {
    commit('cleanSelections')
  },

  concatSelections({ commit, state }, ss) {
    commit('concatSelections', ss);
    commit('sortSelections')
  }
}


export default createStore({
  state, mutations, getters, actions
});
