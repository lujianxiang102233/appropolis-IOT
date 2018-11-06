<template>
    <div class="login">
        <img src="../assets/images/u5.png" alt="" class="img">
        <h1>蒙羊牧业有限公司项目后台管理系统</h1>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="loginName" class="loginName">
                <el-input v-model.trim="form.loginName" placeholder="请输入用户名称" class="user"></el-input>
                <i style="color:#ccc;" v-show="form.loginName.length > 0" class="el-icon-circle-close" @click="clear"></i>
            </el-form-item>
            <el-form-item prop="password" class="password">
                <el-input v-model="form.password" placeholder="请输入登录密码" class="psd" :type="cut"></el-input>
                <span :class="{show:isShow,hide:isHide}" v-show="form.password.length > 0" @click="pwsShow"></span>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" style="width: 100%" @click="login('ruleForm')" :disabled="disabled">登录</el-button>
            </el-form-item>
        </el-form>
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
      others: [
        'permission_co_func_query',
        'permission_log_query',
        'permission_co_func',
        'permission_log',
        'permission',
        'permission_user',
        'permission_role_auth_query',
        'permission_co_query',
        'permission_role_query',
        'permission_user_query',
        'permission_co',
        'permission_role',
        'permission_role_auth'
      ],
      disabled: false
    }
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.disabled = false
          let res = await this.axios.post(`/employee/login`, {
            ...this.form,
            ...this.code
          })
          let { code, data } = res.data.content
          if (code === +-3017 || code === +-3016) {
            if (data === undefined) {
              this.$message.error(`用户名或者密码错误`)
            } else {
              this.$message.error(
                `用户名或者密码错误,还有【${data}】次输入机会`
              )
            }
            this.disabled = true
          }
          if (code === +-3003) {
            this.$message.error('5次输入错误，账号已锁定，请联系管理员解锁')
            this.disabled = true
          }
          if (code === +-3004) {
            this.$message.error('账号停用')
            this.disabled = true
          }
          if (code === +0) {
            this.disabled = true
            localStorage.setItem('token', data.token)
            localStorage.setItem('points', JSON.stringify(data.functionPoints))
            localStorage.setItem('companyId', data.companyId)
            localStorage.setItem('loginName', data.loginName)
            localStorage.setItem('companyTree', data.companyTree)
            localStorage.setItem('companySet', JSON.stringify(data.companySet))
            localStorage.setItem('forceChangePwd', data.forceChangePwd)
            localStorage.setItem('employeeName', data.employeeName)
            localStorage.setItem('fixedPoints', this.others)
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
              } else {
                this.$router.push('/logs')
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

<style lang="less" scoped>
.img {
  width: 400px;
  height: 52px;
  display: block;
  margin: 80px auto 50px;
}
h1 {
  font-size: 48px;
  color: rgba(0, 0, 0, 0.847058823529412);
  font-weight: 700;
  line-height: 28px;
  text-align: center;
}
.login {
  background: url(../assets/images/u1.jpg);
  background-size: cover;
  height: 100%;
  overflow: hidden;
  .el-form {
    margin: 60px auto;
    width: 400px;
    background-size: cover;
    border-radius: 20px;
    position: relative;
    right: 50px;
    .user {
      position: relative;
      &::before {
        width: 25px;
        height: 24px;
        content: '';
        background: url(../assets/images/u20.png);
        display: inline-block;
        position: absolute;
        top: 13px;
        left: 13px;
      }
      /deep/ .el-input__inner {
        height: 50px;
        padding-left: 51px;
      }
    }
    .psd {
      position: relative;
      &::before {
        width: 19px;
        height: 24px;
        content: '';
        background: url(../assets/images/u21.png);
        display: inline-block;
        position: absolute;
        top: 13px;
        left: 17px;
      }
      /deep/ .el-input__inner {
        height: 50px;
        padding-left: 51px;
      }
    }
    .el-button {
      height: 50px;
    }
    .loginName {
      position: relative;
      .el-icon-circle-close {
        position: absolute;
        top: 18px;
        right: 15px;
      }
    }
    .password {
      position: relative;
      .hide {
        position: absolute;
        top: 15px;
        right: 10px;
        background: url(../assets/images/untitled_89a26e01.svg) no-repeat;
        height: 14px;
        width: 21px;
      }
      .show {
        position: absolute;
        top: 15px;
        right: 10px;
        background: url(../assets/images/untitled_b4b45d06.svg) no-repeat;
        height: 19px;
        width: 21px;
      }
    }
  }
}
</style>
