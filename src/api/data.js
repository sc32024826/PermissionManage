import axios from 'axios'
import store from '@/store'
import { Message } from 'view-design'

let base = 'http://localhost:80'

// 请求延时
axios.defaults.timeout = 20000

axios.interceptors.request.use(
    config => {
        if (store.state.user.token && store.state.user.token !== 'undefined') {
            console.info('添加 Authorization', store.state.user.token)
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = 'Bearer ' + store.state.user.token
        }
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
            Message.error('请求超时！')
            originalRequest._retry = true
            return null
        }
        if (error.response) {
            if (error.response.status === 401) {
                if (store.state.user.token === 'undefined') {
                    console.log('ToLogin')
                    ToLogin()
                }
            }
            // 403 无权限
            if (error.response.status === 403) {
                Message.error('失败！该操作无权限')
                return null
            }
            // 429 ip限流
            if (error.response.status === 429) {
                Message.error('刷新次数过多，请稍事休息重试！')
                return null
            }
            addErrorLog(error.response, 'ERROR')
        }
        return '' // 返回接口返回的错误信息
    }
)
/**
 * 添加错误信息并上传到服务器
 * @param {*} errorInfo 错误信息
 * @param {*} level 错误级别
 */
const addErrorLog = (errorInfo, level) => {
    const { statusText, request: { responseURL } } = errorInfo
    let info = {
        appName: 'uniapp-vue-admin',
        date: new Date(),
        thread: '',
        level: level,
        logger: 'axios',
        message: statusText,
        exception: responseURL
    }
    if (!responseURL.includes('save_error_logger')) {
        store.dispatch('addErrorLog', info)
    }
}

export const BaseApiUrl = base

// 静默刷新
const ToLogin = () => {
    
    let a = store.state.user.token
    console.log(a)
   
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

// 错误日志
export const saveErrorLogger = params => {
    // return axios.post(`${base}/api/Logger/SubmitLogInformation`, { params: params })
    return axios.post('http://test-api.servers.mchains.cn/api/Logger/SubmitLogInformation', params)
    // return axios.post('http://172.18.20.142/api/Logger/SubmitLogInformation', params)
}
