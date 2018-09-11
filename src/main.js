import '@babel/polyfill' // i set useBuiltIns: 'entry' in babel config, this because Vuetify needs all polyfills
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vuetify'
import './plugins/vue-plugin-axios'

Vue.config.productionTip = false
Vue.prototype.$electron = require('electron')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
