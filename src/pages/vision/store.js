import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 
export default new Vuex.Store({
  state: {
    sernum: '',
  },
  mutations: {
    changeSernum (state, sernum) {
      state.sernum = sernum;
    }
  }
});
