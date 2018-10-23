<template>
    <div class="roleaccess" style="padding-left: 34px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item :to= "{ path: '/role' }">角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色权限</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
        <el-form
          :inline= "true"
          class="role-form"
          :model= "treeTable">
          <div class="filter">筛选</div>
          <el-form-item label="功能点名称" :model = "treeTable">
            <el-input
              size="mini"
              v-model = "filterName"
              placeholder= "请输入">
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="FUNCID">
            <el-input
              v-model = "filterCode"
              size="mini"
              placeholder="请输入">
            </el-input>
          </el-form-item> -->
          <el-form-item class="fr">
            <el-button type="primary" size="mini" @click= "onSubmit()">查询</el-button>
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
            :filter-node-method= "filterNode"
            ref="tree"
            :default-checked-keys= "checkedKeys">
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
            <el-button size = "mini" @click= "cancal()">取消</el-button>
            <el-button type = "primary" size="mini" @click = "submit()">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  },
  data() {
    return {
      // 下为用
      treeTable: {
        permissionName: '',
        permissionCode: ''
      },
      filterName: '',
      filterCode: '',
      checkedCodes: [],
      checkedKeys: []
    }
  },
  created() {
    this.getTreeData()
    this.get()
    this.checked(this.treeTableData)
    this.change(this.treeTableData)
  },
  mounted() {},
  watch: {
    filterName(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 模糊匹配
    filterNode(value, data) {
      if (!value) return true
      return data.permissionName.indexOf(value) !== -1
    },
    // code转换key值
    checked(forData) {
      for (let item of forData) {
        if (this.checkedCodes.includes(item.permissionCode)) {
          this.checkedKeys.push(item.id)
        } else if (item.children.length > 0) {
          this.checked(item.children)
        }
        this.checkedKeys.push(item.id)
      }
    },
    // key转换为code值
    change(forData) {
      console.log(forData)
      for (let item of forData) {
        this.checkedKeys = this.checkedKeys.sort((a, b) => {
          return a - b
        })
        if (this.checkedKeys.includes(item.id)) {
          this.checkedCodes.push(item.permissionCode)
        } else if (item.children.length > 0) {
          this.change(item.children)
        }
        // this.checkedCodes.push(item.permissionCode)
        console.log(this.checkedCodes)
      }
    },
    goBack() {
      this.$router.push({
        path: '/role'
      })
    },
    // 取消
    cancal() {
      this.goBack()
    },
    // 提交
    submit() {
      if (this.$refs.tree.getCheckedKeys().length === 0) {
        this.$confirm('尚未设置角色权限', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '编辑生效!'
            })
            this.goBack()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '编辑失败!'
            })
          })
      }
      this.put()
    },
    put() {
      let roleId = this.$route.query.roleId
      let urlRest = `/role/permission/${roleId}`
      this.axios
        .put(urlRest, [
          'permission_co',
          'permission_co_add',
          'permission_co_query',
          'permission_co_resetAdmin',
          'permission_co_func',
          'permission_co_func_query',
          'permission_co_func_add',
          'permission_co_func_addsub',
          'permission_co_func_edit',
          'permission_co_func_del',
          'permission_co_func_copy',
          'permission_role'
        ])
        .then(response => {
          if (response.data.content.data === 1) {
            this.$message('提交成功')
            // this.goBack()
          } else {
            this.$message.error('提交失败')
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    get() {
      let roleId = this.$route.query.roleId
      let urlRest = `/role/permission/${roleId}`
      this.axios
        .get(urlRest)
        .then(response => {
          if (response.data.content.code === 0) {
            this.checkedCodes = response.data.content.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTreeData() {
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
