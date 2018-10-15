<template>
  <div class="compaines" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_role_query')>-1">
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
      <el-form-item label="用户名">
        <el-input v-model="roleName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="medium" @click="addClick" v-if="coList.indexOf('permission_user_add')>-1">+ 新增用户</el-button>
     <el-table
      :data="tableData"
      height="310"
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
        width="130"
        label="角色">
          <template slot-scope="scope">
            <div class="elli" :title="scope.row.newRoleList">{{ scope.row.newRoleList}}</div>
          </template>
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
          <span v-if="scope.row.enable == 1" style="color:red;">开启</span>
          <span v-else-if="scope.row.enable == 0">关闭</span>
          <span v-else-if="scope.row.enable == 2">锁定</span>
          <span v-else>--</span>
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
        label="创建最后登录时间">
          <template slot-scope="scope">
            {{ scope.row.lastLoginDate | time}}
          </template>
      </el-table-column>
      <el-table-column
       width="280"
        label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_user_edit')>-1" plain @click="editAdmin(scope.row)">编辑</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_user_auth')>-1" plain @click="jump(scope.row)">授权管理</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_user_reset')>-1" plain @click="jump(scope.row)">成员重置</el-button>
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
      title="新建用户"
      :visible.sync="addDalogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="loginName">
          <el-input  :disabled="disabled" v-model="addForm.loginName" placeholder="请输入" @blur="output"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input  v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input  v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="RoleList">
          <!-- <el-input  v-model="addForm.RoleList"></el-input> -->
          <el-select v-model="value5" multiple placeholder="请选择">
            <el-option
              v-for="item in addOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        <el-button @click="editCancel">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
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
      disabled: false,
      addForm: {
        loginName: '',
        name: '',
        password: '',
        phone: '',
        email: '',
        RoleList: ''
      },
      editForm: {
        roleName: '',
        remark: '',
        enable: 1,
        roleId: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]*$/,
            message:
              '仅限中英文字符及英文下划线”_”、中划线”-“。最长50个中文字符',
            trigger: 'change'
          }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
            message:
              '仅限中英文字符及英文下划线”_”、中划线”-“。最长50个中文字符',
            trigger: 'change'
          }
        ],
        phone: [
          { required: false, message: '请输入', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'change'
          }
        ],
        email: [
          { required: false, message: '请输入', trigger: 'blur' },
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
      addOptions: [],
      value5: [],
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
        list.forEach(function(item) {
          let roleList = item.roleList
          if (roleList.length === 0) return '暂无数据'
          let newData = roleList.map(function(sub) {
            return sub.roleName
          })
          return (item.newRoleList = newData.join(','))
        })
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
          console.log(123)
          // let res = await this.axios.post(`/role`, this.addForm)
          // let { code } = res.data.content
          // if (code === +-3015) {
          //   this.$message.error(`角色已存在`)
          // }
          // if (code === +-9999) {
          //   this.$message.error(`Exception Message`)
          // }
          // if (code === +0) {
          //   this.$message.success(`新建角色成功`)
          //   this.getList()
          //   this.addDalogVisible = false
          //   this.addForm.roleName = ''
          //   this.addForm.remark = ''
          // }
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
      console.log(row)
      this.editDalogVisible = true
      let { enable, remark, roleId, roleName } = row
      this.editForm.enable = Number(enable ? '1' : '0')
      this.editForm.roleName = roleName
      this.editForm.roleId = roleId
      this.editForm.remark = remark
      console.log(this.editForm)
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
    },
    output() {
      if (this.addForm.loginName.length > 0) {
        this.disabled = true
      }
    },
    async addClick() {
      this.addDalogVisible = true
      let res = await this.axios.get(
        `/role/${localStorage.getItem('companyId')}/{roleName}/2/1/100`
      )
      let { list } = res.data.content.data
      let hh = list.map(function(item, index) {
        return { value: index, label: item.roleName }
      })
      this.addOptions = hh
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
    height: 20px;
    line-height: 20px;
  }
  /deep/ .cell {
    height: 23px;
    line-height: 23px;
  }
}
</style>
