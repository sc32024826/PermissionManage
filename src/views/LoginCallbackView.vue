<template>
	<div>
		<div desktop=12 tablet=8>
			<h1>Login successful</h1>
			<h1>Your browser should be redirected soon</h1>
		</div>
	</div>
</template>
<script>
import applicationUserManager from '@/Auth/applicationusermanager'

export default {
	name: 'logincallback-view',
	data () {
		return {
		}
	},
	async created () {
		try {
            console.log('================登录===================')
			// 核心的就是这里了
			await applicationUserManager.signinRedirectCallback()
            let user = await applicationUserManager.getUser()
            console.log(user)
			let curTime = new Date()
			let expiredate = new Date(
				curTime.setSeconds(curTime.getSeconds() + user.expires_in)
			)
			// console.log(user)
			// 将 token 存储在客户端
			this.$store.commit('setToken', user.access_token)
			// 存储 token 过期时间
			// console.log('存储token过期时间:', expiredate)
			this.$store.commit('saveTokenExpire', expiredate)

			window.localStorage.refreshtime = expiredate
			window.localStorage.expires_in = user.expires_in
			// 调整首页
			this.$router.push({ name: 'home' })
		} catch (e) {
			console.log(e)
			this.$root.$emit('show-snackbar', { message: e })
		}
	}
}
</script>
