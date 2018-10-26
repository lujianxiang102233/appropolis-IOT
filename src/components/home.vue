<template>
  <div class="home" style="height:100%">
    <el-container>
    <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#9F9F8D"
        active-text-color="#fff"
        router
        :collapse="isCollapse">
        <div class="logo" style="height:64px">
            <div class="in"></div>
        </div>
        <el-submenu index="1">
            <template slot="title">
            <img src="../assets/images/u59.png" alt="" id="u59" style=" height: 14px">
            <span slot="title" style="color:#fff">权限管理</span>
            </template>
            <el-menu-item index="/companies" style="padding-left: 48px;" v-if="menusList.indexOf('permission_co')>-1">公司管理</el-menu-item>
            <el-menu-item index="/role" style="padding-left: 48px;" v-if="menusList.indexOf('permission_role')>-1">角色管理</el-menu-item>
            <el-menu-item index="/user" style="padding-left: 48px;" v-if="menusList.indexOf('permission_user')>-1">用户管理</el-menu-item>
            <el-menu-item index="/logs" style="padding-left: 48px;" v-if="menusList.indexOf('permission_log')>-1">操作日志</el-menu-item>
        </el-submenu>
    </el-menu>
    <el-container>
        <el-header style="height: 64px;">
            <div class="img">
             <img src="../assets/images/u67.png" @click="collapse">
            </div>
            <span class="text">APPROPOLIS</span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <span id="edit" v-if="$route.path.slice(1) == 'companies'" class="demonstration" trigger="click">变更</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item.companyId" v-for="item in companySet" :key="item.companyId">{{item.companyName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="user" @click="logout">
             <img src="../assets/images/u70.png" @click="collapse">
             <span>{{employeeName}}</span>
             <div class="logout" v-show="isShow">
               <ul>
                 <li @click="editPsd">修改密码</li>
                 <li @click="layout">注销</li>
               </ul>
             </div>
            </div>
        </el-header>
        <el-main><router-view/></el-main>
    </el-container>
    </el-container>
    <el-dialog
    data-backdrop="static"
      title="重置用户密码"
      class="reset"
      :visible.sync="resetDialogVisible"
      :close-on-click-modal=false
      width="30%"
      :before-close="resetHandleClose">
      <el-form :model="retForm" status-icon :rules="rules" ref="retForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="retForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="retForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="checkPass">
          <el-input type="password" v-model="retForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="retCancel('retForm')">取 消</el-button>
        <el-button type="primary" @click="reset('retForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="editDialogVisible"
      :before-close="handleClose"
      class="edit"
      width="30%">
      <span class="judge" v-if="forceChangePwd===1">首次登录请重置账户密码</span>
      <span class="judge" v-else>重置密码后首次登录，请修改账户密码</span>
      <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请输入密码" prop="editPass">
          <el-input type="password" v-model="editForm.editPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请重复密码" prop="editCheckPass">
          <el-input type="password" v-model="editForm.editCheckPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel('editForm')">清 空</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
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
        if (this.retForm.checkPass !== '') {
          this.$refs.retForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.retForm.pass) {
        callback(new Error('亲，两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.editForm.editCheckPass !== '') {
          this.$refs.editForm.validateField('editCheckPass')
        }
        callback()
      }
    }
    var validatePass4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editForm.editPass) {
        callback(new Error('亲，两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      editDialogVisible: false,
      resetDialogVisible: false,
      isCollapse: false,
      isShow: false,
      menusList: [],
      retForm: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      editForm: {
        editPass: '',
        editCheckPass: ''
      },
      rules: {
        oldPass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'blur'
          },
          { validator: validatePass1, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        editPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'blur'
          },
          { validator: validatePass3, trigger: 'blur' }
        ],
        editCheckPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass4, trigger: 'blur' }
        ]
      },
      companySet: {},
      forceChangePwd: '',
      employeeName: ''
    }
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
    },
    logout() {
      this.isShow = !this.isShow
    },
    layout() {
      this.$confirm('你确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('companyId')
          localStorage.removeItem('points')
          localStorage.removeItem('loginName')
          localStorage.removeItem('companyTree')
          localStorage.removeItem('companySet')
          localStorage.removeItem('forceChangePwd')
          localStorage.removeItem('employeeName')
          this.$router.push('./login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editPsd() {
      this.resetDialogVisible = true
    },
    retCancel(formName) {
      this.$refs[formName].resetFields()
      this.resetDialogVisible = false
    },
    reset(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`/employee/password`, {
            currentPassword: this.retForm.oldPass,
            newPassword: this.retForm.pass
          })
          let { code } = res.data.content
          if (code === +0) {
            this.$message.success('密码已修改成功')
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +-3013) {
            this.$message.error(`原密码输入错误`)
          }
          if (code === +-3007) {
            this.$message.error(`新密码不能与原密码一致`)
          }
          this.resetDialogVisible = false
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    async handleCommand(command) {
      console.log(command)
      let res = await this.axios.get(`/company/permission/${command}`)
      let { code, data } = res.data.content
      if (code === 0) {
        console.log(JSON.parse(data)) // todo
      }
    },
    editCancel(formName) {
      this.$refs[formName].resetFields()
    },
    edit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`/employee/password/firstLogin`, {
            password: this.editForm.editCheckPass
          })
          let { code } = res.data.content
          if (code === +0) {
            this.editDialogVisible = false
            localStorage.removeItem('forceChangePwd')
            if (this.menusList.indexOf('permission_co') > -1) {
              this.$router.push('/companies')
            } else if (this.menusList.indexOf('permission_role') > -1) {
              this.$router.push('/role')
            } else if (this.menusList.indexOf('permission_user') > -1) {
              this.$router.push('/user')
            } else {
              this.$router.push('/logs')
            }
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +-3007) {
            this.$message.error(`重置密码与默认密码一致`)
            // 不能关闭窗口
          }
          this.retForm = {}
        } else {
          return false
        }
      })
    },
    resetHandleClose(done) {
      done()
    },
    handleClose(done) {}
  },
  created() {
    this.menusList = JSON.parse(localStorage.getItem('points'))
    this.employeeName = localStorage.getItem('employeeName')
    let newSet = localStorage.getItem('companySet')
    if (newSet === 'undefined') {
      this.companySet = [{ companyName: '没有数据' }]
    } else {
      this.companySet = JSON.parse(newSet)
    }
    this.forceChangePwd = +localStorage.getItem('forceChangePwd')
    if (this.forceChangePwd === 1 || this.forceChangePwd === 2) {
      this.editDialogVisible = true
    }
  }
}
</script>

<style scope lang="less">
.el-container {
  height: 100%;
  .el-header {
    background-color: #fff;
    line-height: 64px;
    font-size: 28px;
    width: 100%;
    .img {
      height: 100%;
      width: 55px;
      float: left;
      cursor: pointer;
      img {
        width: 20px;
        height: 15px;
        margin-top: 28px;
        margin-left: 8px;
      }
    }
    .text {
      font-size: 28px;
      color: #333;
      float: left;
      font-weight: bold;
    }
    #edit {
      color: #18abff;
      float: left;
      margin-left: 33px;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .user {
      float: right;
      line-height: 64px;
      width: 100px;
      cursor: pointer;
      position: relative;
      img {
        display: block;
        float: left;
        margin-top: 26px;
        margin-right: 10px;
      }
      span {
        font-weight: normal;
        font-size: 14px;
        color: #999;
        position: relative;
        &::after {
          content: '';
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #999;
          display: inline-block;
          position: absolute;
          top: 8px;
          right: -18px;
        }
      }
      .logout {
        position: absolute;
        bottom: -64px;
        right: 0px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4470588);
        z-index: 99;
        background-color: #fff;
        ul {
          li {
            height: 40px;
            width: 80px;
            line-height: 40px;
            font-size: 14px;
            color: #333;
            text-align: center;
            &:nth-child(1) {
              border-bottom: 1px solid #ccc;
            }
          }
        }
      }
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 256px;
    min-width: 265px;
    min-height: 400px;
    .logo {
      padding: 19px;
      background-color: #c0cad3;
      box-sizing: border-box;
      .in {
        width: 100%;
        height: 100%;
        background: url(../assets/images/u5.png) no-repeat center center;
        background-size: contain;
      }
    }
    .el-submenu {
      #u59 {
        margin-right: 10px;
      }
    }
  }

  .el-menu-item.is-active {
    background-color: #3692e8 !important;
  }
}
.el-menu--vertical .el-menu-item.is-active {
  background-color: #3692e8 !important;
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
.el-dropdown-menu {
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.4);
  padding: 10px 15px;
  .el-dropdown-menu__item {
    border: 1px solid #ccc;
    background-color: white !important;
  }
  .el-dropdown-menu__item:hover {
    border: 1px solid #3692e8;
    color: #3692e8 !important;
  }
}
.el-dialog__body {
  padding: 20px 20px;
}
.judge {
  color: red;
  margin-bottom: 10px;
}
.edit .el-icon-close::before {
  content: '';
}
</style>
