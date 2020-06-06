<template>
	<div class="flex row">
		<Card>
			<Tables v-model="tableData" :columns="columns" @on-current-change="change" highlight-row width="300"></Tables>
			<Button type="primary" @click="freshUser" class="bottom" :disabled="freshUserdisable">刷新</Button>
		</Card>
		<Card>
			<CheckboxGroup v-model="Group" class="flex column">
				<h3>给所选用户分配权限组:</h3>
				<Checkbox v-for="(item,i) in GroupList" :key="i" :label="item.Id" border class="checkbox">{{item.Name}}</Checkbox>
			</CheckboxGroup>
			<div class="bottom-button">
				<Button type="primary" @click="save" icon="" class="" :disabled="saveDisable">保存</Button>
				<Button type="primary" @click="freshRole" :disabled="freshRoledisable">刷新</Button>
			</div>
		</Card>
	</div>
</template>
<script>
import Tables from '_c/tables'
import { getRoleListPage, getUserListPage, editUser } from '@/api/data'

export default {
	name: 'userManage',
	components: { Tables },
	data () {
		return {
			tableData: [],
			columns: [
				{ title: 'id', key: 'uID', align: 'center', width: 60 },
				{ title: '用户名', key: 'uLoginName', align: 'center' }
			],
			Group: [],
			GroupList: [],
			temp: '', // 将选中账号的组 存入temp变量
			currentUser: {}, // 当前选中的角色
			page: 1,
			freshUserdisable: false,
			freshRoledisable: false,
			saveDisable: false
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
			this.saveDisable = true
			// 当前组
			this.currentUser.RIDs = this.Group
			// console.log(this.currentUser)
			console.log(this.Group)
			if (this.Group === this.temp) {
				this.$Message.info('未做修改!')
				return
			}
			let para = this.currentUser
			editUser(para).then(res => {
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
			setTimeout(() => {
				this.saveDisable = false
			}, 1000)
		},
		// 获取全部user信息
		getUserData () {
			let params = {
				page: this.page
			}
			getUserListPage(params).then(res => {
				console.log(res.data)
				this.tableData = res.data.response.data
			}).catch(err => {
				console.log(err)
				this.$Message['error']({
					background: true,
					content: err,
					duration: 3
				})
			})
		},
		// 获取角色信息
		getRoleData () {
			let para = {
				page: this.page
			}
			getRoleListPage(para).then(res => {
				console.log(res.data)
				this.GroupList = res.data.response.data
			}).catch(err => {
				console.log(err)
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
		},
		freshUser () {
			this.getUserData()
			this.freshUserdisable = true
			setTimeout(() => {
				this.freshUserdisable = false
			}, 1000)
		},
		freshRole () {
			this.getRoleData()
			this.freshRoledisable = true
			setTimeout(() => {
				this.freshRoledisable = false
			}, 1000)
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
.bottom-button button {
	margin-right: 20px;
}
.checkbox {
	margin: 5px 5px 0 0;
}
.bottom {
	margin-top: 20px;
}
</style>
