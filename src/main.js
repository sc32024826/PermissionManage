// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import config from '@/config'
import installPlugin from '@/plugin'
import error from '@/libs/ErrorUpload'
import './index.less'
import '@/assets/icons/iconfont.css'
import 'view-design/dist/styles/iview.css'

Vue.use(ViewUI)
Vue.use(error)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
// const errorHandler = (error, vm) => {
//     console.error('抛出全局异常')
//     console.error(vm)
//     console.error(error)
// }
// Vue.config.errorHandler = errorHandler
// Vue.prototype.$throw = (error) => errorHandler(error, this)
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
