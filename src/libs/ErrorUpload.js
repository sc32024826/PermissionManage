import { saveErrorLogger } from '@/api/data'

const errorHandler = (error, vm, info) => {
    // let curTime = new Date()
    console.error('抛出全局异常')
    console.error(vm)
    console.error(error)
    console.error(info)
    let para = {
        appName: 'uniapp-vue-后台',
        date: new Date(),
        thread: '',
        level: '',
        message: error.message,
        exception: error.stack
    }
    console.log(para)
    saveErrorLogger(para).then(res => {
        console.log(res.data)
    })
}
let GlobalError = {
    install: (Vue, options) => {
        Vue.config.errorHandler = errorHandler
        // Vue.mixin({
        //     beforeCreate () {
        //         const methods = this.$options.methods || {}
        //         Object.keys(methods).forEach(key => {
        //             let fn = methods[key]
        //             this.$options.methods[key] = function (...args) {
        //                 let ret = fn.apply(this, args)
        //                 if (ret && typeof ret.then === 'function' && typeof ret.catch === 'function') {
        //                     return ret.catch(errorHandler)
        //                 } else {
        //                     return ret
        //                 }
        //             }
        //         })
        //     }
        // })
        // Vue.prototype.$throw = errorHandler
        Vue.prototype.$throw = (error) => errorHandler(error, this)
    }
}

export default GlobalError
