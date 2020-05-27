import axios from 'axios'

/**
 * 获取页面list
 *
 * @param {*} uid
 * @param {*} token
 */
function getPageList (uid, token) {
   
}
/**
 * 登录
 */
function login () {
    axios({
        url: 'http://localhost:8081/api/Login/JWTToken3.0',
        params: { name: 'admins', pass: 'admins' },
        methods: 'GET'
    }).then((res) => {
        let token = res.data.response.token
        return token
    }).catch((err) => {
        console.log(err)
    })
}
/**
 * 获得UID
 *
 * @param {*} Token
 */
function getUidByToken (Token) {

}
// 处理接口返回的各页面路由数据
function UrlListAction (data) {
    let urlList = data.children
    urlList.forEach(element => {
        // element.name
        // element.path
    })
}
/**
 *
 *
 */
function GetPermissionTree () {
    axios({
        url: '/api/Permission/GetPermissionTree',
        params: { pid: 0 },
        methods: 'GET'
    }).then((res) => {
        let uid = res.data.response
        console.log(uid)
    }).catch((err) => {
        console.log(err)
    })
}

export {
    getPageList,
    login,
    getUidByToken,
    UrlListAction,
    GetPermissionTree
}
