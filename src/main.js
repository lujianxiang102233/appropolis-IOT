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
    console.log('token失效，跳转到首页')
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
// axios.interceptors.response.use(function (response) {
//   console.log(response)
//   // 对响应数据做点什么
//   if (response.data.content.code === -2000) {
//     this.$router.push('/login')
//     console.log(123)
//   }
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

// axios.interceptors.response.use(
//   response => {/*在这里可以设置请求成功的一些设置*/
//     let newToken=response.config.headers.token
//     localStorage.setItem('x-auth-token', newToken);
//     if(response.data.code==-1&&response.status==200){
//       this.$message({showClose: true, message:response.data.msg, type: 'warning'});
//     };
//     return response;
//   },
//   error => {/*在这里设置token过期的跳转*/
//     if (error.response) {
//       if(error.response.data.code==401){
//         this.$router.push('/login');
//       }
//     }
//   });
// var token = window.localStorage.getItem("token");
// Vue.http.interceptors.push(function(request, next) {
//     request.headers.set('token', token); //setting request.headers
//     next(function(response){
//         if(response.body.code===401){ //与后台约定登录失效的返回码
//             parent.location.href ='/login.html';
//         }
//         return response
//     })
// })
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
