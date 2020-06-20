import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'view-design'
import { setTitle } from '@/libs/util'
import Mgr from '@/Services/SecurityService'

Vue.use(Router)

let mgr = new Mgr()

const router = new Router({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (requiresAuth) {
        mgr.getRole().then(
            sucess => {
                debugger
                //   if (to.meta.role == sucess){
                next()
                //   }else {
                //     next('/accessdenied');
                //   }
            },
            err => {
                debugger
                console.log(err)
            }
        )
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
