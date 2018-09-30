<template>
  <div class="companyaccess" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/companies' }">公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_co_func_query')>-1">
      <div class="filter">筛选</div>
      <el-form-item label="功能点名称">
        <el-input v-model="companyName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="FUNCID">
        <el-input v-model="companyName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_add')>-1">+ 新建一级功能点</el-button>
     <el-button type="primary" style="margin:0px 40px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_addsub')>-1">复制其他公司权限</el-button>
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司名称"
        width="160">
      </el-table-column>
      <el-table-column
        prop="adminLoginName"
        label="超管用户名"
        width="160">
      </el-table-column>
      <el-table-column
        prop="companyCode"
        label="公司内码"
        width="130">
      </el-table-column>
      <el-table-column
        width="160"
        label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createDate | time}}
          </template>
      </el-table-column>
      <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_resetAdmin')>-1" plain @click="resetAdmin(scope.row)">重置超管</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_co_func')>-1" plain >权限</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建公司"
      :visible.sync="addDalogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="addForm.companyName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="公司内码" prop="companyCode">
          <el-input v-model="addForm.companyCode" placeholder="请输入" @blur="output"></el-input>
        </el-form-item>
        <el-form-item label="超管用户名" prop="adminLoginName">
          <el-input v-model="addForm.adminLoginName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超管登录密码" prop="adminPassword">
          <el-input type="password" v-model="addForm.adminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请重复密码" prop="checkAdminPassword">
          <el-input type="password" v-model="addForm.checkAdminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置超管密码"
      :visible.sync="resetDalogVisible"
      width="40%">
      <el-form :model="retForm" :rules="rules" ref="retForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公司名称">
          <el-input v-model="retForm.companyName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超管用户名" prop="adminLoginName">
          <el-input v-model="retForm.adminLoginName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超管登录密码" prop="retAdminPassword">
          <el-input type="password" v-model="retForm.retAdminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请重复密码" prop="retCheckAdminPassword">
          <el-input type="password" v-model="retForm.retCheckAdminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="retCancel">取 消</el-button>
        <el-button type="primary" @click="reset('retForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addForm.checkAdminPassword !== '') {
          this.$refs.addForm.validateField('checkAdminPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.adminPassword) {
        callback(new Error('呵呵,两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.retForm.retCheckAdminPassword !== '') {
          this.$refs.retForm.validateField('retCheckAdminPassword')
        }
        callback()
      }
    }
    var validatePass4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.retForm.retAdminPassword) {
        callback(new Error('亲，两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      dialogVisible: false,
      addDalogVisible: false,
      resetDalogVisible: false,
      addForm: {
        adminLoginName: '',
        adminPassword: '',
        checkAdminPassword: '',
        companyCode: '',
        companyName: ''
      },
      retForm: {
        adminLoginName: '',
        retAdminPassword: '',
        retCheckAdminPassword: '',
        companyName: '',
        companyId: ''
      },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          {
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,100}$/,
            message: '最长100个中文字符',
            trigger: 'change'
          }
        ],
        companyCode: [
          { required: true, message: '请输入公司内码', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z]){1,100}$/,
            message: '最长20个英文字符，仅英文',
            trigger: 'change'
          }
        ],
        adminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9]){6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'change'
          },
          { validator: validatePass1, trigger: 'blur' }
        ],
        checkAdminPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        retAdminPassword: [
          { required: true, message: '请输入密码111', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9]){6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'change'
          },
          { validator: validatePass3, trigger: 'blur' }
        ],
        retCheckAdminPassword: [
          { required: true, message: '请再次输入密码222', trigger: 'blur' },
          { validator: validatePass4, trigger: 'blur' }
        ]
      },
      companyName: '',
      coList: []
    }
  },
  methods: {
    onSubmit() {
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
      // console.log(this.coList)
      let res = await this.axios.get(
        `/company/permission/${this.$route.query.id}`
      )
      let {
        code,
        data: { permissionTree }
      } = res.data.content
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
      if (code === 0) {
        console.log(permissionTree)
      }
      // let {
      //   code,
      //   data: { list, total }
      // } = res.data.content
      // if (code === 0) {
      //   this.tableData = list
      //   this.total = total
      // }
    },
    add(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.post(`/company`, this.addForm)
          let { code } = res.data.content
          if (code === +-3006) {
            this.$message.error(`公司内码重复`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.getList()
            this.addDalogVisible = false
            this.addForm = {}
          }
        } else {
          return false
        }
      })
    },
    output() {
      this.addForm.adminLoginName = this.addForm.companyCode + 'admin'
      if (!this.addForm.companyCode) {
        this.addForm.adminLoginName = ''
      }
    },
    resetAdmin(row) {
      this.resetDalogVisible = true
      // console.log(row)
      let { companyName, adminLoginName, companyId } = row
      this.retForm.companyName = companyName
      this.retForm.adminLoginName = adminLoginName
      this.retForm.companyId = String(companyId)
    },
    reset(formName) {
      console.log(formName)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(
            `/company/password/${this.retForm.companyId}`,
            {
              password: this.retForm.retCheckAdminPassword
            }
          )
          console.log(res)
          let { code } = res.data.content
          if (code === +0) {
            console.log(this.resetForm.companyName)
            this.$message.success(this.retForm.companyName + '超管账号重置成功')
          }
          if (code === +-999) {
            this.$message.success(`Exception Message`)
          }
          if (code === +-3007) {
            this.$message.success(`重置密码与原密码一样`)
          }
        } else {
          return false
        }
      })
    },
    retCancel() {
      this.resetDalogVisible = false
      this.retForm = {}
    }
  },
  created() {
    // ok
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
  margin-top: 40px;
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
.editCom {
  margin-top: 10px;
  p {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.847058823529412);
  }
}
</style>
