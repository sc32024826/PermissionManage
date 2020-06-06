import { setToken, getToken } from '@/libs/util'

export default {
    state: {
        userName: '',
        userId: '',
        avatarImgPath: '',
        token: getToken(),
        access: '',
        hasGetInfo: false,
        unreadCount: 0,
        messageUnreadList: [],
        messageReadedList: [],
        messageTrashList: [],
        messageContentStore: {},
        TokenExpire: null
    },
    mutations: {
        setToken (state, token) {
            state.token = token
            setToken(token)
            window.localStorage.setItem('Token', token)
        },
        saveTokenExpire (state, data) {
            state.TokenExpire = data
            window.localStorage.setItem('TokenExpire', data)
        }
    },
    getters: {

    },
    actions: {
        // 登录
        handleLogin ({ commit }, token) {
            commit('setToken', token)
        },
        // 退出登录
        handleLogOut ({ state, commit }) {
            commit('setToken', '')
            commit('setAccess', [])
        }
    }
}
