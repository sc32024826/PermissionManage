<template>
	<div>
		<h1>自动登录中...</h1>
	</div>
</template>
<script>
import store from '@/store'
import Axios from 'axios'

export default {
	name: 'login',
	data () {
		return {

		}
	},
	methods: {
		async login () {
			Axios({
				url: 'http://localhost:8081/api/Login/JWTToken3.0',
				params: { name: 'test', pass: 'test' },
				methods: 'GET'
			}).then(res => {
				console.log('保存token')
				let token = res.data.response.token
				console.log(token)
				store.commit('setToken', token)
				this.$router.push({ name: 'home' })
			}).catch(err => {
				console.log(err)
			})
		}
	},
	async mounted () {
		// 如果已经登录
		if (store.state.token) {
			console.log(store.state.token)
			this.$router.push('/home')
		} else {
			console.log('未登录')
			this.login()
		}
	}
}
</script>
