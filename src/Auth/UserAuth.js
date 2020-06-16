import applicationUserManager from './applicationusermanager'
import store from '@/store'
const userAuth = {
    data () {
        return {
            user: {
                name: '',
                isAuthenticated: false // 是否认证
            }
        }
    },
    methods: {
        async refreshUserInfo () { // 获取用户信息
            // console.log('刷新数据')
            // const user = await applicationUserManager.getUser()
            // if (user) {
            //     this.user.name = user.profile.name
            //     this.user.isAuthenticated = true
            //     let { access_token, expires_at } = user
            //     console.log(user)
            //     store.commit('setToken', { token: access_token, expires: expires_at })
            // } else {
            //     console.log('刷新token失败')
            //     this.user.name = ''
            //     this.user.isAuthenticated = false
            //     applicationUserManager.login()
            // }
        }
    },
    async created () {
        await this.refreshUserInfo()
    }
}
export default userAuth
