import axios from 'axios'
import applicationUserManager from '../Auth/applicationusermanager'
import store from '@/store'
import Vue from 'vue'

let base = 'http://localhost:80'

// 请求延时
axios.defaults.timeout = 20000

axios.interceptors.request.use(
    config => {
        var curTime = new Date()
        console.log(curTime)
        try {
            var expiretime = new Date(Date.parse(store.state.user.TokenExpire))
            console.log(expiretime)
        } catch (err) {
            console.log(err)
        }
        // storeTemp.state.user.token && (curTime < expiretime && storeTemp.state.user.tokenExpire)
        if (store.state.user.token && (curTime < expiretime && store.state.user.TokenExpire)) {
            console.log('添加 Authorization')
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = 'Bearer ' + store.state.user.token
        }
        saveRefreshtime()
        return config
    },
    err => {
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
                try {
                    var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))
                    console.log('refreshtime:', refreshtime)
                } catch (ERR) {
                    console.log(ERR)
                }
                console.log('在用户操作的活跃期内: ', window.localStorage.refreshtime)
                // 在用户操作的活跃期内
                if (window.localStorage.refreshtime && (curTime <= refreshtime)) {
                    // console.log('在用户操作的活跃期内')
                    // console.log(window.localStorage.Token)
                    // return ''
                    // return refreshToken({ token: window.localStorage.Token }).then((res) => {
                    //     console.log(res)
                    //     if (res.success) {
                    //         Vue.prototype.$message({
                    //             message: 'refreshToken success! loading data...',
                    //             type: 'success'
                    //         })

                    //         store.commit('setToken', res.response.token)

                    //         var curTime = new Date()
                    //         var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + res.response.expires_in))
                    //         console.log(res.response.expires_in)
                    //         store.commit('saveTokenExpire', expiredate)

                    //         error.config.__isRetryRequest = true
                    //         error.config.headers.Authorization = 'Bearer ' + res.response.token
                    //         return axios(error.config)
                    //     } else {
                    //         // 刷新token失败 清除token信息并跳转到登录页面
                            ToLogin()
                    //     }
                    // })
                } else {
                    console.log('登录失效')
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
export const saveRefreshtime = params => {
    let nowtime = new Date()
    let lastRefreshtime = window.localStorage.refreshtime ? new Date(window.localStorage.refreshtime) : new Date(-1)
    let expiretime = new Date(Date.parse(window.localStorage.TokenExpire))

    let refreshCount = 1 // 滑动系数
    if (lastRefreshtime >= nowtime) {
        lastRefreshtime = nowtime > expiretime ? nowtime : expiretime
        lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount)
        window.localStorage.refreshtime = lastRefreshtime
    } else {
        window.localStorage.refreshtime = new Date(-1)
    }
}
const ToLogin = params => {
    console.log('登录前 清空')
    store.commit('setToken', '')
    store.commit('saveTokenExpire', '')
    // store.commit('saveTagsData', '')
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('NavigationBar')

    // console.log(global.IS_IDS4)
    // if (global.IS_IDS4) {
    applicationUserManager.login()
    // } else {
    //     router.replace({
    //         path: '/login',
    //         query: { redirect: router.currentRoute.fullPath }
    //     })

    //     window.location.reload()
    // }
}
// 菜单模块管理
export const getPermissionListPage = params => {
    return axios.get(`${base}/api/permission/get`, { params: params })
}
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
export const getPermissionIds = params => {
    return axios.get(`${base}/api/permission/GetPermissionIdByRoleId`, { params: params })
}

export const addRolePermission = params => {
    return axios.post(`${base}/api/permission/Assign`, params)
}
export const getNavigationBar = params => {
    return axios.get(`${base}/api/permission/GetNavigationBar`, { params: params }).then(res => res.data)
}

// 角色管理
export const getRoleListPage = params => {
    return axios.get(`${base}/api/Role/Get`, { params: params })
}
export const removeRole = params => {
    return axios.delete(`${base}/api/role/delete`, { params: params })
}
export const editRole = params => {
    return axios.put(`${base}/api/role/put`, params)
}
export const addRole = params => {
    return axios.post(`${base}/api/role/post`, params)
}

// 接口模块管理
export const getModuleListPage = params => {
    return axios.get(`${base}/api/module/get`, { params: params })
}
export const removeModule = params => {
    return axios.delete(`${base}/api/module/delete`, { params: params })
}
export const editModule = params => {
    return axios.put(`${base}/api/module/put`, params)
}
export const addModule = params => {
    return axios.post(`${base}/api/module/post`, params)
}

// 用户管理
export const getUserListPage = params => {
    return axios.get(`${base}/api/user/get`, { params: params })
}
export const removeUser = params => {
    return axios.delete(`${base}/api/user/delete`, { params: params })
}
export const editUser = params => {
    return axios.put(`${base}/api/user/put`, params)
}
export const addUser = params => {
    return axios.post(`${base}/api/user/post`, params)
}
export const batchRemoveUser = params => {
    return axios.delete(`${base}/api/Claims/BatchDelete`, { params: params }) // 没做
}

export const saveErrorLogger = params => {
    return ''
}
