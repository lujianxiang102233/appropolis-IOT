import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/comment.css'
import moment from 'moment'
import Router from 'vue-router'

Vue.prototype.axios = axios
Vue.filter('time', (input, value = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(value)
})

Vue.use(ElementUI)
Vue.use(Router)

axios.interceptors.request.use(
  function (config) {
    config.baseURL = 'http://192.168.210.66:8085/api-employee'
    config.headers.token = localStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(function (response) {
  if (response.data.content.code === -2000) {
    router.replace({
      path: 'login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
  return response
}, function (error) {
  return Promise.reject(error.response)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
