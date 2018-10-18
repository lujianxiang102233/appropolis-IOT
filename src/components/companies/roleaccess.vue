<template>
  <div class="companyaccess" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_role_auth_query')>-1" :model="queryTable">
      <div class="filter">筛选</div>
      <el-form-item label="功能点名称">
        <el-input v-model="queryTable.permissionName" placeholder="请输入" size="mini" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="FUNCID">
        <el-input v-model="queryTable.permissionCode" size="mini" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
      <el-table
      :data="funcTable"
      height="350"
      style="width: 100%">
      <el-table-column prop="id" label="id" type="selection" fixed></el-table-column>
      <el-table-tree-column
        :indent-size="30"
        parent-key="parentId"
        prop="permissionName"
        width="370"
        label="功能点名称">
        <template slot-scope="scope">
          <span class="elliSpan" :title="scope.row.permissionName">{{scope.row.permissionName}}</span>
        </template>
      </el-table-tree-column>
      <el-table-column
        prop="permissionCode"
        width="350"
        label="FUNCID">
         <template slot-scope="scope">
          <div class="elli" :title="scope.row.permissionCode">{{scope.row.permissionCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        width="350"
        label="功能描述">
        <template slot-scope="scope">
          <div class="elli" :title="scope.row.remark">{{scope.row.remark}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    return {
      companyId: '',
      coList: [],
      funcTable: [],
      queryTable: {
        permissionName: '',
        permissionCode: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getList() {
      this.coList = JSON.parse(localStorage.getItem('points'))
      let companyTree = JSON.parse(localStorage.getItem('companyTree'))
      this.funcTable = companyTree
    }
  },
  components: {
    'el-table-tree-column': ElTreeGrid
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
.editCom {
  margin-top: 10px;
  p {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.847058823529412);
  }
}
.el-table {
  /deep/ .cell .elli {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 10em;
    height: 23px;
    line-height: 23px;
    // font-size: 12px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-form-item {
    /deep/ .el-autocomplete {
      width: 360px;
    }
  }

  // .el-autocomplete {
  //   position: relative;
  // }

  // .elliSpan {
  //   color: red;
  //   // display: inline-block;
  //   *display: inline;
  //   *zoom: 1;
  //   width: 10em;
  //   height: 23px;
  //   line-height: 23px;
  //   // font-size: 12px;
  //   overflow: hidden;
  //   -ms-text-overflow: ellipsis;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
}
</style>
