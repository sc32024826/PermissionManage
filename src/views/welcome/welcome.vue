<template>
	<div>
		<h1>欢迎页面...</h1>
		<Button type="primary" @click="loginout">退出登录</Button>
		<Button type="primary" @click="jumpTo">跳转到首页</Button>
	</div>
</template>
<script>

export default {
	name: 'welcome',
	data () {
		return {

		}
	},
	methods: {
		async loginout () {
			// signoutRedirect
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
		},
		jumpTo () {
			this.$router.push({ name: 'home' })
		}
	}
}
</script>
