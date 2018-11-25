import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import companies from '@/components/companies/companies'
import role from '@/components/companies/role'
import companyaccess from '@/components/companies/companies-access'
import user from '@/components/companies/user'
import logs from '@/components/companies/logs'
import iframe from '@/components/companies/iframe'
import roleaccess from '@/components/companies/role-access'

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/login',
    component: login
  }, {
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: home,
    children: [{
      path: '/companies',
      component: companies
    }, {
      path: '/companies-access',
      component: companyaccess
    }, {
      path: '/role',
      component: role
    }, {
      path: '/user',
      component: user
    }, {
      path: '/role-access',
      name: 'role-access',
      component: roleaccess
    }, {
      path: '/logs',
      component: logs
    }, {
      path: '/iframe',
      component: iframe
    }]
  }]
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
