<template>
  <div class="compaines" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_co_query')>-1">
      <div class="filter">筛选</div>
      <el-form-item label="公司名称" prop="user">
        <el-input v-model="formInline.user" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_add')>-1">+ 新建</el-button>
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
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_resetAdmin')>-1" plain>重置超管</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_co_func')>-1" plain>权限</el-button>
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
      title="提示"
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
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
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
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formInline: {
        user: ''
      },
      tableData: [],
      dialogVisible: false,
      addDalogVisible: false,
      addForm: {
        adminLoginName: '',
        adminPassword: '',
        checkAdminPassword: '',
        companyCode: '',
        companyName: ''
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
          { validator: validatePass, trigger: 'blur' }
        ],
        checkAdminPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      companyName: '{companyName}',
      pageIndex: 1,
      pageSize: 5,
      total: 1,
      coList: []
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
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
      let res = await this.axios.get(
        `/company/${this.companyName}/${this.pageIndex}/${this.pageSize}`
      )
      console.log(res.data)
      let {
        code,
        data: { list, total }
      } = res.data.content
      if (code === 0) {
        this.tableData = list
        this.total = total
      }
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
          console.log('error submit!!')
          return false
        }
      })
    },
    output() {
      this.addForm.adminLoginName = this.addForm.companyCode + 'admin'
      console.log(this.addForm.adminLoginName.length)
      if (!this.addForm.companyCode) {
        this.addForm.adminLoginName = ''
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
</style>
