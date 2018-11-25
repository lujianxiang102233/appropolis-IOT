<template>
    <div class="roleaccess" >
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="first">权限管理</el-breadcrumb-item>
          <el-breadcrumb-item class="first" :to= "{ path: '/role' }">角色管理</el-breadcrumb-item>
          <el-breadcrumb-item class="two">角色权限</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if= "this.authQuery">
          <div class="editCom"><p>编辑【{{this.roleName}}】权限</p></div>
          <el-form
            :inline= "true"
            class="clearfix demo-form-inline"
            ref="formInline">
            <div class="filter">筛选</div>
            <el-form-item label="功能点名称">
              <el-input
                :clearable = "true"
                size="mini"
                v-model.trim= "filterName"
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
              <el-button type="primary" size="mini" @click= "onSubmit(filterName)">查询</el-button>
              <el-button size="mini" @click = "onReset(filterName)">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="table" :height = "treeHeight">
            <div class="tableTitle">
              <span class="tree">功能点名称</span>
              <span class="content">FUNCID</span>
              <span class="content">功能描述</span>
            </div>
            <el-tree
              class="treeWrapper"
              ref="tree"
              :data = "treeTableData"
              show-checkbox
              node-key = "id"
              :default-expanded-keys = "expandedKeys"
              :filter-node-method= "filterNode"
              @check = "onCheck()">
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
          <el-form v-if= "this.authEdit" class="role-btn">
            <el-form-item class="fr">
              <el-button size = "mini" @click= "cancal()">取消</el-button>
              <el-button type = "primary" size="mini" @click = "submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if= "!this.authQuery" style="text-align:center;margin-top:60px;color:#666">
          您没有当前api访问权限 ~
        </div>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  },
  data() {
    return {
      tableHeight: '',
      roleName: '',
      filterName: '',
      filterCode: '',
      checkedCodes: [],
      checkedKeys: [],
      expandedKeys: [],
      // 获取一级code
      codes: [],
      authQuery: ''
    }
  },
  created() {
    this.getTreeData()
    this.roleName = this.$route.query.roleName
    this.authQuery = localStorage
      .getItem('points')
      .includes('permission_role_auth_query')
    if (this.authQuery) {
      this.$nextTick(() => {
        this.treeHeight()
      })
      this.fixedTableHeight()
    }
  },
  mounted() {
    if (this.authQuery) {
      window.onresize = () => {
        return (() => {
          this.treeHeight()
        })()
      }
    }
  },
  beforeDestroy() {
    window.onresize = () => {
      return ''
    }
  },
  watch: {
    // keys(cur, old) {
    //   console.log(old, 'old')
    //   console.log(cur, 'cur')
    // }
  },
  methods: {
    // 树的高度
    treeHeight() {
      this.$refs.tree.$el.style.height =
        document.documentElement.clientHeight -
        (this.$refs.formInline.$el.offsetHeight + 296) +
        'px'
    },
    fixedTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 320
    },
    // 查询
    onSubmit(val) {
      this.$refs.tree.filter(val)
    },
    // 重置
    onReset(formInline) {
      this.filterName = ''
      this.getTreeData()
      this.getCheckedData()
    },
    // 勾选获取
    onCheck(data) {
      // this.checkedKeys = this.$refs.tree.getCheckedKeys()
      this.getAllKeys()
      this.checkedCodes = []
      this.changedCodes(this.treeTableData, this.checkedKeys)
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
      this.putData()
      this.checkedCodes = []
    },
    // 模糊匹配点击
    filterNode(value, data) {
      if (!value) return true
      return data.permissionName.indexOf(value) !== -1
    },
    // 返回上一级
    goBack() {
      this.$router.push({
        path: '/role'
      })
    },
    // 默认展开一二级
    getExpanded() {
      this.expandedKeys = this.treeTableData.map(item => {
        if (item) {
          return item.id
        } else {
          return ''
        }
      })
    },
    // 勾选获取所有keys
    getAllKeys() {
      this.checkedKeys = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
    },
    // 获取所有的有分支的父节点的codes
    getHalfsCodes(forData) {
      for (let item of forData) {
        if (item.children.length > 0) {
          this.codes.push(item.permissionCode)
          this.getHalfsCodes(item.children)
        }
      }
    },
    // 获取除去父节点所有的分支的codes
    setHalfsCodes() {
      this.getHalfsCodes(this.treeTableData)
      this.checkedCodes = this.checkedCodes.filter(item => {
        return !this.codes.includes(item)
      })
    },
    // key转换code值 &&获取codes ==修改勾选
    changedCodes(forData, key) {
      for (let item of forData) {
        if (item.children.length === 0 && key.includes(item.id)) {
          this.checkedCodes.push(item.permissionCode)
        } else if (item.children.length > 0 && key.includes(item.id)) {
          this.checkedCodes.push(item.permissionCode)
          this.changedCodes(item.children, key)
        } else if (!key.includes(item.id) && item.children.length > 0) {
          this.changedCodes(item.children, key)
        }
      }
      this.checkedCodes = Array.from(new Set(this.checkedCodes))
    },
    // code转换key值 &&获取checkedKeys ==默认展示
    changedKeys(forData, code) {
      for (let item of forData) {
        if (item.children.length === 0 && code.includes(item.permissionCode)) {
          this.checkedKeys.push(item.id)
        } else if (
          item.children.length > 0 &&
          code.includes(item.permissionCode)
        ) {
          this.checkedKeys.push(item.id)
          this.changedKeys(item.children, code)
        } else if (
          !code.includes(item.permissionCode) &&
          item.children.length > 0
        ) {
          this.changedKeys(item.children, code)
        }
      }
    },
    // 每个节点添加disabled
    setDisabled(forData) {
      if (!this.authEdit) {
        for (let item of forData) {
          if (item.children.length === 0) {
            Object.assign(item, { disabled: true })
          } else if (item.children.length > 0) {
            Object.assign(item, { disabled: true })
            this.setDisabled(item.children)
          }
        }
      }
    },
    // 提交编辑data
    putData() {
      let roleId = this.$route.query.roleId
      let urlRest = `/role/permission/${roleId}`
      this.axios
        .put(urlRest, this.checkedCodes)
        .then(response => {
          if (response.data.content.data === 1) {
            this.$message('提交成功')
            this.goBack()
          } else {
            this.$message.error('提交失败')
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取勾选data
    getCheckedData() {
      let roleId = this.$route.query.roleId
      let urlRest = `/role/permission/${roleId}`
      this.axios
        .get(urlRest)
        .then(response => {
          if (response.data.content.code === 0) {
            this.checkedCodes = response.data.content.data
            this.setHalfsCodes()
            this.changedKeys(this.treeTableData, this.checkedCodes)
            this.$refs.tree.setCheckedKeys(this.checkedKeys)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取treedata
    getTreeData() {
      this.treeTableData = JSON.parse(localStorage.getItem('companyTree'))
      // 是否有编辑权限// console.log(permission_role_auth_edit)
      this.authEdit = localStorage
        .getItem('points')
        .includes('permission_role_auth_edit')
      // 根据权限判断是否可编辑
      this.setDisabled(this.treeTableData)
      // 勾选已选中
      this.getCheckedData()
      // 默认展示一二级
      this.getExpanded()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.roleaccess {
  @tableHeight: 42px;
  @tableBorderBottom: #ebeef5;
  @borderColor: #ebeef5;
  .el-breadcrumb__item {
    height: 58px;
    line-height: 58px;
    /deep/ .el-breadcrumb__inner {
      font-size: 16px;
    }
    &.first {
      /deep/ .el-breadcrumb__inner,
      /deep/ .el-breadcrumb__separator {
        color: #3e3f42;
        font-weight: bold;
      }
    }
    &.two {
      /deep/ .el-breadcrumb__inner {
        color: #9ea0a5;
      }
    }
  }
  .editCom {
    margin-bottom: 16px;
    p {
      font-size: 22px;
      font-weight: 700;
      color: #1989fa;
    }
  }
  .demo-form-inline {
    border: 1px solid #ebeef5;
    min-height: 60px;
    .el-form-item {
      margin-bottom: 0;
      height: 64px;
      line-height: 64px;
      padding-left: 30px;
      .el-form-item__label {
        padding-right: 20px;
        font-size: 16px;
        text-align: center;
      }
      .el-form-item__content {
        height: 64px;
        line-height: 64px;
        width: 225px;
        margin-right: 20px;
        .el-input--suffix .el-input__inner {
          height: 38px;
          line-height: 38px;
          width: 226px;
        }
        .el-button {
          height: 36px;
          width: 105px;
          letter-spacing: 20px;
          text-indent: 15px;
          font-size: 14px;
        }
        .el-button--default span {
          color: #606266;
        }
        .el-button--primary {
          background-color: #1989fa;
        }
      }
    }
    .filter {
      font-size: 16px;
      font-weight: bold;
      height: 41px;
      line-height: 41px;
      padding-left: 58px;
      position: relative;
      border-bottom: 1px solid #ebeef5;
      &::before {
        content: '';
        height: 16px;
        width: 16px;
        background: url(../../assets/images/icon_筛选.png) no-repeat center
          center;
        position: absolute;
        top: 13px;
        left: 30px;
      }
    }
  }
  .table {
    margin-top: 20px;
    border: 1px solid @borderColor;
    .tableTitle {
      height: @tableHeight;
      line-height: @tableHeight;
      display: flex;
      border-bottom: 1px solid @tableBorderBottom;
      .tree {
        flex: 1;
        padding-left: 40px;
      }
      .content {
        text-align: left;
        width: 210px;
        padding: 0 10px;
      }
    }
    .treeWrapper {
      overflow: auto;
    }
    .treeTable {
      flex: 1;
      display: flex;
      font-size: 14px;
      height: 48px;
      .tree {
        flex: 1;
      }
      .content {
        text-align: left;
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
    border-bottom: 1px solid @tableBorderBottom;
  }
  .role-btn {
    .el-form-item__content {
      top: 10px;
    }
  }
}

// 上为用
</style>
