<template>
	<div></div>
</template>

<script>
import Oidc from 'oidc-client'
import store from '@/store'

export default {
	name: 'callback',
	mounted () {
		var mgr = new Oidc.UserManager({
			userStore: new Oidc.WebStorageStateStore(),
			loadUserInfo: true,
			filterProtocolClaims: true
		})

		mgr.signinRedirectCallback().then(function (user) {
			console.log(user)
			var avatar = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592565450842&di=fcd3ab6e654dd272f23427117aa27eaa&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F233%2Fw640h393%2F20181017%2F89ae-hmhhnqs8178053.jpg'

			store.commit('setName', user.profile.name)
			store.commit('setToken', user.access_token)
			store.commit('saveTokenExpire', user.expires_at)
			store.commit('setAvatar', avatar)

			window.location.href = '../'
		}).catch((err) => {
			console.log(err)
		})
	}

}
</script>
