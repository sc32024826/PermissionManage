<template>
	<div>
		<h2>token:</h2>
		{{token}}
		<h2>gettoken</h2>
        {{ddd}}
	</div>
</template>
<script>
import store from '../store'
import { getToken } from '../libs/util'

export default {
	name: 'test',
	data () {
		return {
			token: '',
			ddd: ''
		}
	},
	mounted () {
		this.token = store.state.user.token
		console.log(this.token)
        this.ddd = getToken()
        console.log(this.ddd)
	}
}
</script>
