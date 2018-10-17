<template>
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
                 <li>修改密码</li>
                 <li @click="layout">注销</li>
               </ul>
             </div>
            </div>
        </el-header>
        <el-main><router-view/></el-main>
    </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      isShow: false,
      menusList: []
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
          this.$router.push('./login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
</style>
