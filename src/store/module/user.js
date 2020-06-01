import {
    login,
    logout,
    getUserInfo,
    getMessage,
    getContentByMsgId,
    hasRead,
    removeReaded,
    restoreTrash,
    getUnreadCount
} from '@/api/user'
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
        messageContentStore: {}
    },
    mutations: {
        setToken (state, token) {
            state.token = token
            setToken(token)
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
