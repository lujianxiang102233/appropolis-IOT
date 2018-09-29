import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import companies from '@/components/companies/companies'
import role from '@/components/companies/role'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/',
    name: 'home',
    redirect: '/home'
  }, {
    path: '/home',
    name: 'home',
    component: home,
    children: [{
      path: '/companies',
      name: 'companies',
      component: companies
    }, {
      path: '/role',
      name: 'role',
      component: role
    }]
  }]
})
