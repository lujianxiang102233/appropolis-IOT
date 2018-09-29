import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/comment.css'
import moment from 'moment'
Vue.prototype.axios = axios
Vue.filter('time', (input, value = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(value)
})
Vue.use(ElementUI)

axios.interceptors.request.use(
  function (config) {
    config.baseURL = 'http://192.168.210.1:8888'
    config.headers.token = localStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
