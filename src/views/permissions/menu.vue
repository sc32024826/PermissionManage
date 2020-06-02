<template>
	<div>
		<div class="toolBar">
			<Button type="primary" icon="md-add" @click="addItem">增加</Button>
			<Button type="warning" icon="md-create" @click="edit">修改选中项</Button>
			<Button type="error" icon="md-trash" @click="del">删除选中项</Button>
		</div>
		<Table :data="tableData" :columns="columns" row-key="Id" :load-data="handleLoadData" @on-selection-change="selectionChange">
		</Table>
		<Modal title="新增页面接口" v-model="bNewPage" width="70%" @ok="submititem">
			<Form :model="formData" label-position="left" :label-width="80">
				<FormItem label="菜单名称">
					<Input v-model="formData.name" placeholder="菜单名称" />
				</FormItem>
				<FormItem label="页面路径">
					<Input v-model="formData.url" placeholder="相对路径,示例:/work/work" />
				</FormItem>
				<FormItem label="接口路径">
					<Input v-model="formData.api" placeholder="API接口,示例:/api/work/work" />
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
import axios from 'axios'
import { mapActions } from 'vuex'
import { getToken } from '@/libs/util'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

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
			formData: {},
			selectionItems: [], // 当前被选中的项
			editData: {}, // 当前编辑项内容
			bEditModal: false,
			bDeleteConfirmModal: false,
			length: 0
		}
	},
	mounted () {
		// 获得菜单列表数据
		this.isLogin()
		// console.log(baseUrl)
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
		// 判断是否登录
		isLogin () {
			console.log(this.token)

			if (this.token !== 'undefined') {
				console.log('token')
				this.getTableData()
			} else {
				// 跳转到登录页面
				console.log('跳转到登录页面')
				debugger
				this.getTableData()
			}
		},
		// 显示菜单列表
		getTableData () {
			axios({
				url: baseUrl + '/api/Permission/GetTreeTable',
				methods: 'GET'
			}).then((res) => {
				let list = res.data.response
				list.forEach(element => {
					if (element.hasChildren) {
						element = Object.assign(element, { _loading: false, children: [] })
					}
				})
				this.tableData = list
				console.log(list)
			}).catch((err) => {
				console.log(err)
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
		addItem () {
			this.bNewPage = true
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
        // 删除选中项
		del () {
			if (this.selectionItems.length === 0) {
				this.$Message.info('当前没有选中菜单项')
			} else {
				this.length = this.selectionItems.length
				this.bDeleteConfirmModal = true
			}
		},
		// 根据菜单id 删除菜单
		confirmDel () {
			let _this = this
			console.log(this.selectionItems)
			_this.selectionItems.forEach(v => {
				axios({
					url: baseUrl + '/api/Permission/Delete',
					method: 'DELETE',
					params: { id: v.id },
					headers: {
						'Authorization': 'Bearer ' + _this.token
					}
				}).then(res => {
					_this.$Message.info(res.data.msg)
				}).catch(err => {
					_this.$Message.info(err)
				})
			})
			// 删除完之后 清空
			_this.selectionItems = []
			_this.getTableData()
		},
		// 提交修改
		submit () {
			let _this = this
			console.log(_this.editData)
			let req = _this.editData
			console.log(req)
			axios({
				url: baseUrl + '/api/Permission/Put',
				method: 'PUT',
				data: req,
				headers: {
					'Authorization': 'Bearer ' + _this.token
				}
			}).then(res => {
				console.log(res)
				_this.$Message['success']({
					background: true,
					content: res.data.msg,
					duration: 10
				})
			}).catch(err => {
				console.log(err)
			})
			// 修改完后 清理数据
            _this.editData = {}
            _this.selectionItems = []
			// 重新获得列表数据
			_this.getTableData()
		},
		// 新增页面
		submititem () {

		},
		// 异步树形数据加载
		handleLoadData (item, callback) {
			axios({
				url: baseUrl + '/api/Permission/GetTreeTable',
				params: { f: item.Id },
				methods: 'GET'
			}).then((res) => {
				let list = res.data.response
				list.forEach(element => {
					if (element.hasChildren) {
						element = Object.assign(element, { _loading: false, children: [] })
					}
				})
				callback(list)
			})
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
