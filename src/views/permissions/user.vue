<template>
	<div class="flex row">
		<Card>
			<Tables v-model="tableData" :columns="columns" width="300" @on-row-click="change"></Tables>
		</Card>
		<Card>
			<RadioGroup v-model="Group">
				<h3>给所选用户分配权限组:</h3>
				<Radio v-for="(item,i) in GroupList" :key="i" :label="item" border></Radio>
			</RadioGroup>
			<div class="bottom-button">
				<Button type="primary" @click="save" icon="" class="">保存</Button>
			</div>
		</Card>
	</div>
</template>
<script>
import Tables from '_c/tables'

export default {
	name: 'userManage',
	components: { Tables },
	data () {
		return {
			tableData: [
				{ user: 'root', group: 'root' },
				{ user: 'shanying', group: '普通' }
			],
			columns: [
				{ title: '#', type: 'index', align: 'center' },
				{ title: '用户名', key: 'user', align: 'center' },
				{ title: '当前组', key: 'group', align: 'center' }
			],
			Group: '',
			GroupList: ['root', '普通', '分组1', '分组2'],
			temp: '' // 将选中账号的组 存入temp变量
		}
	},
	methods: {
		// 点击单行时触发
		change (data) {
			console.log(data)
			this.Group = data.group
			this.temp = data.group
		},
		save () {
			// 当前组
			console.log(this.Group)
			if (this.Group === this.temp) {
				this.$Message.info('未做修改!')
			}
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
</style>
