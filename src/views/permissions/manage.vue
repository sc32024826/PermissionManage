<template>
	<div>

		<div class="flex">
			<Card>
				<Tables v-model="tableData" :columns="columns" width=400 @on-current-change="change" highlight-row></Tables>
				<Button type="primary" @click="fresh" class="bottom">刷新</Button>

			</Card>
			<Card>
				<Tables v-model="pageList" :columns="myColumns" :loading="loading"></Tables>
				<Button type="primary" icon="" @click="save" class="bottom">保存</Button>
			</Card>
		</div>
	</div>
</template>
<script>
import Tables from '_c/tables'
import Axios from 'axios'
import { getToken } from '@/libs/util'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
	components: { Tables },
	data () {
		return {
			tableData: [

			],
			columns: [
				{ title: '#', type: 'index', align: 'center' },
				{ title: '角色', key: 'Name', align: 'center' },
				{ title: '描述', key: 'Description' }
			],
			pageList: [],
			myColumns: [
				{ title: '页面', key: 'page', align: 'center' },
				{ title: '路径', key: 'url' },
				{
					title: '权限',
					key: 'canUse',
					render: (h, params) => {
						return h('Checkbox', {
							props: {
								value: this.per[params.row.page] ? this.per[params.row.page] : false
							},
							on: {
								'on-change': (val) => {
									console.log(params.row.page)
									console.log(val)
								}
							}
						}, '访问')
					}
				}
			],
			per: {}, // 各页面权限
			temp: {},
			loading: true
		}
	},
	methods: {
		// 权限组改变
		change (data) {
			console.log(data)
			// this.per = data.permision
			// this.temp = data.permision
		},
		save () {
			if (this.per === this.temp) {
				this.$Message.info('内容没有改变!')
			}
		},
		// 获得所有权限组-角色
		getRoleData () {
			Axios({
				url: 'http://localhost/api/Role/Get',
				method: 'GET',
				params: {
					page: 1,
					key: ''
				},
				headers: {
					Authorization: 'Bearer ' + this.token
				}
			}).then(res => {
				console.log(res.data)

				this.tableData = res.data.response.data
			}).catch(err => {
				this.$Message['error']({
					background: true,
					content: err
				})
			})
		},
		fresh () {
			this.getRoleData()
		}
	},
	mounted () {
		this.getRoleData()
		// console.log(this.token)
	},
	computed: {
		token: () => {
			return getToken()
		}
	}
}
</script>
<style scoped>
.flex {
	display: flex;
}
</style>

<style scoped>
.bottom {
	margin-top: 20px;
}
</style>
