import axios from 'axios'
import applicationUserManager from '../Auth/applicationusermanager'
import store from '../store'
import Vue from 'vue'

let base = ''
// let base = '172.18.20.142:80'

// 请求延时
axios.defaults.timeout = 20000

var storeTemp = store
axios.interceptors.request.use(
    config => {
        var curTime = new Date()
        var expiretime = new Date(Date.parse(storeTemp.state.tokenExpire))
        debugger
        if (storeTemp.state.token && (curTime < expiretime && storeTemp.state.tokenExpire)) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = 'Bearer ' + storeTemp.state.token
        }
        saveRefreshtime()
        return config
    },
    err => {
        debugger
        return Promise.reject(err)
    }
)

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        // 超时请求处理
        var originalRequest = error.config
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1 && !originalRequest._retry) {
            Vue.prototype.$message({
                message: '请求超时！',
                type: 'error'
            })

            originalRequest._retry = true
            return null
        }

        if (error.response) {
            if (error.response.status === 401) {
                var curTime = new Date()
                var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))
                // 在用户操作的活跃期内
                if (window.localStorage.refreshtime && (curTime <= refreshtime)) {
                    return refreshToken({ token: window.localStorage.Token }).then((res) => {
                        if (res.success) {
                            Vue.prototype.$message({
                                message: 'refreshToken success! loading data...',
                                type: 'success'
                            })

                            store.commit('setToken', res.response.token)

                            var curTime = new Date()
                            var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + res.response.expires_in))
                            store.commit('saveTokenExpire', expiredate)

                            error.config.__isRetryRequest = true
                            error.config.headers.Authorization = 'Bearer ' + res.response.token
                            return axios(error.config)
                        } else {
                            // 刷新token失败 清除token信息并跳转到登录页面
                            ToLogin()
                        }
                    })
                } else {
                    // 返回 401，并且不知用户操作活跃期内 清除token信息并跳转到登录页面
                    ToLogin()
                }
            }
            // 403 无权限
            if (error.response.status === 403) {
                Vue.prototype.$message({
                    message: '失败！该操作无权限',
                    type: 'error'
                })
                return null
            }
            // 429 ip限流
            if (error.response.status === 429) {
                Vue.prototype.$message({
                    message: '刷新次数过多，请稍事休息重试！',
                    type: 'error'
                })
                return null
            }
        }
        return '' // 返回接口返回的错误信息
    }
)

export const BaseApiUrl = base

// 登录
export const requestLogin = params => {
    return axios.get(`${base}/api/login/jwttoken3.0`, { params: params }).then(res => res.data)
}

export const refreshToken = params => {
    return axios.get(`${base}/api/login/RefreshToken`, { params: params }).then(res => res.data)
}
const ToLogin = params => {
    store.commit('setToken', '')
    store.commit('saveTokenExpire', '')
    // store.commit('saveTagsData', '')
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('NavigationBar')

    if (global.IS_IDS4) {
        applicationUserManager.login()
    } else {
        router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
        })

        window.location.reload()
    }
}
// 菜单模块管理
export const getPermissionTreeTable = params => {
    return axios.get(`${base}/api/permission/GetTreeTable`, { params: params })
}
export const removePermission = params => {
    return axios.delete(`${base}/api/permission/delete`, { params: params })
}
export const editPermission = params => {
    return axios.put(`${base}/api/permission/put`, params)
}
export const addPermission = params => {
    return axios.post(`${base}/api/permission/post`, params)
}
export const getPermissionTree = params => {
    return axios.get(`${base}/api/permission/getpermissiontree`, { params: params })
}

export const saveErrorLogger = info => {
    return axios.request({
        url: 'save_error_logger',
        data: info,
        method: 'post'
    })
}
