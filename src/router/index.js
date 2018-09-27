import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import companies from '@/components/companies/companies'
Vue.use(Router)

export default new Router({
  routes: [{
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
    }]
  }]
})
