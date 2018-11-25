<template>
  <div class="home" style="height:100%">
    <el-container>
    <el-menu
        :default-active="$route.path.slice(0).split('-')[0]"
        :default-openeds="openeds"
        class="el-menu-vertical-demo"
        background-color="#252529"
        text-color="#9F9F8D"
        active-text-color="#fff"
        router
        :collapse="isCollapse">
        <div class="logo" style="height:64px">
            <div class="in"></div>
        </div>
        <el-submenu :index="menus.url" v-for="menus in roleTree" :key="menus.id">
            <template slot="title">
              <img src="../assets/images/u59.png" alt="" id="u59" style=" height: 14px">
              <span slot="title" style="color:#fff">{{menus.permissionName}}</span>
            </template>
             <el-menu-item  :index="item.url.indexOf('http') === 0?'/iframe?url='+item.url+'&'+'newTab='+item.newTab:item.url" style="padding-left: 16px;" v-for="item in menus.children" :key="item.id">
             <a target="_blank" class="link"  :href="item.newTab?item.url:''"  v-if="item.url.indexOf('http') === 0 && item.newTab">{{item.permissionName}}</a>
             <span v-else>{{item.permissionName}}</span>
             </el-menu-item>
             <!-- 二级以上侧边栏显示 -->
            <!-- <template>
              <el-submenu index="1-2" class="pro">
                <template>
                 <span slot="title">商品管理</span>
               </template>
               <el-menu-item  index="1-2-1">
                 <span slot="title">商品分类</span>
               </el-menu-item>
               <el-menu-item index="1-2-2">
                 <span  slot="title">商品分类</span>
               </el-menu-item>
               <el-menu-item  index="1-2-3">
                 <span slot="title">商品分类</span>
               </el-menu-item>
              </el-submenu>
            </template>
            <template>
              <el-submenu index="1-3" class="pro">
                <template>
                 <span slot="title">列表管理</span>
               </template>
               <el-menu-item index="1-3-2" >
                 <span slot="title">列表分类</span>
               </el-menu-item>
               <el-menu-item index="1-3-3" >
                 <span slot="title">列表分类</span>
               </el-menu-item>
              </el-submenu>
            </template> -->
        </el-submenu>
    </el-menu>
    <el-container>
        <el-header>
            <div class="img">
             <img src="../assets/images/icon_2@2x.png" @click="collapse">
            </div>
            <span class="text">{{companyName}}</span>
             <div class="edits">
             <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <span id="edit" trigger="click">变更</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="[item.companyId+'/'+item.companyName]" v-for="item in companySet" :key="item.companyId">{{item.companyName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </div>
            <div class="user" @click="logout">
             <img src="../assets/images/icon_澶村儚.png" @click="collapse">
             <span>{{loginName}}</span>
             <div class="logout" v-show="isShow">
               <ul>
                 <li @click="editPsd">修改密码</li>
                 <li @click="layout">注销</li>
               </ul>
             </div>
            </div>
        </el-header>
        <el-main><router-view></router-view></el-main>
    </el-container>
    </el-container>
    <el-dialog
      data-backdrop="static"
      title="重置用户密码"
      class="reset"
      :visible.sync="resetDialogVisible"
      :close-on-click-modal=false
      :before-close="resetHandleClose">
      <el-form :model="retForm"  :rules="rules" ref="retForm" label-width="100px" class="demo-ruleForm">
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
      class="edit">
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
      path: '',
      companyName: '',
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
      employeeName: '',
      loginName: '',
      openeds: [],
      roleTree: [],
      otherTree: [],
      localTree: [],
      companyId: ''
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
        .then(async () => {
          let res = await this.axios.get(`/employee/logout`)
          let { code } = res.data.content
          if (code === 0) {
            this.$router.push('./login')
            localStorage.removeItem('token')
            localStorage.removeItem('companyId')
            localStorage.removeItem('points')
            localStorage.removeItem('loginName')
            localStorage.removeItem('companyTree')
            localStorage.removeItem('companySet')
            localStorage.removeItem('forceChangePwd')
            localStorage.removeItem('employeeName')
            localStorage.removeItem('storeList')
            localStorage.removeItem('roleTree')
            localStorage.removeItem('companyName')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
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
    async switch() {
      let res = await this.axios.get(`/company/switchCompany/${this.companyId}`)
      let { code, data } = res.data.content
      if (code === -3005) {
        this.$message.error('执行权限异常')
      }
      if (code === -9999) {
        this.$message.error('Exception Message')
      }
      if (code === 0) {
        localStorage.setItem('points', JSON.stringify(data.functionPoints))
        localStorage.setItem('roleTree', data.roleTree)
        localStorage.setItem('companyId', this.companyId)
        this.roleTree = JSON.parse(data.roleTree)
        this.openeds = this.roleTree.map(item => {
          return item.url
        })
        let res = JSON.parse(data.roleTree)[0].children[0].url
        this.$router.push(res)
        console.log(this.$route.path)
        window.location.reload()
      }
    },
    async handleCommand(command) {
      this.companyId = +command[0].split('/')[0]
      // this.companyName = command[0].split('/')[1]
      localStorage.setItem('companyName', command[0].split('/')[1])
      this.switch()
      this.dropDown()
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
      this.$refs.retForm.resetFields()
    },
    handleClose(done) {},
    dropDown() {
      this.companySet = JSON.parse(localStorage.getItem('companySet'))
      if (this.companySet === 'undefined') {
        this.companySet = [{ companyName: '没有数据' }]
      } else {
        let index = ''
        this.companySet.forEach((item, i) => {
          if (item.companyId === this.companyId) {
            index += i
          }
        })
        this.companySet.splice(index, 1)
      }
    }
  },
  created() {
    this.menusList = JSON.parse(localStorage.getItem('points'))
    this.localTree = JSON.parse(localStorage.getItem('roleTree'))
    this.roleTree = this.localTree
    console.log(this.roleTree)
    this.openeds = this.roleTree.map(item => {
      return item.url
    })
    this.employeeName = localStorage.getItem('employeeName')
    this.companyName = localStorage.getItem('companyName')
    this.loginName = localStorage.getItem('loginName')
    this.companyId = +localStorage.getItem('companyId')
    this.dropDown()
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
    height: 64px !important;
    line-height: 64px;
    width: 100%;
    .img {
      height: 100%;
      width: 48px;
      float: left;
      cursor: pointer;
      img {
        width: 20px;
        height: 15px;
        margin-top: 26px;
        margin-left: 10px;
      }
    }
    .text {
      font-size: 18px;
      color: #333;
      float: left;
      font-weight: bold;
    }
    .edits {
      float: left;
      margin-left: 27px;
      font-size: 14px;
      cursor: pointer;
      width: 55px;
      #edit {
        color: #18abff;
        position: relative;
        &::after {
          content: '';
          width: 20px;
          height: 20px;
          background: url(../assets/images/dropdown_arrow.png) no-repeat top
            right;
          position: absolute;
          top: 4px;
          right: -16px;
        }
      }
    }
    .user {
      float: right;
      line-height: 64px;
      cursor: pointer;
      position: relative;
      margin-right: 30px;
      img {
        display: block;
        float: left;
        margin-top: 16px;
        margin-right: 10px;
        height: 38px;
        width: 38px;
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
          right: -20px;
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
    width: 270px;
    min-width: 270px;
    min-height: 400px;
    padding-left: 14px;
    padding-right: 14px;
    box-sizing: border-box;
    .logo {
      padding: 21px;
      background-color: #252529;
      box-sizing: border-box;
      .in {
        width: 100%;
        height: 100%;
        background: url(../assets/images/logo@2x.png) no-repeat center center;
        background-size: contain;
        color: #fff;
      }
    }
    .el-submenu {
      #u59 {
        margin-right: 10px;
      }
    }
  }
  .el-submenu .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
  }
  .el-submenu .el-menu-item:hover {
    background-color: #252529 !important;
  }
  .el-menu-item.is-active:hover {
    background-color: #1989fa !important;
  }
  .el-menu-item.is-active {
    background-color: #1989fa !important;
    border-radius: 4px;
  }
}
.el-menu--vertical .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.el-menu--vertical .el-menu-item.is-active {
  background-color: #1989fa !important;
  border-radius: 4px;
}
// dialog
@dInputWidth: 220px;
@dBodyAlign: left;
@dHeaderAlign: left;
@dFooterAlign: right;
.el-dialog {
  width: 628px;
  padding: 20px 20px 90px 30px;
  box-sizing: border-box;
  min-height: 230px;
  font-size: 16px;
  position: relative;
}
.el-dialog__header {
  padding: 0;
  text-align: @dHeaderAlign;
  margin-bottom: 20px;
  .el-dialog__title {
    color: #1989fa;
    font-size: 20px;
    line-height: 30px;
    font-weight: normal;
    margin-left: 10px;
  }
}
.el-dialog__body {
  padding: 0 0 0 10px;
  text-align: @dBodyAlign;
  .el-form-item__label {
    text-align: left;
    color: #909399;
  }
  .el-radio__label {
    color: #909399;
  }
  .el-input__inner {
    width: @dInputWidth;
  }
  .el-form-item.is-error .el-input__validateIcon {
    position: absolute;
  }
  .el-form-item.is-success .el-input__validateIcon {
    position: absolute;
  }
  .dRadio {
    margin-top: -15px;
    height: 20px;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
.el-dialog__footer {
  padding: 0;
}
.el-dialog__footer {
  text-align: @dFooterAlign;
  margin-top: 30px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  .el-button {
    padding: 0;
    height: 36px;
    line-height: 36px;
    width: 106px;
    text-align: center;
    &:first-child {
      span {
        color: #606266;
      }
    }
  }
}
.el-form-item.is-required > .el-form-item__label:before {
  position: absolute;
  left: 20px;
}
.el-message-box {
  width: 380px;
  padding: 20px 20px 90px 20px;
  box-sizing: border-box;
  min-height: 230px;
  font-size: 16px;
  position: relative;
  .el-message-box__headerbtn {
    top: 0;
    right: 0;
  }
  .el-message-box__header {
    padding: 0;
  }
  .el-message-box__content {
    padding: 20px 0;
  }
  .el-message-box__title {
    color: #1989fa;
    font-size: 20px;
    line-height: 30px;
    font-weight: normal;
  }
  .el-message-box__status.el-icon-warning {
    display: none;
  }
  .el-message-box__status + .el-message-box__message {
    padding-left: 0;
  }
  .el-message-box__btns {
    text-align: @dFooterAlign;
    margin-top: 30px;
    position: absolute;
    right: 5px;
    bottom: 20px;
    .el-button {
      padding: 0;
      height: 36px;
      line-height: 36px;
      width: 106px;
      text-align: center;
    }
  }
}
.dDransferHeader {
  margin-bottom: 20px;
  font-size: 18px;
  position: relative;
  top: -10px;
  margin-bottom: 0px;
  font-weight: normal;
}
.el-transfer {
  .el-transfer-panel {
    width: 245px;
  }
}
.el-transfer__buttons {
  padding: 0 20px;
}
.judge {
  color: #3e3f42;
  display: inline-block;
  margin-bottom: 20px;
  text-align: left;
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
    color: #3ba1ff !important;
  }
}

.edit .el-icon-close::before {
  content: '';
}
.pro .el-submenu__title {
  padding-left: 49px !important;
}
.el-main {
  border-top: 1px solid #ebeef5;
  padding: 0px 30px 0 30px !important;
}
.el-menu-vertical-demo.el-menu--collapse.el-menu {
  .logo {
    width: 64px;
    height: 134px;
    .in {
      width: 53%;
      height: 53%;
      background: url(../assets/images/logo-smail.png) no-repeat 0px 0px;
      background-size: 100% 100%;
      color: #fff;
      margin: 18px auto;
    }
  }
  // 侧边栏收起的时候高亮
  .el-submenu.is-active {
    .el-submenu__title {
      text-align: right;
      background-color: #1989fa !important;
    }
  }
}
.el-submenu.is-active .el-submenu__title:hover {
  background-color: #252529 !important;
}
.el-menu-item {
  .link {
    color: rgb(159, 159, 141);
    display: block;
    text-decoration: none;
  }
}
.el-menu-item.is-active {
  .link {
    color: #fff;
  }
}
</style>
