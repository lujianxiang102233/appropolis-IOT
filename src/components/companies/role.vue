<template>
  <div class="compaines" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form v-model="formInline" :inline="true" class="clearfix demo-form-inline" ref="formInline" v-if="coList.indexOf('permission_role_query')>-1">
      <div class="filter">筛选</div>
      <el-form-item label="角色名称">
        <el-input v-model="formInline.roleName" size="mini" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-select v-model="formInline.roleState" size="mini" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        <el-button @click="resetForm('formInline')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="mini" @click="addDalogVisible = true" v-if="coList.indexOf('permission_role_add')>-1">+ 新建角色</el-button>
     <el-table
      :data="tableData"
      :height='tableHeight'
      style="width: 100%">
      <el-table-column
        prop="roleName"
        label="角色名称"
        align="center"
        width="140">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="角色描述"
        align="center"
        width="160">
      </el-table-column>
      <el-table-column
        prop="roleCount"
        label="角色人数"
        align="center"
        width="130">
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.roleName === 'super_admin'">---</span>
          <span v-else>
            <el-switch
            v-model="scope.row.enable"
            active-color="#409EFF"
            inactive-color="#C0C0C0"
            v-if="scope.row.enable !== -1"
            @change="changeStatus(scope.row)">
          </el-switch>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="170"
        align="center"
        label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createDate | time}}
          </template>
      </el-table-column>
      <el-table-column
       width="300"
       align="center"
        label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.roleName === 'super_admin'">---</span>
            <span v-else>
              <el-button type="primary" size="mini" v-if="coList.indexOf('permission_role_edit')>-1" plain @click="editAdmin(scope.row)">编辑</el-button>
              <el-button type="success" size="mini" v-if="coList.indexOf('permission_role_user')>-1" plain @click="userBtn(scope.row)"  :disabled="scope.row.enable?false:true">成员</el-button>
              <el-button type="success" size="mini" v-if="coList.indexOf('permission_role_auth')>-1" plain @click="jump(scope.row)">权限</el-button>
              <el-button type="success" size="mini" v-if="coList.indexOf('permission_role_del')>-1" plain @click="del(scope.row)">删除</el-button>
          </span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="pageIndex"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      title="新增/编辑角色"
      :visible.sync="addDalogVisible"
      :before-close="addHandleClose"
      :close-on-click-modal=false
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="enable">
          <el-radio v-model="addForm.enable" :label="1">开启</el-radio>
          <el-radio v-model="addForm.enable" :label="0">关闭</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增/编辑角色"
      :visible.sync="editDalogVisible"
      :before-close="editHandleClose"
      :close-on-click-modal=false
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="adminLoginName">
          <el-radio v-model="editForm.enable" :label="1">开启</el-radio>
          <el-radio v-model="editForm.enable" :label="0">关闭</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span v-if="enable===false">确认要停用【{{ stateName }}】吗？</span>
      <span v-else>确认要启用【{{ stateName }}】吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateCancel">取 消</el-button>
        <el-button type="primary" @click="stateTrue">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色成员编辑"
      :visible.sync="userDialogVisible"
      :before-close="userHandleClose"
      :close-on-click-modal=false
      ref="userForm"
      width="50%">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        v-model="userForm.value2"
        :titles="['公司成员', '角色成员(角色名称)']"
        @left-check-change="leftHhandleChange"
        @right-check-change="rightHandleChange"
        :data="data2">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userCancel">取 消</el-button>
        <el-button type="primary" @click="members">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableHeight: '',
      data2: [],
      userForm: {
        value2: []
      },
      filterMethod(query, item) {
        return item.cities.indexOf(query) > -1
      },
      tableData: [],
      addDalogVisible: false,
      resetDalogVisible: false,
      dialogVisible: false,
      editDalogVisible: false,
      userDialogVisible: false,
      addForm: {
        roleName: '',
        remark: '',
        enable: 1
      },
      editForm: {
        roleName: '',
        remark: '',
        enable: 1,
        roleId: ''
      },
      retForm: {
        adminLoginName: '',
        retAdminPassword: '',
        retCheckAdminPassword: '',
        companyName: '',
        companyId: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'change'
          }
        ],
        remark: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'change'
          }
        ]
      },
      companyName: '',
      pageIndex: 1,
      pageSize: 5,
      total: 1,
      formInline: {
        roleName: '',
        roleState: '2'
      },
      coList: [],
      options: [
        {
          value: '2',
          label: '全部'
        },
        {
          value: '1',
          label: '开启'
        },
        {
          value: '0',
          label: '关闭'
        }
      ],
      companyId: '',
      roleId: '',
      enable: '',
      stateName: '',
      epyPageIndex: 1,
      epyPageSize: 1000,
      leftList: [],
      rightList: []
    }
  },
  methods: {
    onSubmit() {
      this.pageIndex = 1
      this.getList()
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.formInline.roleName = ''
      this.formInline.roleState = '2'
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getList()
    },
    async getList() {
      this.coList = JSON.parse(localStorage.getItem('points'))
      this.companyId = localStorage.getItem('companyId')
      let getUrl = `/role/${this.companyId}/${this.formInline.roleName}/${
        this.formInline.roleState
      }/${this.pageIndex}/${this.pageSize}`
      if (this.formInline.roleName.length === 0) {
        getUrl = `/role/${this.companyId}/{roleName}/${
          this.formInline.roleState
        }/${this.pageIndex}/${this.pageSize}`
      }
      // console.log(getUrl)
      let res = await this.axios.get(getUrl)
      res.data.content.data.list.forEach(function(v, i) {
        if (v.enable === 1) {
          v.enable = true
        }
        if (v.enable === 0) {
          v.enable = false
        }
      })
      let {
        code,
        data: { list, total }
      } = res.data.content
      if (code === 0) {
        this.tableData = list
        // console.log(list)
        this.total = total
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
    },
    add(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.post(`/role`, this.addForm)
          let { code } = res.data.content
          if (code === +-3015) {
            this.$message.error(`角色已存在`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.$message.success(`新建角色成功`)
            this.getList()
            this.addDalogVisible = false
            this.$refs[formName].resetFields()
          }
        } else {
          return false
        }
      })
    },
    async stateTrue() {
      let status = this.enable ? '1' : '0'
      let res = await this.axios.put(`/role/${this.roleId}/${status}`)
      let { code } = res.data.content
      if (code === +-9999) {
        this.$message.error(`Exception Message`)
      }
      if (code === +0) {
        console.log(this.enable)
        if (this.enable === false) {
          this.$message(`【${this.stateName}】已停用`)
        }
        if (this.enable === true) {
          this.$message.success(`【${this.stateName}】已启用`)
        }
        // this.roleState = status
        this.getList()
        this.roleId = ''
      }
      this.dialogVisible = false
    },
    stateCancel() {
      this.dialogVisible = false
      this.getList()
    },
    changeStatus(row) {
      this.dialogVisible = true
      let { roleId, enable, roleName } = row
      this.roleId = roleId
      this.enable = enable
      this.stateName = roleName
    },
    editAdmin(row) {
      this.editDalogVisible = true
      let { enable, remark, roleId, roleName } = row
      this.editForm.enable = Number(enable ? '1' : '0')
      this.editForm.roleName = roleName
      this.editForm.roleId = roleId
      this.editForm.remark = remark
    },
    editCancel(formName) {
      this.editDalogVisible = false
      this.$refs[formName].resetFields()
    },
    addCancel(formName) {
      this.addDalogVisible = false
      this.$refs[formName].resetFields()
    },
    edit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(
            `/role/${this.editForm.roleId}`,
            this.editForm
          )
          console.log(res)
          let { code } = res.data.content
          if (code === +-3015) {
            this.$message.error(`角色已存在`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.$message.success(`编辑角色成功`)
            this.getList()
            this.editDalogVisible = false
            this.$refs[formName].resetFields()
          }
        } else {
          return false
        }
      })
    },
    del(row) {
      let { roleId, roleName, roleCount } = row
      if (roleCount === 0) {
        this.$confirm('确定要删除【' + roleName + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            let res = await this.axios.delete(`/role/${roleId}/${roleName}`)
            let { code } = res.data.content
            if (code === +0) {
              this.$message.success('【' + roleName + '】' + '已删除')
              this.getList()
            }
            if (code === -9999) {
              this.$message.error('Exception Message')
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$confirm(
          '【' +
            roleName +
            '】下共有【' +
            roleCount +
            '】名用户，删除角色后用户将取消相应角色及其授权，是否继续',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(async () => {
            let res = await this.axios.delete(`/role/${roleId}/${roleName}`)
            let { code } = res.data.content
            if (code === +0) {
              this.$message.success('【' + roleName + '】' + '已删除')
              this.getList()
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    async userBtn(row) {
      this.roleId = row.roleId
      this.userDialogVisible = true
      let getUrl = `/employee/${this.companyId}/{loginName}/-99/{role}/${
        this.epyPageIndex
      }/${this.epyPageSize}`
      let res = await this.axios.get(getUrl)
      let { list } = res.data.content.data
      let datas = list.map(function(item) {
        return {
          label: item.name + '(' + item.loginName + ')',
          key: item.employeeId,
          cities: item.name + '(' + item.loginName + ')'
        }
      })
      this.data2 = datas
      let res2 = await this.axios.get(`/role/members/${row.roleId}`)
      let { code, data } = res2.data.content
      if (code === 0) {
        this.userForm.value2 = data.map(item => {
          return item.employeeId
        })
      }
      if (code === -9999) {
        this.$message.error('Exception Message')
      }
    },
    jump(row) {
      this.$router.push({
        name: 'roleaccess',
        query: { roleId: row.roleId },
        params: { roleName: row.roleName }
      })
    },
    async editMembers() {
      let res = await this.axios.put(
        `/role/members/${this.roleId}`,
        this.userForm.value2
      )
      let { code } = res.data.content
      if (code === 0) {
        this.getList()
        this.roleId = ''
        this.userDialogVisible = false
        this.$message.success('角色成员编辑成功')
      }
      if (code === -9999) {
        this.$message.error('Exception Message')
      }
    },
    members() {
      if (this.userForm.value2.length <= 0) {
        this.$confirm('角色尚未设置用户成员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.editMembers()
          })
          .catch(() => {})
      } else {
        this.editMembers()
      }
    },
    addHandleClose(done) {
      done()
      this.$refs.addForm.resetFields()
    },
    editHandleClose(done) {
      done()
      this.$refs.editForm.resetFields()
    },
    userHandleClose(done) {
      done()
      this.leftList.splice(0, this.leftList.length)
      this.rightList.splice(0, this.rightList.length)
    },
    userCancel() {
      this.userDialogVisible = false
      this.leftList.splice(0, this.leftList.length)
      this.rightList.splice(0, this.rightList.length)
    },
    leftHhandleChange(value) {
      this.leftList = value
    },
    rightHandleChange(value) {
      this.rightList = value
    }
  },
  created() {
    this.getList()
    this.tableHeight = document.documentElement.clientHeight - 320
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.documentElement.clientHeight - 320
      })()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-breadcrumb__item {
  /deep/ .el-breadcrumb__inner {
    color: #999;
  }
}
.demo-form-inline {
  border: 1px solid #999;
  margin-top: 10px;
  padding: 10px;
  min-height: 60px;
  .el-form-item {
    margin-bottom: 0;
  }
  .filter {
    font-size: 14px;
    font-weight: bold;
  }
}
.el-table {
  border: 1px solid #999;
  margin-top: 10px;
}
.el-dialog__wrapper {
  /deep/ .el-dialog {
    .el-dialog__header {
      background-color: #3ba1ff !important;
      .el-dialog__title {
        color: #fff;
      }
    }
  }
}
.el-pagination {
  float: right;
  margin-top: 10px;
}
.el-input {
  /deep/ .el-input__inner {
    width: 120px;
  }
}
.el-input.filter-ipt {
  /deep/ .el-input__inner {
    height: 30px;
  }
}
.el-transfer {
  /deep/ .el-transfer-panel {
    width: 230px;
  }
}
</style>
