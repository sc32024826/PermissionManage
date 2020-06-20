<template>
	<div></div>
</template>
<script>
import Oidc from 'oidc-client'

export default {
	name: 'silentRenew',
	mounted () {
		console.log('trying to renew the acess_token')
		new Oidc.UserManager().signinSilentCallback()
	}
}
</script>
