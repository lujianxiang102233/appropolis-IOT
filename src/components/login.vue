<template>
    <div class="login">
        <div class="padding20 marginBottom20 login-input">
          <img src="../assets/images/logo_登录页logo.png" alt="">
          <i class="marginBottom20 login-border"></i>
          <div class="marginBottom20 login-wel">欢迎来到</div>
          <h1 class="company-tit">蒙羊牧业有限公司项目后台管理系统</h1>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item prop="loginName" class="loginName">
                  <el-input v-model.trim="form.loginName" placeholder="请输入用户名称" class="user"></el-input>
                  <i style="color:#ccc;" v-show="form.loginName.length > 0" class="el-icon-circle-close" @click="clear"></i>
              </el-form-item>
              <el-form-item prop="password" class="password">
                  <el-input v-model="form.password" placeholder="请输入登录密码" :clearable = "true" class="psd" :type="cut"></el-input>
                  <span :class="{show:isShow,hide:isHide}" v-show="form.password.length > 0" @click="pwsShow"></span>
              </el-form-item>
              <el-form-item>
                  <el-button class="login-btn" type="primary" style="width: 100%" @click="login('ruleForm')" :disabled="disabled">登录</el-button>
              </el-form-item>
          </el-form>
        </div>
        <div class="alignCenter login-txt">
          copyright &#169; appropolis.com.cn, All Rights Reserved.
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      isHide: true,
      cut: 'password',
      form: {
        loginName: '',
        password: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      code: {
        companyCode: 'CP01'
      },
      disabled: false
    }
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.disabled = true
          let res = await this.axios.post(`/employee/login`, {
            ...this.form,
            ...this.code
          })
          let { code, data } = res.data.content
          // console.log(data)
          if (code === +-3017 || code === +-3016) {
            if (data === undefined) {
              this.$message.error(`用户名或者密码错误`)
            } else {
              this.$message.error(
                `用户名或者密码错误,还有【${data}】次输入机会`
              )
            }
            this.disabled = false
          }
          if (code === +-3003) {
            this.$message.error('5次输入错误，账号已锁定，请联系管理员解锁')
            this.disabled = false
          }
          if (code === +-3004) {
            this.$message.error('账号停用')
            this.disabled = false
          }
          if (code === +0) {
            this.disabled = false
            localStorage.setItem('token', data.token)
            localStorage.setItem('points', JSON.stringify(data.functionPoints))
            localStorage.setItem('companyId', data.companyId)
            localStorage.setItem('loginName', data.loginName)
            localStorage.setItem('companyTree', data.companyTree)
            localStorage.setItem('companySet', JSON.stringify(data.companySet))
            localStorage.setItem('forceChangePwd', data.forceChangePwd)
            localStorage.setItem('employeeName', data.employeeName)
            localStorage.setItem('roleTree', data.roleTree)
            localStorage.setItem('companyName', data.companyName)
            localStorage.setItem(
              'storeList',
              JSON.stringify(data.functionPoints)
            )
            if (data.forceChangePwd > 0) {
              this.$router.push('/home')
            } else {
              if (data.functionPoints.indexOf('permission_co') > -1) {
                this.$router.push('/companies')
              } else if (data.functionPoints.indexOf('permission_role') > -1) {
                this.$router.push('/role')
              } else if (data.functionPoints.indexOf('permission_user') > -1) {
                this.$router.push('/user')
              } else if (data.functionPoints.indexOf('permission_log') > -1) {
                this.$router.push('/logs')
              } else {
                this.$router.push('/home')
              }
            }
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.form.loginName = ''
    },
    pwsShow() {
      if (this.cut === 'password') {
        this.cut = ''
        this.isShow = true
        this.isHide = false
      } else {
        this.cut = 'password'
        this.isShow = false
        this.isHide = true
      }
    }
  }
}
</script>

<style lang="less">
.login {
  background: url(../assets/images/1.png);
  background-size: cover;
  height: 100%;
  overflow: hidden;
  position: relative;
  .login-input {
    height: 520px;
    width: 444px;
    position: absolute;
    left: 50%;
    margin-left: -222px;
    top: 165px;
    background-color: #fff;
    text-align: center;
    .login-wel {
      font-size: 26px;
      color: #3e3f42;
    }
    .login-border {
      display: inline-block;
      width: 365px;
      margin: 20px 20px 40px 20px;
      height: 0;
      border-top: 1px solid #eaedf3;
    }
    .company-tit {
      font-size: 18px;
      color: #9ea0a5;
      font-weight: normal;
    }
    .el-form {
      width: 365px;
      margin: 60px auto;
      // background-size: cover;
      .el-form-item__content {
        margin-left: 0 !important;
        .el-input__inner {
          height: 40px;
          padding-left: 51px;
        }
      }
      .user {
        position: relative;
        &::before {
          width: 18px;
          height: 18px;
          content: '';
          background: url(../assets/images/copy.png);
          display: inline-block;
          position: absolute;
          top: 11px;
          left: 20px;
        }
      }
      .psd {
        position: relative;
        &::before {
          width: 16px;
          height: 18px;
          content: '';
          background: url(../assets/images/icon_sign_lock.png);
          display: inline-block;
          position: absolute;
          top: 11px;
          left: 20px;
        }
      }
      .el-button {
        height: 50px;
      }
      .loginName {
        position: relative;
        .el-icon-circle-close {
          position: absolute;
          top: 12px;
          right: 22px;
        }
      }
      .password {
        position: relative;
        .hide {
          position: absolute;
          top: 11px;
          right: 40px;
          background: url(../assets/images/untitled_89a26e01.svg) no-repeat;
          height: 14px;
          width: 21px;
        }
        .show {
          position: absolute;
          top: 11px;
          right: 40px;
          background: url(../assets/images/untitled_b4b45d06.svg) no-repeat;
          height: 19px;
          width: 21px;
        }
      }
      .login-btn {
        height: 40px;
        padding: 0;
        span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          font-weight: normal;
        }
      }
    }
  }
  .login-txt {
    width: 100%;
    color: #fff;
    font-size: 14px;
    position: absolute;
    top: 705px;
  }
}
</style>
