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
            <span id="edit" v-if="$route.path.slice(1) == 'companies'">变更</span>
            <div class="user" @click="logout">
             <img src="../assets/images/u70.png" @click="collapse">
             <span>admin</span>
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
      title="重置用户密码"
      :visible.sync="resetDialogVisible"
      width="30%">
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
    return {
      resetDialogVisible: false,
      isCollapse: false,
      isShow: false,
      menusList: [],
      retForm: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'change'
          }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![0-9A-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: '仅英文及数字，6-16位。至少包括1位数字、大小写英文字符',
            trigger: 'change'
          },
          { validator: validatePass1, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
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
    retCancel() {
      this.resetDialogVisible = false
      this.retForm = {}
    },
    reset(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.retForm)
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
          this.retForm = {}
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.menusList = JSON.parse(localStorage.getItem('points'))
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
</style>
