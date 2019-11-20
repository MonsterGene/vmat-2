// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://www.material.io/resources/icons/?style=baseline
import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify';
import router from './router';
import 'font-awesome/css/font-awesome.css';  
// import initial styles
import 'vuetify/dist/vuetify.css';
// import './theme/default.sass';
import VeeValidate from 'vee-validate';
// import colors from 'vuetify/es5/util/colors';
import Truncate from 'lodash.truncate';
import store from './store';
import VueCookies from 'vue-cookies';
import 'xterm/dist/xterm.css';
import 'xterm/dist/addons/fullscreen/fullscreen.css';
Vue.config.productionTip = false;
// Helpers
// Global filters
Vue.filter('truncate', Truncate);
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });
Vue.use(Vuetify);

Vue.use(VueCookies);

import colors from 'vuetify/lib/util/colors';

const themeOption = {
  theme: {
    light: {
      primary: colors.purple.darken1, // #E53935
      secondary: colors.red.lighten4, // #FFCDD2
      accent: colors.indigo.base, // #3F51B5
    }
  },
};
/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(themeOption),
  router,
  store,
  components: { App },
  template: '<App/>'
});
