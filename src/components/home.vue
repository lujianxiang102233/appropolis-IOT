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
            <el-menu-item index="/companies" style="padding-left: 48px;">公司管理</el-menu-item>
            <el-menu-item index="1-2" style="padding-left: 48px;">角色管理</el-menu-item>
            <el-menu-item index="1-3" style="padding-left: 48px;">用户管理</el-menu-item>
            <el-menu-item index="1-4" style="padding-left: 48px;">操作日志</el-menu-item>
        </el-submenu>
    </el-menu>
    <el-container>
        <el-header style="height: 64px;">
            <div class="img">
             <img src="../assets/images/u67.png" @click="collapse">
            </div>
            <span class="text">APPROPOLIS</span>
            <span id="edit">变更</span>
        </el-header>
        <el-main><router-view/></el-main>
    </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
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
    float: left;
    width: 500px;
    .img {
      height: 100%;
      width: 77px;
      float: left;
      cursor: pointer;
      img {
        width: 20px;
        height: 15px;
        margin-top: 28px;
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
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 256px;
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
    .el-menu-item.is-active:visited {
      background-color: red !important;
    }
  }
}
</style>
