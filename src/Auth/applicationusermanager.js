import { UserManager } from 'oidc-client'
import { Message } from 'view-design'

class ApplicationUserManager extends UserManager {
    constructor () {
        super({
            authority: 'https://protal.servers.mchains.cn/', // 授权服务中心地址
            client_id: 'shanying_vue_ui', // 客户端 id
            redirect_uri: 'http://localhost:8080/callback', // 登录回调地址
            response_type: 'id_token token',
            scope: 'openid profile roles shanying.services.api', // 作用域也要一一匹配
            post_logout_redirect_uri: 'http://localhost:8080/welcome', // 登出后回调地址
            automaticSilentRenew: true
        })
    }

    async login () {
        await this.signinRedirect()
        return this.getUser()
    }

    async logout () {
        let msg = await this.getUser()
        console.log(msg)
        if (msg !== null) {
            return this.signoutRedirect()
        } else {
            Message.error('当前未登录')
        }
    }
}

const applicationUserManager = new ApplicationUserManager()
export { applicationUserManager as default }
