<template>
  <div class="compaines" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_role_query')>-1">
      <div class="filter">筛选</div>
      <el-form-item label="角色名称">
        <el-input v-model="roleName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-select v-model="roleState" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_role_add')>-1">+ 新建角色</el-button>
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="140">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="角色描述"
        width="160">
      </el-table-column>
      <el-table-column
        prop="roleCount"
        label="角色人数"
        width="130">
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
        label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_role_edit')>-1" plain @click="resetAdmin(scope.row)">编辑</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_role_user')>-1" plain @click="jump(scope.row)">成员</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_role_auth')>-1" plain @click="jump(scope.row)">权限</el-button>
            <el-button type="success" size="mini" v-if="coList.indexOf('permission_role_del')>-1" plain @click="jump(scope.row)">删除</el-button>
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
        <el-form-item label="角色状态" prop="adminLoginName">
          <el-radio v-model="addForm.enable" :label="1">开启</el-radio>
          <el-radio v-model="addForm.enable" :label="0">关闭</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认要停用{{ tableData.roleName }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFa">取 消</el-button>
        <el-button type="primary" @click="addTrue">确 定</el-button>
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
    return {
      tableData: [],
      addDalogVisible: false,
      resetDalogVisible: false,
      dialogVisible: false,
      addForm: {
        roleName: '',
        remark: '',
        enable: 1
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
      let getUrl = `/role/${this.companyId}/${this.roleName}/${
        this.roleState
      }/${this.pageIndex}/${this.pageSize}`
      if (this.roleName.length === 0) {
        getUrl = `/role/${this.companyId}/{roleName}/2/${this.pageIndex}/${
          this.pageSize
        }`
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
            this.addForm = {}
          }
        } else {
          return false
        }
      })
    },
    async addTrue() {
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
    addFa() {
      this.dialogVisible = false
      this.getList()
    },
    changeStatus(row) {
      this.dialogVisible = true
      let { roleId, enable } = row
      this.roleId = roleId
      this.enable = enable
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
