<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
// import applicationUserManager from '@/Auth/applicationusermanager'
import userAuth from '@/Auth/UserAuth'

export default {
	name: 'App',
	mixins: [userAuth],
	data: function () {
		return {}
	},
	watch: {
		$route: async function (to, from) {
			// 这里使用Id4授权认证，用Jwt，请删之；
			console.log('refreshUserInfo')
			await this.refreshUserInfo()
		}
	}
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
