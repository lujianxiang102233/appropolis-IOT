<template>
    <div class="home">
        <el-container>
        <el-header style="height: 64px">
            <div class="login">
              <img src="../assets/images/u5.png" alt="">
            </div>
            <div class="title">
              <img src="../assets/images/u67.png" alt="">
              <span class="text">APPROPOLIS</span>
              <span id="edit">变更</span>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
export default {

}
</script>

<style scope lang="less">
.el-container {
  height: 100%;
  .el-header {
    color: #333;
    text-align: center;
    padding: 0;
    height: 64px;
    line-height: 64px;
    .login {
      height: 100%;
      float: left;
      width: 256px;
      background-color: #C0CAD3;
      line-height:64px;
        img {
          height: 26.5px;
          vertical-align: middle;
        }
    }
    .title {
      background-color: #fff;
      height: 64px;
      line-height: 64px;
      font-size: 28px;
      float: left;
      width: 500px;
      img {
        width: 20px;
        height: 15px;
        float: left;
        margin-top: 28px;
        margin-left: 28px;
      }
      .text {
        font-size: 28px;
        color: #333;
        float: left;
        font-weight: bold;
        margin-left: 27px;
      }
      #edit {
        color:#18ABFF;
        float: left;
        margin-left: 33px;
        font-size: 14px;
      }
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);
    .el-menu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
}
</style>
