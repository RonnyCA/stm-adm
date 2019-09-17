import '@babel/polyfill';
import Vue from 'vue';
import './plugins/axios';
import './plugins/c3-chart';
import './plugins/vuetify';
import './plugins/sweet-alert';
import './plugins/permissions';
import './plugins/notifications';
import './plugins/v-money';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/currency';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
