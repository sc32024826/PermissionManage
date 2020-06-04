import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
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
    if (!token) {
        store.commit('setToken', window.localStorage.Token)
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        if (token && token !== 'undefined') {
            // 通过vuex state获取当前的token是否存在
            next()
        } else {
            console.log('认证')
            // 这里使用Id4授权认证，用Jwt，请删之，并把下边的跳转login 打开；
            applicationUserManager.login()
        }
    } else {
        next()
    }
})

router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
/*
if (!token && to.name !== LOGIN_PAGE_NAME) {
    console.log('未登录且要跳转的页面不是登录页')
    // 未登录且要跳转的页面不是登录页
    next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
    })
} else if (!token && to.name === LOGIN_PAGE_NAME) {
    console.log('未登陆且要跳转的页面是登录页')
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
} else if (token && to.name === LOGIN_PAGE_NAME) {
    console.log('已登录且要跳转的页面是登录页')
    // 已登录且要跳转的页面是登录页
    next({
        name: homeName // 跳转到homeName页
    })
} else {
    // if (store.state.user.hasGetInfo) {
    //     console.log('111111111111111111111')
    //     turnTo(to, store.state.user.access, next)
    // } else {
    //     console.log('2222222222222')
    //     store.dispatch('getUserInfo').then(user => {
    //         // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
    //         turnTo(to, user.access, next)
    //     }).catch(() => {
    //         setToken('')
    //         next({
    //             name: 'login'
    //         })
    //     })
    // }
    next()
}
*/
