<template>
  <div class="companyaccess" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/companies' }">公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_co_func_query')>-1" :model="queryTable">
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
     <el-button type="primary" style="margin:0px 40px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_copy')>-1">复制其他公司权限</el-button>
      <el-table
      :data="funcTable"
      height="350"
      style="width: 100%">
      <el-table-tree-column
        :indent-size="30"
        parent-key="parentId"
        prop="permissionName"
        width="170"
        label="功能点名称">
      </el-table-tree-column>
      <el-table-column
        prop="permissionCode"
        width="150"
        label="FUNCID">
      </el-table-column>
      <el-table-column
        prop="menu"
        width="120"
        label="菜单栏（权重）">
       <template slot-scope="scope">
          {{scope.row.menu?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        width="180"
        label="url">
      </el-table-column>
      <el-table-column
        prop="url"
        label="功能描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_addsub')>-1"  plain>添加</el-button>
          <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_edit')>-1"  plain>编辑</el-button>
          <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_del')>-1"  plain>删除</el-button>
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
let ElTreeGrid = require('element-tree-grid')
export default {
  data() {
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
        ]
      },
      companyName: '',
      coList: [],
      funcTable: [],
      queryTable: {
        func: '',
        permissionCode: ''
      }
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
      let indexi = 0
      function getArray(data, depth, parentId) {
        for (var i in data) {
          if (data[i].permissionCode !== undefined) {
            data[i].id = ++indexi
            // data[i].label = data[i].permissionName
            data[i].depth = depth
            data[i].parentId = parentId
            data[i].child_num = data[i].children.length
          }
          if (data[i].children.length > 0) {
            let tempDept = depth + 1
            getArray(data[i].children, tempDept, data[i].id)
          }
        }
      }
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
        getArray(permissionTree, 0, null)
        this.funcTable = permissionTree
        console.log(this.funcTable)
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
  components: {
    'el-table-tree-column': ElTreeGrid
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
.el-table {
  /deep/ .el-table_1_column_2 .cell {
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
  /deep/ .el-table_1_column_2 .cell:hover {
    height: auto;
    word-break: break-all;
    white-space: pre-wrap;
    text-decoration: none;
  }
}
</style>
