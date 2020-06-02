<template>
	<div>
		<h1>自动登录中...</h1>
	</div>
</template>
<script>
// import store from '@/store'
import Axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
	name: 'login',
	data () {
		return {

		}
	},
	computed: mapState(['token']),
	methods: {
		...mapActions([
			'handleLogin'
		]),
		async login () {
			let _this = this
			Axios({
				url: 'http://localhost:8081/api/Login/JWTToken3.0',
				params: { name: 'blogadmin', pass: 'blogadmin' },
				methods: 'GET'
			}).then(res => {
				console.log('保存token')
				let token = res.data.response.token
				console.log(token)
				_this.handleLogin(token)
				this.$router.push({ name: 'home' })
			}).catch(err => {
				console.log(err)
			})
		}
	},
	async mounted () {
        console.log('mounted')
        let token = this.token
        console.log(token)
		// 如果已经登录
		if (token) {
			console.log('已经登录,直接跳转')
			this.$router.push('/home')
		} else {
			console.log('未登录')
			this.login()
		}
	}
}
</script>
