
export default {
    state: {
        userName: '',
        userId: '',
        avatarImgPath: '',
        token: '',
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
        }
    },
    getters: {

    },
    actions: {
        // 登录
        handleLogin (commit) {
            commit('setToken', data.token)
        },
        // 退出登录
        handleLogOut ({ state, commit }) {
            commit('setToken', '')
            commit('setAccess', [])
        }
    }
}
