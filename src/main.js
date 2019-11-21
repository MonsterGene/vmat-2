// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// https://www.material.io/resources/icons/?style=baseline

// import frame main styles
import 'vuetify/dist/vuetify.css';

// import initial styles
import './theme/default.sass';
import 'xterm/dist/xterm.css';
import 'xterm/dist/addons/fullscreen/fullscreen.css';

// import icons
import '@mdi/font/css/materialdesignicons.css';
import 'font-awesome/css/font-awesome.css';  

// import lib js code
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueCookies from 'vue-cookies';
import VeeValidate from 'vee-validate';
import Truncate from 'lodash.truncate';

// import our codes
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
// Helpers
// Global filters
Vue.filter('truncate', Truncate);
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });
Vue.use(Vuetify);

Vue.use(VueCookies);

// import colors from 'vuetify/lib/util/colors';

const themeOption = {};
/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(themeOption),
  router,
  store,
  components: { App },
  template: '<App/>'
});
