<template>
  <div class="compaines">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="first">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item class="two">公司管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="coQuery">
    <el-form :model="ruleForm" :inline="true" class="clearfix demo-form-inline" ref="ruleForm">
      <div class="filter">筛选</div>
      <el-form-item class="filterName" label="公司名称">
        <el-input v-model="ruleForm.companyName" placeholder="请输入公司名称" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" class="top-button" size="mini" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_add')>-1"><img src="../../assets/images/add-icon.png"  class="fl"> <span class="btn-divide fr">新建</span></el-button>
     <el-table
      ref="table"
      :data="tableData"
      :height='tableHeight'
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        :index="indexMethod"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        label="公司名称"
        width="180">
        <template slot-scope="scope">
          <div class="elli" :title="scope.row.companyName">{{scope.row.companyName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="adminLoginName"
        label="超管用户名"
        align="center"
        width="160">
      </el-table-column>
      <el-table-column
        prop="companyCode"
        label="公司内码"
        align="center"
        width="130">
      </el-table-column>
     <el-table-column
        align="center"
        label="登录入口"
        width="180">
        <template slot-scope="scope">
          <div class="elli" :title="scope.row.companyUrl">{{scope.row.companyUrl}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        align="center"
        label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createDate | time}}
          </template>
      </el-table-column>
      <el-table-column
        class="operation"
        align="center"
        label="操作">
          <template slot-scope="scope">
            <el-button class="operation"  v-if="coList.indexOf('permission_co_resetAdmin')>-1" @click="resetAdmin(scope.row)" plain>重置超管</el-button>
            <el-button class="operation last" v-if="coList.indexOf('permission_co_func')>-1" plain @click="jump(scope.row)">权限</el-button>
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
      title="新建公司"
      :visible.sync="addDalogVisible"
      :before-close="addHandleClose"
      :close-on-click-modal=false>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="addForm.companyName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="公司内码" prop="companyCode">
          <el-input v-model="addForm.companyCode" placeholder="请输入" @blur="addOutput"></el-input>
        </el-form-item>
        <el-form-item label="超管用户名" prop="adminLoginName">
          <el-input v-model="addForm.adminLoginName" placeholder="请输入" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="超管登录密码" prop="adminPassword">
          <el-input type="password" v-model="addForm.adminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请重复密码" prop="checkAdminPassword">
          <el-input type="password" v-model="addForm.checkAdminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      ref="dialog"
      title="重置超管密码"
      :visible.sync="resetDalogVisible"
      :before-close="resetHandleClose"
      :close-on-click-modal=false>
      <el-form :model="retForm" :rules="rules" ref="retForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公司名称">
          <el-input :disabled="true" v-model="retForm.companyName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超管用户名" prop="adminLoginName">
          <el-input :disabled="true" v-model="retForm.adminLoginName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超管登录密码" prop="retAdminPassword">
          <el-input type="password" v-model="retForm.retAdminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请重复密码" prop="retCheckAdminPassword">
          <el-input type="password" v-model="retForm.retCheckAdminPassword" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="retCancel('retForm')">取 消</el-button>
        <el-button type="primary" @click="reset('retForm')">确 定</el-button>
      </span>
    </el-dialog>
    </div>
    <div class="noText" v-else>您没有当前api访问权限 ~</div>
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
      tableHeight: '',
      tableData: [],
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
            min: 0,
            max: 100,
            message: '最长100个中文字符',
            trigger: 'blur'
          }
        ],
        companyCode: [
          { required: true, message: '请输入公司内码', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z]){1,20}$/,
            message: '最长20个英文字符，仅英文',
            trigger: 'blur'
          }
        ],
        adminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'blur'
          },
          { validator: validatePass1, trigger: 'blur' }
        ],
        checkAdminPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        retAdminPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'blur'
          },
          { validator: validatePass3, trigger: 'blur' }
        ],
        retCheckAdminPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass4, trigger: 'blur' }
        ]
      },
      ruleForm: {
        companyName: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      coList: [],
      disabled: false,
      coQuery: ''
    }
  },
  methods: {
    onSubmit() {
      this.pageIndex = 1
      this.getList()
    },
    resetForm(formName) {
      this.ruleForm.companyName = ''
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
      this.coQuery = localStorage
        .getItem('points')
        .includes('permission_co_query')
      let getUrl = `/company/${this.ruleForm.companyName}/${this.pageIndex}/${
        this.pageSize
      }`
      if (this.ruleForm.companyName.length === 0) {
        getUrl = `/company/{companyName}/${this.pageIndex}/${this.pageSize}`
      }
      let res = await this.axios.get(getUrl)
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
            this.$refs[formName].resetFields()
            this.disabled = false
            this.$message.success(`新建公司成功`)
          }
        } else {
          return false
        }
      })
    },
    addCancel(formName) {
      this.addDalogVisible = false
      this.$refs[formName].resetFields()
      this.disabled = false
    },
    addOutput() {
      this.addForm.adminLoginName = this.addForm.companyCode + '_admin'
      if (!this.addForm.companyCode) {
        this.addForm.adminLoginName = ''
      }
      this.disabled = true
    },
    resetAdmin(row) {
      this.resetDalogVisible = true
      let { companyName, adminLoginName, companyId } = row
      this.retForm.companyName = companyName
      this.retForm.adminLoginName = adminLoginName
      this.retForm.companyId = String(companyId)
    },
    reset(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(
            `/company/password/${this.retForm.companyId}`,
            {
              password: this.retForm.retCheckAdminPassword
            }
          )
          let { code } = res.data.content
          if (code === +0) {
            this.$message.success(this.retForm.companyName + '超管账号重置成功')
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +-3007) {
            this.$message.error(`重置密码与原密码一样`)
          }
          this.resetDalogVisible = false
        } else {
          return false
        }
      })
    },
    retCancel(formName) {
      this.resetDalogVisible = false
      this.$refs[formName].resetFields()
    },
    jump(row) {
      this.$router.push({
        path: '/companies-access',
        query: { id: row.companyId, companyName: row.companyName }
      })
    },
    indexMethod(index) {
      return (this.pageIndex - 1) * this.pageSize + index + 1
    },
    addHandleClose(done) {
      done()
      this.$refs.addForm.resetFields()
    },
    resetHandleClose(done) {
      done()
      this.$refs.retForm.resetFields()
    },
    flexTableHeight() {
      this.tableHeight =
        document.documentElement.clientHeight -
        (this.$refs.ruleForm.$el.offsetHeight + 245)
    },
    fixedTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 320
    }
  },
  created() {
    this.getList()
    if (this.coQuery) {
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
      // text-align: center;
    }
    /deep/ .el-form-item__content {
      height: 64px;
      line-height: 64px;
      width: 225px;
      margin-right: 20px;
      .filter-ipt .el-input__inner {
        height: 36px;
        line-height: 36px;
        width: 226px;
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

.el-pagination {
  float: right;
  margin-top: 10px;
}
// .el-input {
//   /deep/ .el-input__inner {
//     width: 70%;
//   }
// }
.el-input.filter-ipt {
  /deep/ .el-input__inner {
    height: 30px;
  }
}
.el-table {
  border: 1px solid #ebeef5;
  /deep/ .cell .elli {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 11em;
    height: 17px;
    line-height: 17px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.top-button {
  width: 124px;
  .btn-divide {
    width: 50px;
  }
}
</style>
