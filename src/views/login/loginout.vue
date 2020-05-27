<template>
	<div>
		<h1>退出登录</h1>
	</div>
</template>
<script>
import store from '@/store'

export default {
	name: 'loginOut',
	mounted () {
		this.loginout()
	},
	methods: {
		loginout () {
			store.commit('setToken', '')
			console.log(store.state.token)
		}
	}
}
</script>
