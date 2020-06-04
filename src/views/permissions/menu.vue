<template>
	<div>
		<div class="toolBar">
			<Button type="primary" icon="md-add" @click="OpenModalNew">增加</Button>
			<Button type="warning" icon="md-create" @click="edit">修改选中项</Button>
			<Button type="error" icon="md-trash" @click="del">删除选中项</Button>
		</div>
		<Table :data="tableData" :columns="columns" row-key="Id" :load-data="handleLoadData" @on-selection-change="selectionChange">
		</Table>
		<Modal title="新增页面接口" v-model="bNewPage" width="70%" @on-ok="submititem">
			<Form :model="formData" label-position="left" :label-width="80">
				<FormItem label="菜单名称">
					<Input v-model="formData.Name" placeholder="菜单名称" />
				</FormItem>
				<FormItem label="路由地址">
					<Input v-model="formData.Code" placeholder="相对路径,示例:/work/work" />
				</FormItem>
				<FormItem label="描述">
					<Input v-model="formData.Description" placeholder="描述" />
				</FormItem>
				<FormItem label="状态">
					<Select v-model="formData.Enabled" style="width:200px">
						<Option v-for="item in state" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
				<FormItem label="排序">
					<Input v-model="formData.OrderSort" style="width:200px" />
				</FormItem>
				<FormItem label="是否按钮">
					<Switch v-model="formData.IsButton" @on-change="IsButtonchange" />
				</FormItem>
				<FormItem label="按钮事件">
					<Input v-model="formData.Func" />
				</FormItem>
				<FormItem label="隐藏菜单">
					<Switch v-model="formData.IsHide" @on-change="IsHidechange" />
				</FormItem>
				<FormItem label="KeepAlive">
					<Switch v-model="formData.IskeepAlive" @on-change="IskeepAlivechange" />
				</FormItem>
				<FormItem label="icon">
					<Input v-model="formData.Icon" placeholder="图标,示例:&#xe715;" />
				</FormItem>
				<FormItem label="父级菜单">
					<Cascader :data="options" v-model="formData.PidArr"></Cascader>
				</FormItem>
				<FormItem label="API接口">
					<Select v-model="formData.Mid">
						<Option v-for="item in modules" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>

			</Form>
		</Modal>
		<Modal title="编辑项目" v-model="bEditModal" @on-ok="submit">
			<Form :model="editData" label-position="left" :label-width="80">
				<FormItem label="菜单名称">
					<Input v-model="editData.Name" />
				</FormItem>
				<FormItem label="菜单描述">
					<Input v-model="editData.Description" />
				</FormItem>
				<FormItem label="icon">
					<Input v-model="editData.Icon" />
				</FormItem>
				<FormItem label="页面路径">
					<Input v-model="editData.Code" />
				</FormItem>
				<FormItem label="接口路径">
					<Input v-model="editData.MName" />
				</FormItem>
			</Form>
		</Modal>
		<Modal title="确认删除!" v-model="bDeleteConfirmModal" @on-ok="confirmDel">
			<h1 class="red">您真的要删除这{{length}}项么?</h1>
			<li v-for="(item, index) in selectionItems" :key="index">id:{{item.id}} - {{item.name}}</li>
		</Modal>
	</div>
</template>

<script>
// import store from '@/store'
import { mapActions } from 'vuex'
import { getToken } from '@/libs/util'
import { getPermissionTreeTable, removePermission, editPermission, addPermission, getPermissionTree } from '@/api/data.js'

export default {
	name: 'menuManage',
	data () {
		return {
			tableData: [],
			columns: [
				{ type: 'selection', width: 60, key: 'sele' },
				{ title: 'Id', key: 'Id', width: 60 },
				{ title: '菜单', key: 'Name', tree: true },
				{ title: '菜单描述', key: 'Description' },
				{ title: '路由地址', key: 'Code' },
				{ title: 'API接口', key: 'MName' },
				{ title: '菜单icon', key: 'Icon' }
			],
			loading: false,
			bNewPage: false,
			formData: {
				Code: '',
				Name: '',
				IsHide: false,
				Pid: 0,
				Mid: 0,
				Enabled: 1,
				OrderSort: 0,
				IsButton: false,
				IskeepAlive: 0,
				Icon: '',
				Description: '',
				PidArr: [],
				MName: ''
			},
			selectionItems: [], // 当前被选中的项
			editData: {}, // 当前编辑项内容
			bEditModal: false,
			bDeleteConfirmModal: false,
			length: 0,
			state: [
				{ label: '激活', value: 1 },
				{ label: '禁用', value: 0 }
			],
			page: 1, // 分页查询页码
			filters: { // 筛选条件
				Name: ''
			},
			options: [], // 菜单节点
			modules: [] // api接口
		}
	},
	mounted () {
		// 获得菜单列表数据
		this.getTableData()
		// console.log(this.token)
	},
	computed: {
		token: function () {
			return getToken()
		}
	},
	methods: {
		...mapActions([
			'handleLogin'
		]),
		// 显示菜单列表
		getTableData () {
			let para = {
				page: this.page,
				key: this.filters.Name
			}
			getPermissionTreeTable(para).then(res => {
                console.log(res.data)
				let list = res.data.response
				if (list) {
					list.forEach(element => {
						if (element.hasChildren) {
							element = Object.assign(element, { _loading: false, children: [] })
						}
					})
					this.tableData = list
				}
			}).catch(err => {
				this.$Message['error']({
					background: true,
					content: err,
					duration: 3
				})
			})
		},
		// 选择项改变
		selectionChange (data) {
			console.log(data)
			this.selectionItems = data
		},
		// 编辑选中项
		edit () {
			if (this.selectionItems.length === 0) {
				this.$Message.info('当前没有选中菜单项')
			} else if (this.selectionItems.length > 1) {
				this.$Message.info('请选中其中一项')
			} else {
				this.bEditModal = true
				console.log(this.selectionItems[0])
				this.editData = this.selectionItems[0]
			}
		},
		// 打开新增的modal
		OpenModalNew () {
			this.bNewPage = true
			// 读取父节点 列表
			let para = { pid: 0 }
			getPermissionTree(para).then(res => {
				// this.options.push(res.data.response)
				console.log(res)
			})
			// 读取api 列表
		},
		// 删除选中项
		del () {
			if (this.selectionItems.length === 0) {
				this.$Message.info('当前没有选中菜单项')
			} else if (this.selectionItems.length > 1) {
				this.$Message.info('请选中其中一项')
			} else {
				this.bDeleteConfirmModal = true
			}
		},
		// 根据菜单id 删除菜单
		confirmDel () {
			let para = {
				id: this.selectionItems[0].id
			}
			removePermission(para).then(res => {
				console.log(res.data)
			})
			// 删除完之后 清空
			this.selectionItems = []
			this.getTableData()
		},
		// 提交修改
		submit () {
			let para = this.editData
			console.log(para)
			editPermission(para).then(res => {
				console.log(res.data)
				// 修改完后 清理数据
				this.editData = {}
				this.selectionItems = []
				// 重新获得列表数据
				this.getTableData()
			})
		},
		// 新增页面
		submititem () {
			let para = this.formData
			console.log(para)
			addPermission(para).then(res => {
                console.log(res.data)
			})
		},
		// 异步树形数据加载
		handleLoadData (item, callback) {
			let para = {
				f: item.Id
			}
			getPermissionTreeTable(para).then(res => {
				let list = res.data.response
				list.forEach(element => {
					if (element.hasChildren) {
						element = Object.assign(element, { _loading: false, children: [] })
					}
				})
				callback(list)
			})
		},
		IsButtonchange (val) {
			this.formData.IsButton = val
		},
		IsHidechange (val) {
			this.formData.IsHide = val
		},
		IskeepAlivechange (val) {
			this.formData.IskeepAlive = val
		}
	}
}

/*
import util from '../../../util/date'
import { getPermissionListPage, getPermissionTreeTable, removePermission, editPermission, addPermission, getPermissionTree, getModuleListPage } from '../../api/api';
import { getButtonList } from "../../promissionRouter";
import Toolbar from "../../components/Toolbar";

export default {
	components: { Toolbar },
	data () {
		return {
			buttonList: [],
			currentRow: null,
			options: [],
			filters: {
				Name: ''
			},
			users: [],
			modules: [], // 接口api列表
			statusList: [{ Name: '激活', value: true }, { Name: '禁用', value: false }],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [], // 列表选中列

			addDialogFormVisible: false,
			editFormVisible: false, // 编辑界面是否显示
			editLoading: false,
			editFormRules: {
				Name: [
					{ required: true, message: '请输入菜单名称', trigger: 'blur' }
				],
				Code: [
					{ required: true, message: '请输入路由地址', trigger: 'blur' }
				]
			},
			// 编辑界面数据
			editForm: {
				Id: 0,
				Mid: 0,
				OrderSort: 0,
				PidArr: [],
				CreateBy: '',
				Name: '',
				Code: '',
				Description: '',
				Icon: '',
				Func: '',
				Enabled: true,
				IsButton: false,
				IsHide: false,
				IskeepAlive: false
			},

			addFormVisible: false, // 新增界面是否显示
			addLoading: false,
			addFormRules: {
				Name: [
					{ required: true, message: '请输入菜单名称', trigger: 'blur' }
				],
				Code: [
					{ required: true, message: '请输入路由地址', trigger: 'blur' }
				]
			},
			// 新增界面数据
			addForm: {
				CreateBy: '',
				CreateId: '',
				PidArr: [],
				Mid: 0,
				OrderSort: 0,
				Name: '',
				Code: '',
				Description: '',
				Icon: '',
				Func: '',
				Enabled: true,
				IsButton: false,
				IsHide: false,
				IskeepAlive: false
			}
		}
	},
	methods: {
		selectCurrentRow (val) {
			this.currentRow = val
		},
		callFunction (item) {
			this.filters = {
				name: item.search
			}
			this[item.Func].apply(this, item)
		},
		// 性别显示转换
		formatEnabled: function (row, column) {
			return row.Enabled ? '正常' : '未知'
		},
		formatCreateTime: function (row, column) {
			return (!row.CreateTime || row.CreateTime === '') ? '' : util.formatDate.format(new Date(row.CreateTime), 'yyyy-MM-dd')
		},
		handleCurrentChange (val) {
			this.page = val
			this.getPermissions()
		},
		load (tree, treeNode, resolve) {
			let para = {
				page: this.page,
				f: tree.Id,
				key: this.filters.Name
			}
			getPermissionTreeTable(para).then((res) => {
				resolve(res.data.response)
			})
		},
		// 获取用户列表
		getPermissions () {
			let para = {
				page: this.page,
				key: this.filters.Name
			}
			this.listLoading = true

			// NProgress.start();
			getPermissionTreeTable(para).then((res) => {
				this.users = res.data.response
				this.listLoading = false
				// NProgress.done();
			})
		},
		// 删除
		handleDel () {
			let row = this.currentRow
			if (!row) {
				this.$message({
					message: '请选择要删除的一行数据！',
					type: 'error'
				})
				return
			}
			this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true
				// NProgress.start();
				let para = { id: row.Id }
				removePermission(para).then((res) => {
					if (util.isEmt.format(res)) {
						this.listLoading = false
						return
					}
					this.listLoading = false
					// NProgress.done();
					if (res.data.success) {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						})
					}

					this.getPermissions()
				})
			}).catch(() => {

			})
		},
		// 显示编辑界面
		handleEdit () {
			let row = this.currentRow
			if (!row) {
				this.$message({
					message: '请选择要编辑的一行数据！',
					type: 'error'
				})

				return
			}
			let that = this
			that.editLoading = true

			this.editFormVisible = true
			this.editForm = {}

			this.options = []
			let para = { pid: row.Id }
			getPermissionTree(para).then((res) => {
				this.options.push(res.data.response)
				that.editForm = Object.assign({}, row)
				that.editLoading = false
			})
		},
		// 显示新增界面
		handleAdd () {
			this.options = []
			this.addFormVisible = true
			this.addForm = {
				CreateBy: '',
				CreateId: '',
				PidArr: [],
				Name: '',
				Code: '',
				OrderSort: 0,
				Description: '',
				Enabled: true,
				Icon: '',
				IsButton: false,
				IsHide: false,
				IskeepAlive: false
			}

			let para = { pid: 0 }
			getPermissionTree(para).then((res) => {
				this.options.push(res.data.response)
			})
		},
		// 编辑
		editSubmit: function () {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						// NProgress.start();
						let para = Object.assign({}, this.editForm)

						para.ModifyTime = util.formatDate.format(new Date(), 'yyyy-MM-dd')

						para.Pid = para.PidArr.pop()

						if (para.Id === para.Pid) {
							this.$message({
								message: '警告，父节点不能是自己！',
								type: 'error'
							})

							this.editLoading = false
							return
						}
						editPermission(para).then((res) => {
							if (util.isEmt.format(res)) {
								this.editLoading = false
								return
							}
							this.editLoading = false
							if (res.data.success) {
								this.editLoading = false
								// NProgress.done();
								this.$message({
									message: res.data.msg,
									type: 'success'
								})
								this.$refs['editForm'].resetFields()
								this.editFormVisible = false
								this.getPermissions()
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								})
							}
						})
					})
				}
			})
		},
		// 新增
		addSubmit: function () {
			let _this = this
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true
						// NProgress.start();
						let para = Object.assign({}, this.addForm)

						para.CreateTime = util.formatDate.format(new Date(), 'yyyy-MM-dd')
						para.ModifyTime = para.CreateTime
						para.IsDeleted = false

						para.Pid = para.PidArr.pop()

						var user = JSON.parse(window.localStorage.user)

						if (user && user.uID > 0) {
							para.CreateId = user.uID
							para.CreateBy = user.uRealName
						} else {
							this.$message({
								message: '用户信息为空，先登录',
								type: 'error'
							})
							_this.$router.replace(_this.$route.query.redirect ? _this.$route.query.redirect : '/')
						}
						addPermission(para).then((res) => {
							if (util.isEmt.format(res)) {
								this.addLoading = false
								return
							}
							this.addLoading = false
							if (res.data.success) {
								this.addLoading = false
								// NProgress.done();
								this.$message({
									message: res.data.msg,
									type: 'success'
								})
								this.$refs['addForm'].resetFields()
								this.addFormVisible = false
								this.getPermissions()
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								})
							}
						})
					})
				}
			})
		},
		selsChange: function (sels) {
			this.sels = sels
		},
		// 批量删除
		batchRemove: function () {
			this.$message({
				message: '该功能未开放',
				type: 'warning'
			})
		}
	},
	mounted () {
		this.getPermissions()

		getModuleListPage().then((res) => {
			this.modules = res.data.response.data
		})
		let routers = window.localStorage.router
			? JSON.parse(window.localStorage.router)
			: []
		this.buttonList = getButtonList(this.$route.path, routers)
	}
}
*/
</script>

<style scoped>
.toolBar {
	margin-bottom: 20px;
}
.toolBar button {
	margin-right: 5px;
}
.red {
	font-weight: bold;
	color: red;
}
</style>
