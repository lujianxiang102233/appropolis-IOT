<template>
  <div class="compaines" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_user_query')>-1">
      <div class="filter">筛选</div>
      <el-form-item label="用户名">
        <el-input v-model="roleName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="roleState" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-input v-model="roleName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_user_add')>-1">+ 新增用户</el-button>
     <el-button type="warning" style="margin-top: 10px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_user_reset')>-1">+ 重置用户密码</el-button>
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="loginName"
        label="用户名"
        width="140">
      </el-table-column>
      <el-table-column
        prop="name"
        label="真实姓名"
        width="160">
      </el-table-column>
      <el-table-column
        prop="roleList"
        label="角色"
        width="130">
      </el-table-column>
      <el-table-column
        label="电话/电子邮箱"
        width="130">
        <template slot-scope="scope">
            <div class="elli" :title="[scope.row.phone+'/'+scope.row.email]">{{scope.row.phone}}/{{scope.row.email}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="130">
        <template slot-scope="scope">
            <el-switch
            v-model="scope.row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-if="scope.row.enable !== -1"
            @change="changeStatus(scope.row)">
          </el-switch>
          <span v-if="scope.row.enable === -1">---</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createDate | time}}
          </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="最后登录时间">
          <template slot-scope="scope">
            {{ scope.row.createDate | time}}
          </template>
      </el-table-column>
      <el-table-column
       width="180"
        label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_user_edit')>-1" plain @click="editAdmin(scope.row)">编辑</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_user_auth')>-1" plain @click="jump(scope.row)">授权</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="pageIndex"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      title="新增/编辑角色"
      :visible.sync="addDalogVisible"
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
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增/编辑角色"
      :visible.sync="editDalogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" prop="adminLoginName">
          <el-radio v-model="addForm.enable" :label="1">开启</el-radio>
          <el-radio v-model="addForm.enable" :label="0">关闭</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取 消</el-button>
        <el-button type="primary" @click="edit('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认要停用{{ tableData.roleName }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stateCancel">取 消</el-button>
        <el-button type="primary" @click="stateTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      addDalogVisible: false,
      resetDalogVisible: false,
      dialogVisible: false,
      editDalogVisible: false,
      addForm: {
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
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,50}$/,
            message: '最长50个中文字符',
            trigger: 'change'
          }
        ],
        remark: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,50}$/,
            message: '最长50个中文字符',
            trigger: 'change'
          }
        ]
      },
      companyName: '',
      pageIndex: 1,
      pageSize: 5,
      total: 1,
      roleName: '',
      roleState: '',
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
      enable: ''
    }
  },
  methods: {
    onSubmit() {
      this.getList()
    },
    resetForm(formName) {
      this.roleName = ''
      this.roleState = ''
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
      let getUrl = `/employee/${this.companyId}/{loginName}/2/{role}/${
        this.pageIndex
      }/${this.pageSize}`
      //   if (this.roleName.length === 0) {
      //     getUrl = `/role/${this.companyId}/{roleName}/2/${this.pageIndex}/${
      //       this.pageSize
      //     }`
      //   }
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
      if (code === -3005) {
        this.$message.error(`执行权限异常`)
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
            this.addForm.roleName = ''
            this.addForm.remark = ''
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
        this.$message.success(`修改角色状态成功`)
        this.roleState = status
      }
      this.dialogVisible = false
    },
    stateCancel() {
      this.dialogVisible = false
      this.getList()
    },
    changeStatus(row) {
      this.dialogVisible = true
      let { roleId, enable } = row
      this.roleId = roleId
      this.enable = enable
    },
    editAdmin(row) {
      this.editDalogVisible = true
      console.log(row)
      let { enable, remark, roleId, roleName } = row
      this.addForm.enable = Number(enable ? '1' : '0')
      this.addForm.roleName = roleName
      this.addForm.roleId = roleId
      this.addForm.remark = remark
    },
    editCancel() {
      this.editDalogVisible = false
      this.addForm.enable = 1
      this.addForm.roleName = ''
      this.addForm.roleId = ''
      this.addForm.remark = ''
      this.addDalogVisible = false
    },
    addCancel() {
      this.addDalogVisible = false
      this.addForm.enable = 1
      this.addForm.roleName = ''
      this.addForm.roleId = ''
      this.addForm.remark = ''
      this.addDalogVisible = false
    },
    edit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(
            `/role/${this.addForm.roleId}`,
            this.addForm
          )
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
            this.editDalogVisible = false
            this.addForm.roleName = ''
            this.addForm.remark = ''
          }
        } else {
          return false
        }
      })
    },
    del(row) {
      console.log(row)
      let { roleId, roleName, roleCount } = row
      // console.log(roleId, roleName, roleCount)
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
    }
  },
  created() {
    this.getList()
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
  height: 60px;
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
    width: 70%;
  }
}
.el-input.filter-ipt {
  /deep/ .el-input__inner {
    height: 30px;
  }
}
.el-table {
  /deep/ .cell .elli {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 10em;
    height: 23px;
    line-height: 23px;
    // font-size: 12px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .el-table__row {
    height: 50px;
    line-height: 50px;
    color: red;
  }
}
</style>
