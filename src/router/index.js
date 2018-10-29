import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import companies from '@/components/companies/companies'
import role from '@/components/companies/role'
import companyaccess from '@/components/companies/companyaccess'
import user from '@/components/companies/user'
import logs from '@/components/companies/logs'

import roleaccess from '@/components/companies/roleaccess'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: home,
      children: [
        {
          path: '/companies',
          component: companies
        },
        {
          path: '/companyaccess',
          component: companyaccess
        },
        {
          path: '/role',
          component: role
        },
        {
          path: '/user',
          component: user
        },
        {
          path: '/roleaccess/:roleName?',
          name: 'roleaccess',
          component: roleaccess
        },
        {
          path: '/logs',
          component: logs
        }
      ]
    }
  ]
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
