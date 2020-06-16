<template>
	<div>
		<h1>欢迎页面...</h1>
		<Button type="primary" @click="logout">退出登录</Button>
		<Button type="primary" @click="login">登录</Button>
	</div>
</template>
<script>
import applicationUserManager from '@/Auth/applicationusermanager'

export default {
	name: 'welcome',
	data () {
		return {

		}
	},
	methods: {
		async login () {
			try {
				await applicationUserManager.login()
			} catch (error) {
				console.log(error)
				this.$root.$emit('show-snackbar', { message: error })
			}
		},
		async logout () {
			try {
				await applicationUserManager.logout()
				this.$store.commit('setToken', '')
				window.localStorage.removeItem('user')
				window.localStorage.removeItem('Token')
				window.localStorage.removeItem('TokenExpire')
				window.localStorage.removeItem('NavigationBar')
				window.localStorage.removeItem('refreshtime')
				window.localStorage.removeItem('router')
				sessionStorage.removeItem('Tags')
				this.$Message['success']({
					background: true,
					content: '退出成功,清空token完毕',
					duration: 4
				})
			} catch (error) {
				console.log(error)
				this.$root.$emit('show-snackbar', { message: error })
			}
		}
	}
}
</script>
