import { UserManager } from 'oidc-client'

class ApplicationUserManager extends UserManager {
    constructor () {
        super({
            authority: 'https://protal.servers.mchains.cn/', // 授权服务中心地址
            client_id: 'shanying_vue_ui', // 客户端 id
            redirect_uri: 'http://localhost:8080/callback', // 登录回调地址
            response_type: 'id_token token',
            scope: 'openid profile roles shanying.services.api', // 作用域也要一一匹配
            post_logout_redirect_uri: 'http://localhost:8080/home', // 登出后回调地址
            automaticSilentRenew: true
        })
    }

    async login () {
        await this.signinRedirect()
        console.log('认证完毕', new Date())
        return this.getUser()
    }

    async logout () {
        return this.signoutRedirect()
    }
}

const applicationUserManager = new ApplicationUserManager()
export { applicationUserManager as default }
