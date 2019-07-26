import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 
export default new Vuex.Store({
  state: {
    sernum: '',
    showToolBar: true,
    screenStyle: true,
  },
  mutations: {
    changeSernum (state, sernum) {
      state.sernum = sernum;
    },
    changeShowToolBar (state) {
      state.showToolBar = !state.showToolBar;
    },
    changeScreenStyle (state) {
      state.screenStyle = !state.screenStyle;
    }
  }
});
