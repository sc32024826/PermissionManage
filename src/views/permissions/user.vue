<template>
	<div class="flex row">
		<Card>
			<Tables v-model="tableData" :columns="columns" @on-current-change="change" highlight-row></Tables>
		</Card>
		<Card>
			<CheckboxGroup v-model="Group" class="flex column">
				<h3>给所选用户分配权限组:</h3>
				<Checkbox v-for="(item,i) in GroupList" :key="i" :label="item.Id" border class="checkbox">{{item.Name}}</Checkbox>
			</CheckboxGroup>
			<div class="bottom-button">
				<Button type="primary" @click="save" icon="" class="">保存</Button>
			</div>
		</Card>
	</div>
</template>
<script>
import Tables from '_c/tables'
import Axios from 'axios'
import { getToken } from '@/libs/util'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
	name: 'userManage',
	components: { Tables },
	data () {
		return {
			tableData: [],
			columns: [
				{ title: 'id', key: 'uID', align: 'center', width: 60 },
				{ title: '用户名', key: 'uLoginName', align: 'center', width: 150 }
			],
			Group: [],
			GroupList: [],
			temp: '', // 将选中账号的组 存入temp变量
			currentUser: {} // 当前选中的角色
		}
	},
	methods: {
		// 点击单行时触发
		change (data) {
			console.log(data)
			this.temp = data.RIDs
			this.Group = data.RIDs
			this.currentUser = data
		},
		save () {
			// 当前组
			this.currentUser.RIDs = this.Group
			// console.log(this.currentUser)
			console.log(this.Group)
			if (this.Group === this.temp) {
				this.$Message.info('未做修改!')
			}
			Axios({
				url: baseUrl + '/api/User/Put',
				method: 'PUT',
				data: this.currentUser,
				headers: {
					'Authorization': 'Bearer ' + this.token
				}
			}).then(res => {
				// 修改成功 刷新页面
				console.log(res.data)
				this.$Message['success']({
					background: true,
					content: res.data.msg
				})
				this.update()
				this.clear()
			}).catch(err => {
				// 修改失败
				this.$Message['error']({
					background: true,
					content: err
				})
			})
		},
		// 获取全部user信息
		getUserData () {
			Axios({
				url: baseUrl + '/api/User/Get',
				method: 'GET',
				params: { page: 1, key: '' },
				headers: {
					'Authorization': 'Bearer ' + this.token
				}
			}).then(res => {
				console.log(res)
				this.tableData = res.data.response.data
			}).catch(err => {
				this.$Message['error']({
					background: true,
					content: err + '请重新登录!',
					duration: 10
				})
			})
		},
		// 获取角色信息
		getRoleData () {
			Axios({
				url: baseUrl + '/api/Role/Get',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + this.token
				}
			}).then(res => {
				console.log(res.data.response)
				this.GroupList = res.data.response.data
			}).catch(err => {
				this.$Message['error']({
					background: true,
					content: err + '请重新登录!'
				})
			})
		},
		update () {
			this.getUserData()
			this.getRoleData()
		},
		clear () {
			this.Group = []
			this.currentUser = {}
			this.temp = ''
		}
	},
	mounted () {
		this.update()
		// console.log(this.token)
	},
	computed: {
		token: function () {
			return getToken()
		}
	}
}
</script>
<style scoped>
.flex {
	display: flex;
}
.row {
	flex-direction: row;
}
.column {
	flex-direction: column;
	justify-content: space-between;
}
.demo-drawer-footer {
	width: 100%;
	position: absolute;
	bottom: 0;
	right: 0;
	border-top: 1px solid #e8e8e8;
	padding: 10px 16px;
	text-align: right;
	background: #fff;
}
.bottom-button {
	margin-top: 50px;
	margin-bottom: 10px;
}
.checkbox {
	margin: 5px 5px 0 0;
}
</style>
