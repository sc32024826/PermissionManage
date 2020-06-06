<template>
	<div>

		<div class="flex">
			<Card>
				<Tables v-model="tableData" :columns="columns" width=400 @on-current-change="change" highlight-row></Tables>
				<Button type="primary" @click="fresh" class="bottom" :disbale="freshdisable">刷新</Button>
			</Card>
			<Card>
				<Tables v-model="pageList" :columns="myColumns" :loading="loading"></Tables>
				<Button type="primary" icon="" @click="save" class="bottom" :disbale="savedisable">保存</Button>
			</Card>
		</div>
	</div>
</template>
<script>
import Tables from '_c/tables'
import { getRoleListPage, getPermissionIds } from '@/api/data'

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
			loading: false,
			page: 1,
			filter: {
				name: ''
			},
			freshdisable: false,
			savedisable: false
		}
	},
	methods: {
		// 权限组改变
		change (data) {
			console.log(data.id)
			this.loading = true
			this.getPermission(data.id)
			// this.per = data.permision
			// this.temp = data.permision
		},
		save () {
			this.savedisable = true
			if (this.per === this.temp) {
				this.$Message.info('内容没有改变!')
				return
			}
			setTimeout(() => {
				this.savedisable = false
			}, 1000)
		},
		// 获得所有权限组-角色
		getRoleData () {
			let para = {
				page: this.page
			}
			getRoleListPage(para).then(res => {
				console.log(res)
				if (res.data) {
					this.tableData = res.data.response.data
				}
			}).catch(err => {
				console.log(err)
			})
		},
		getPermission (id) {
			let para = {
				id: id
			}
			getPermissionIds(para).then(res => {
				console.log(res.data)
				this.pageList = res.data.response.permissionids
				this.loading = false
			})
		},
		fresh () {
			this.freshdisable = true
			this.getRoleData()
			setTimeout(() => {
				this.freshdisable = false
			}, 1000)
		}
	},
	mounted () {
		this.getRoleData()
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
