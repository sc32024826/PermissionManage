<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
// import applicationUserManager from '@/Auth/applicationusermanager'
// import userAuth from '@/Auth/UserAuth'

export default {
	name: 'App',
	// 	mixins: [userAuth],
	data: function () {
		return {}
	}
	// 	watch: {
	// 		$route: async function (to, from) {
	// 			// 这里使用Id4授权认证，用Jwt，请删之；
	// 			console.log('refreshUserInfo')
	// 			await this.refreshUserInfo()
	// 		}
	// 	},
	// 	methods: {
	// 		async login () {
	// 			try {
	// 				await applicationUserManager.login()
	// 			} catch (error) {
	// 				console.log(error)
	// 				this.$root.$emit('show-snackbar', { message: error })
	// 			}
	// 		},
	// 		async logout () {
	// 			try {
	// 				await applicationUserManager.logout()
	// 				this.$store.commit('setToken', '')
	// 				window.localStorage.removeItem('user')
	// 				window.localStorage.removeItem('Token')
	// 				window.localStorage.removeItem('TokenExpire')
	// 				window.localStorage.removeItem('NavigationBar')
	// 				window.localStorage.removeItem('refreshtime')
	// 				window.localStorage.removeItem('router')
	// 				sessionStorage.removeItem('Tags')
	// 			} catch (error) {
	// 				console.log(error)
	// 				this.$root.$emit('show-snackbar', { message: error })
	// 			}
	// 		}
	// 	}
}
</script>

<style lang="less">
.size {
	width: 100%;
	height: 100%;
}
html,
body {
	.size;
	overflow: hidden;
	margin: 0;
	padding: 0;
}
#app {
	.size;
}
</style>
