<template>
	<div class="flex row">
		<div class="flex column">
			<div>
				<h1>登录状态:{{state}}</h1>
				<h3>用户:{{name}}</h3>
				<h3>过期时间:{{expire}}</h3>
			</div>
			<Button type="primary" @click="signin()">登录</Button>
			<Button type="primary" @click="signOut()">Sign out</Button>

			<Button type="primary" @click="getAll('values')">
				GetAll
			</Button>

			<Button type="primary" @click="getToken()">
				Token
			</Button>

			<Button type="primary" @click="getTokenProfile()">
				Token Profile
			</Button>

			<Button type="primary" @click="getTokenId()">
				Id Token
			</Button>

			<Button type="primary" @click="getTokenSessionState()">
				Session State
			</Button>

			<Button type="primary" @click="getAccessToken()">
				Access Token
			</Button>

			<Button type="primary" @click="getTokenScopes()">
				Scopes
			</Button>

			<Button type="primary" @click="renewToken()">
				Force Access Token Renewal
			</Button>
		</div>
		<div class="flex column">
			<div id="resultsToken"></div>
			<div id="resultsApi"></div>
		</div>
	</div>

</template>

<script>
/* eslint-disable */
import Mgr from '@/Services/SecurityService'
import Api from '@/Services/ApiService'
import store from '@/store'
export default {
	name: 'Home',
	data () {
		return {
			mgr: new Mgr(),
			api: new Api()
		}
	},
	computed: {
		state: () => {
			return store.state.user.token ? true : false
		},
		name: () => {
			return store.state.user.userName
		},
		expire: () => {
			return store.state.user.TokenExpire
		}
	},
	methods: {
		signin () {
			this.mgr.signIn().then(res => {
				self.logToken(res)
			})
		},
		signOut () {
			this.mgr.signOut()
			store.commit('setName', '')
			store.commit('setToken', '')
			store.commit('saveTokenExpire', '')
			store.commit('setAvatar', '')
		},
		async getAll (api) {
			let self = this
			let result = await this.api.getAll(api)
			self.logApi(result)
		},
		getToken () {
			let self = this
			this.mgr.getUser().then(
				token => {
					self.logToken(token)
				},
				err => {
					console.log(err)
				})
		},
		getTokenId () {
			let self = this
			this.mgr.getIdToken().then(
				tokenId => {
					self.logToken(tokenId)
				},
				err => {
					console.log(err)
				})
		},
		getTokenSessionState () {
			let self = this
			this.mgr.getSessionState().then(
				sessionState => {
					self.logToken(sessionState)
				},
				err => {
					console.log(err)
				})
		},
		getAccessToken () {
			let self = this
			this.mgr.getAcessToken().then(
				acessToken => {
					self.logToken(acessToken)
				},
				err => {
					console.log(err)
				})
		},
		getTokenScopes () {
			let self = this
			this.mgr.getScopes().then(
				scopes => {
					self.logToken(scopes)
				},
				err => {
					console.log(err)
				})
		},
		getTokenProfile () {
			let self = this
			this.mgr.getProfile().then(
				tokenProfile => {
					self.logToken(tokenProfile)
				},
				err => {
					console.log(err)
				})
		},
		renewToken () {
			let self = this
			this.mgr.renewToken().then(
				newToken => {
					self.logToken(newToken)
				},
				err => {
					console.log(err)
				})
		},
		logApi () {
			document.getElementById('resultsApi').innerText = ''

			Array.prototype.forEach.call(arguments, function (msg) {
				if (msg instanceof Error) {
					msg = 'Error: ' + msg.message
				} else if (typeof msg !== 'string') {
					msg = JSON.stringify(msg, null, 2)
				}
				document.getElementById('resultsApi').innerHTML += msg + '\r\n'
			})
		},
		logToken () {
			document.getElementById('resultsToken').innerText = ''

			Array.prototype.forEach.call(arguments, function (msg) {
				if (msg instanceof Error) {
					msg = 'Error: ' + msg.message
				} else if (typeof msg !== 'string') {
					msg = JSON.stringify(msg, null, 2)
				}
				document.getElementById('resultsToken').innerHTML += msg + '\r\n'
			})

		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex {
	display: flex;
	border: solid 1px red;
}
.column {
	flex-direction: column;
	border: solid 1px red;
}
.column button {
	margin-bottom: 10px;
}
.row {
	flex-direction: row;
}
</style>
