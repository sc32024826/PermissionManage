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
        setName (state, data) {
            console.log(data)
            state.userName = data
        },
        setToken (state, data) {
            console.log(data)
            state.token = data
            setToken(data)
            window.localStorage.setItem('Token', data)
        },
        saveTokenExpire (state, data) {
            console.log(data)
            state.TokenExpire = data
        },
        setAvatar (state, avatarPath) {
            console.log(avatarPath)
            state.avatarImgPath = avatarPath
        }
    },
    getters: {

    },
    actions: {
    }
}
