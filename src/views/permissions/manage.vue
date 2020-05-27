<template>
	<div class="flex">
		<Card>
			<Tables v-model="tableData" :columns="columns" width=400 @on-row-click="change"></Tables>
		</Card>
		<Card>
			<Tables v-model="pageList" :columns="myColumns" :loading="loading"></Tables>
			<Button type="primary" icon="" @click="save" class="bottom">保存</Button>
		</Card>
	</div>
</template>
<script>
import Tables from '_c/tables'

export default {
	components: { Tables },
	data () {
		return {
			tableData: [
				{ group: 'root', permision: { 'XXX页面': true, '页面1': false } },
				{ group: '普通', permision: { 'XXX页面': true, '页面1': false } },
				{ group: '分组1', permision: { 'XXX页面': true, '页面1': false } },
				{ group: '分组2', permision: { 'XXX页面': true, '页面1': true } }
			],
			columns: [
				{ title: '#', type: 'index', align: 'center' },
				{ title: '权限组', key: 'group', align: 'center' }
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
			this.per = data.permision
			this.temp = data.permision
		},
		save () {
			if (this.per === this.temp) {
				this.$Message.info('内容没有改变!')
			}
		}
	},
	mounted () {
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
