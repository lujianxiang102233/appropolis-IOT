<template>
    <div class="roleaccess" style="padding-left: 34px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色权限</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
        <el-form
          :inline= "true"
          class="role-form"
          :model= "treeTable">
          <div class="filter">筛选</div>
          <el-form-item label="功能点名称">
            <el-input v-model="treeTable.permissionName" placeholder="请输入" size="mini" class="filter-ipt"></el-input>
          </el-form-item>
          <el-form-item label="FUNCID">
            <el-input v-model="treeTable.permissionCode" size="mini" placeholder="请输入" class="filter-ipt"></el-input>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" size="mini">查询</el-button>
            <el-button size="mini">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="table">
          <div class="tableTitle">
            <span class="tree">功能点名称</span>
            <span class="content">FUNCID</span>
            <span class="content">功能描述</span>
          </div>
          <el-tree
            :data = "treeTableData"
            show-checkbox
            node-key = "id"
            default-expand-all
            :expand-on-click-node = "false">
            <span slot-scope= "{node,data}" class="treeTable">
              <span class="tree">{{data.permissionName}}</span>
              <span class="content overflowClass">
                {{data.permissionCode?data.permissionCode:"--"}}
              </span>
              <span class="content overflowClass">
                {{data.remark?data.remark:"--"}}
              </span>
            </span>
          </el-tree>
        </div>
        <el-form>
          <el-form-item class="fr">
            <el-button size = "mini">取消</el-button>
            <el-button type = "primary" size="mini">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  data() {
    return {
      treeTable: {
        permissionName: '',
        permissionCode: ''
      },
      // 下为用
      treeItem: ''
    }
  },
  created() {
    this.getData()
    this.get()
  },
  mounted() {},
  methods: {
    get() {
      this.axios
        .get('/role/permission/40')
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getData() {
      this.treeTableData = JSON.parse(localStorage.getItem('companyTree'))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.roleaccess {
  @tableHeight: 53px;
  @tableBorderBottom: #ebeef5;
  @borderColor: #999;
  .el-breadcrumb__inner {
    color: #999;
  }
  .el-breadcrumb__item:last-child {
    .el-breadcrumb__inner {
      color: #999;
    }
  }
  .role-form {
    border: 1px solid @borderColor;
    padding: 10px;
    margin-top: 10px;
    min-height: 60px;
    .name {
      font-size: 14px;
      font-weight: bold;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .user-form {
      width: 120px;
    }
  }
  .table {
    margin-top: 20px;
    border: 1px solid @borderColor;
    .tableTitle {
      height: @tableHeight;
      line-height: @tableHeight;
      display: flex;
      .tree {
        flex: 1;
        padding-left: 40px;
      }
      .content {
        text-align: center;
        width: 200px;
        padding: 0 10px;
      }
    }
    .treeTable {
      flex: 1;
      display: flex;
      font-size: 14px;
      .tree {
        flex: 1;
      }
      .content {
        text-align: center;
        display: inline-block;
        width: 200px;
        padding: 0 10px;
      }
    }
    .overflowClass {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .el-tree-node__content {
    height: @tableHeight;
    line-height: @tableHeight;
    border-top: 1px solid @tableBorderBottom;
  }
}

// 上为用
</style>
