<template>
    <div class="login">
        <img src="../assets/images/u5.png" alt="" class="img">
        <h1>蒙羊牧业有限公司项目后台管理系统</h1>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="loginName" class="loginName">
                <el-input v-model="form.loginName" placeholder="请输入用户名称" class="user"></el-input>
                <i v-show="form.loginName.length > 0" class="el-icon-circle-close" @click="clear"></i>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="form.password" placeholder="请输入登录密码" class="psd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" style="width: 100%" @click="login('ruleForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
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
      }
    }
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
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
          }
          if (code === +-3003) {
            this.$message.error('5次输入错误，账号已锁定，请联系管理员解锁')
          }
          if (code === +0) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('points', JSON.stringify(data.functionPoints))
            localStorage.setItem('companyId', data.companyId)
            localStorage.setItem('loginName', data.loginName)
            localStorage.setItem('companyTree', data.companyTree)
            localStorage.setItem('companySet', JSON.stringify(data.companySet))
            localStorage.setItem('forceChangePwd', data.forceChangePwd)
            localStorage.setItem('employeeName', data.employeeName)
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
        right: 6px;
      }
    }
  }
}
</style>
