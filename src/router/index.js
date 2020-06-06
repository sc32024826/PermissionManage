import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
// import store from '@/store'
import iView from 'view-design'
import { getToken, setTitle } from '@/libs/util'
import applicationUserManager from '@/Auth/applicationusermanager'
// import config from '@/config'
// const { homeName } = config

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'history'
})
// const LOGIN_PAGE_NAME = 'login'

// const turnTo = (to, access, next) => {
//     if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
//     else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
// }

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()

    const token = getToken()
    // if (!token) {
    //     console.log('================================')
    //     store.commit('setToken', window.localStorage.Token)
    // }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        if (token && token !== 'undefined') {
            // 通过vuex state获取当前的token是否存在
            console.log('已经登录,直接跳转: ', to)
            next()
        } else {
            console.log('未登录,前往认证', new Date())
            // 这里使用Id4授权认证，用Jwt，请删之，并把下边的跳转login 打开；
            applicationUserManager.login()
        }
    } else {
        console.log('该路由不需要登录,直接跳转: ', to)
        next()
    }
})

router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
