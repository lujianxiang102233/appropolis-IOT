<template>
  <div class="compaines" >
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="first">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item class="two">角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="roleQuery">
    <el-form v-model="formInline" :inline="true" class="clearfix demo-form-inline" ref="formInline">
      <div class="filter">筛选</div>
      <el-form-item label="角色名称" class="roleName">
        <el-input v-model="formInline.roleName" size="mini" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" class="roleState">
        <el-select v-model="formInline.roleState" size="mini" placeholder="请选择" class="select">
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
     <el-button type="primary" class="top-button"  size="mini" @click="addDalogVisible = true" v-if="coList.indexOf('permission_role_add')>-1"><img src="../../assets/images/role-icon.png"  class="fl"> <span class="btn-text fr">新建角色</span></el-button>
     <el-table
      ref="table"
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
       align="center"
        label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.roleName === 'super_admin'">---</span>
            <span v-else>
              <el-button class="operation" v-if="coList.indexOf('permission_role_edit')>-1" plain @click="editAdmin(scope.row)">编辑</el-button>
              <el-button class="operation last" :disabled="scope.row.enable?false:true" v-if="coList.indexOf('permission_role_user')>-1" plain @click="userBtn(scope.row)">成员</el-button>
              <el-button class="operation last" v-if="coList.indexOf('permission_role_auth')>-1" plain @click="jump(scope.row)">权限</el-button>
              <el-button class="operation last delete" v-if="coList.indexOf('permission_role_del')>-1" plain @click="del(scope.row)">删除</el-button>
          </span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      title="新增/编辑角色"
      :visible.sync="addDalogVisible"
      :before-close="addHandleClose"
      :close-on-click-modal=false>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="enable" class="dRadio">
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
      :close-on-click-modal=false>
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="adminLoginName" class="dRadio">
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
      :before-close="tipHandleClose"
      :close-on-click-modal=false
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
      ref="userForm">
      <el-transfer
        ref="transfer"
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
    <div class="noText" v-else>您没有当前api访问权限 ~</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleQuery: '',
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
            trigger: 'blur'
          }
        ],
        remark: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      companyName: '',
      pageIndex: 1,
      pageSize: 10,
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
      this.roleQuery = localStorage
        .getItem('points')
        .includes('permission_role_query')
      this.companyId = localStorage.getItem('companyId')
      let getUrl = `/role/${this.companyId}/${this.formInline.roleName}/${
        this.formInline.roleState
      }/${this.pageIndex}/${this.pageSize}`
      if (this.formInline.roleName.length === 0) {
        getUrl = `/role/${this.companyId}/{roleName}/${
          this.formInline.roleState
        }/${this.pageIndex}/${this.pageSize}`
      }
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
              this.pageIndex = 1
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
              this.pageIndex = 1
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
        name: 'role-access',
        // query: { roleId: row.roleId },
        // params: { roleName: row.roleName }
        query: { roleId: row.roleId, roleName: row.roleName }
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
      this.$refs.transfer.$children[0].query = ''
      this.$refs.transfer.$children[3].query = ''
    },
    tipHandleClose(done) {
      done()
      this.getList()
    },
    userCancel() {
      this.userDialogVisible = false
      this.leftList.splice(0, this.leftList.length)
      this.rightList.splice(0, this.rightList.length)
      this.$refs.transfer.$children[0].query = ''
      this.$refs.transfer.$children[3].query = ''
    },
    leftHhandleChange(value) {
      this.leftList = value
    },
    rightHandleChange(value) {
      this.rightList = value
    },
    flexTableHeight() {
      this.tableHeight =
        document.documentElement.clientHeight -
        (this.$refs.formInline.$el.offsetHeight + 245)
    },
    fixedTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 320
    }
  },
  created() {
    this.getList()
    if (this.roleQuery) {
      this.$nextTick(() => {
        this.flexTableHeight()
      })
      this.fixedTableHeight()
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.flexTableHeight()
      })()
    }
  },
  beforeDestroy() {
    window.onresize = () => {
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-breadcrumb__item {
  height: 58px;
  line-height: 58px;
  /deep/ .el-breadcrumb__inner {
    font-size: 16px;
  }
  &.first {
    /deep/ .el-breadcrumb__inner,
    /deep/ .el-breadcrumb__separator {
      color: #3e3f42;
      font-weight: 700;
    }
  }
  &.two {
    /deep/ .el-breadcrumb__inner {
      color: #9ea0a5;
    }
  }
}
.demo-form-inline {
  border: 1px solid #ebeef5;
  min-height: 60px;
  .el-form-item {
    margin-bottom: 0;
    height: 64px;
    line-height: 64px;
    padding-left: 30px;
    /deep/ .el-form-item__label {
      padding-right: 20px;
      font-size: 16px;
    }
    /deep/ .el-form-item__content {
      height: 64px;
      line-height: 64px;
      width: 169px;
      margin-right: 20px;
      .filter-ipt .el-input__inner {
        height: 36px;
        width: 160px;
      }
      .el-button {
        height: 36px;
        width: 105px;
        letter-spacing: 20px;
        text-indent: 15px;
        font-size: 14px;
      }
      .el-button--default span {
        color: #606266;
      }
      .el-button--primary {
        background-color: #1989fa;
      }
    }
  }
  .el-form-item.roleState {
    padding-left: 0px;
    /deep/ .el-select .el-input__inner {
      height: 36px;
      width: 172px;
    }
  }
  .el-form-item.fr {
    /deep/ .el-form-item__content {
      width: 225px;
    }
  }
  .filter {
    font-size: 16px;
    font-weight: bold;
    height: 41px;
    line-height: 41px;
    padding-left: 58px;
    position: relative;
    border-bottom: 1px solid #ebeef5;
    &::before {
      content: '';
      height: 16px;
      width: 16px;
      background: url(../../assets/images/icon_筛选.png) no-repeat center center;
      position: absolute;
      top: 13px;
      left: 30px;
    }
  }
}
.el-table {
  border: 1px solid #ebeef5;
}
.el-pagination {
  float: right;
  margin-top: 10px;
}
// .el-input {
//   /deep/ .el-input__inner {
//     width: 120px;
//   }
// }
.el-input.filter-ipt {
  /deep/ .el-input__inner {
    height: 30px;
  }
}
.top-button {
  width: 140px;
}
</style>
