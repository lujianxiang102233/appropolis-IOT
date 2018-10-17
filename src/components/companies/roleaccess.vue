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
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
      <el-table
      :data="funcTable"
      height="350"
      style="width: 100%">
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
    <el-dialog
      title="新建一级功能点"
      :visible.sync="addDalogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="addForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input v-model="addForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu">
          <el-radio v-model="addForm.menu" label="true">是</el-radio>
          <el-radio v-model="addForm.menu" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input  v-model="addForm.url"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面内打开" prop="newTab">
          <el-radio v-model="addForm.newTab" label="true">是</el-radio>
          <el-radio v-model="addForm.newTab" label="false">否</el-radio>
        </el-form-item>
        <el-form-item v-if="addForm.menu =='true'" label="权重" prop="weight">
          <el-input  v-model="addForm.weight"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="功能点描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建功能点"
      :visible.sync="addsubDalogVisible"
      width="40%">
      <el-form :model="addsubForm" :rules="rules" ref="addsubForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="父级功能点名称" prop="paipermissionName">
          <el-input v-model="paipermissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="父级FUNCID" prop="paipermissionCode">
          <el-input v-model="paipermissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="addsubForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input v-model="addsubForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu">
          <el-radio v-model="addsubForm.menu" label="true">是</el-radio>
          <el-radio v-model="addsubForm.menu" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input  v-model="addsubForm.url"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面内打开" prop="newTab">
          <el-radio v-model="addsubForm.newTab" label="true">是</el-radio>
          <el-radio v-model="addsubForm.newTab" label="false">否</el-radio>
        </el-form-item>
        <el-form-item v-if="addsubForm.menu =='true'" label="权重" prop="weight">
          <el-input  v-model="addsubForm.weight"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="功能点描述" prop="remark">
          <el-input type="textarea" v-model="addsubForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addsubCancel">取 消</el-button>
        <el-button type="primary" @click="addSubTrue('addsubForm')">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog
      title="编辑功能点"
      :visible.sync="editDalogVisible"
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="editForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input v-model="editForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu">
          <el-radio v-model="editForm.menu" label="true">是</el-radio>
          <el-radio v-model="editForm.menu" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input  v-model="editForm.url"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面内打开" prop="newTab">
          <el-radio v-model="editForm.newTab" label="true">是</el-radio>
          <el-radio v-model="editForm.newTab" label="false">否</el-radio>
        </el-form-item>
        <el-form-item v-if="editForm.menu =='true'" label="权重" prop="weight">
          <el-input  v-model="editForm.weight"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="功能点描述" prop="remark">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog
      title="请选择模板公司"
      :visible.sync="copyDalogVisible"
      width="40%">
      <el-form :model="copyForm" :rules="rules" ref="copyForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公司名称" prop="state">
           <el-autocomplete
          class="inline-input"
          v-model="copyForm.state"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          style="width:360px;"
          @select="handleSelect"
        >
        </el-autocomplete>
         <i class="el-icon-circle-close" v-show="copyForm.state.length > 0" @click="clear" style="position:absolute; top:13px; right:31px;"></i>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="copy('copyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    return {
      addDalogVisible: false,
      addsubDalogVisible: false,
      editDalogVisible: false,
      copyDalogVisible: false,
      addForm: {
        permissionName: '',
        permissionCode: '',
        url: '',
        weight: '',
        menu: 'true',
        newTab: 'true',
        remark: '',
        children: []
      },
      editForm: {
        permissionName: '',
        permissionCode: '',
        url: '',
        weight: '',
        menu: 'true',
        newTab: 'true',
        remark: '',
        children: []
      },
      addsubForm: {
        permissionName: '',
        permissionCode: '',
        url: '',
        weight: '',
        menu: 'true',
        newTab: 'true',
        remark: '',
        children: []
      },
      copyForm: {
        state: ''
      },
      companyId: '',
      companyName: '',
      rules: {
        permissionName: [
          { required: true, message: '请输入功能点名称', trigger: 'blur' },
          {
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,50}$/,
            message: '最长50个中文字符',
            trigger: 'change'
          }
        ],
        permissionCode: [
          { required: true, message: '请输入FUNCID', trigger: 'blur' },
          {
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,100}$/,
            message: '最长100个中文字符',
            trigger: 'change'
          }
        ],
        remark: [
          { required: false, message: '请输入功能点描述', trigger: 'blur' },
          {
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,50}$/,
            message: '最长50个中文字符',
            trigger: 'change'
          }
        ],
        weight: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          {
            pattern: /^[1-9]\d{0,9}$/,
            message: '10位以内正整数',
            trigger: 'change'
          }
        ],
        url: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          {
            pattern: /^\w{0,1000}$/,
            message: '最长1000个中文字符',
            trigger: 'change'
          }
        ],
        state: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          {
            pattern: /[\s\S]/,
            message: '最长1000个中文字符',
            trigger: 'change'
          }
        ]
      },
      coList: [],
      funcTable: [],
      queryTable: {
        permissionName: '',
        permissionCode: ''
      },
      treeList: {},
      paipermissionName: '',
      paipermissionCode: '',
      paiId: '',
      restaurants: [],
      copyList: []
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
    },
    add(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.treeList.permissionTree.push(this.addForm)
          let res = await this.axios.post(
            `/company/permission/${this.$route.query.id}/${
              this.addForm.permissionName
            }`,
            {
              permissionTree: this.treeList.permissionTree,
              version: this.treeList.version
            }
          )
          let { code } = res.data.content
          if (code === +-3009) {
            this.$message.error(`权限已存在`)
          }
          if (code === +-3010) {
            this.$message.error(`权限已授权`)
          }
          if (code === +-3009) {
            this.$message.error(`权限树版本问题`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.getList()
            this.addDalogVisible = false
            this.$message.success('新建一级功能点成功')
            this.addForm.permissionName = ''
            this.addForm.permissionCode = ''
            this.addForm.url = ''
            this.addForm.weight = ''
            this.addForm.menu = 'true'
            this.addForm.newTab = 'true'
            this.addForm.remark = ''
            this.addForm.children = []
          }
        } else {
          return false
        }
      })
    },
    addCancel() {
      this.addDalogVisible = false
      this.addForm.permissionName = ''
      this.addForm.permissionCode = ''
      this.addForm.url = ''
      this.addForm.weight = ''
      this.addForm.menu = 'true'
      this.addForm.newTab = 'true'
      this.addForm.remark = ''
      this.addForm.children = []
    },
    addsub(row) {
      this.addsubDalogVisible = true
      this.paipermissionName = row.permissionName
      this.paipermissionCode = row.permissionCode
      this.paiId = row.id
    },
    addSubTrue(formName) {
      function getAddArray(data, id, child) {
        for (var i in data) {
          if (data[i].id === id) {
            data[i].children.push(child)
          }
          if (data[i].children.length > 0) {
            getAddArray(data[i].children, id, child)
          }
        }
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          getAddArray(this.treeList.permissionTree, this.paiId, this.addsubForm)
          console.log(this.treeList.permissionTree)
          let res = await this.axios.post(
            `/company/permission/${this.$route.query.id}/${
              this.addsubForm.permissionName
            }`,
            {
              permissionTree: this.treeList.permissionTree,
              version: this.treeList.version
            }
          )
          let { code } = res.data.content
          if (code === +-3009) {
            this.$message.error(`权限已存在`)
          }
          if (code === +-3010) {
            this.$message.error(`权限已授权`)
          }
          if (code === +-3009) {
            this.$message.error(`权限树版本问题`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
          }
          if (code === +0) {
            this.getList()
            this.addsubDalogVisible = false
            this.$message.success('添加功能点成功')
            this.addsubForm.permissionName = ''
            this.addsubForm.permissionCode = ''
            this.addsubForm.url = ''
            this.addsubForm.weight = ''
            this.addsubForm.menu = 'true'
            this.addsubForm.newTab = 'true'
            this.addsubForm.remark = ''
            this.addsubForm.children = []
          }
        } else {
          return false
        }
      })
    },
    addsubCancel() {
      this.addsubDalogVisible = false
      this.addsubForm.permissionName = ''
      this.addsubForm.permissionCode = ''
      this.addsubForm.url = ''
      this.addsubForm.weight = ''
      this.addsubForm.menu = 'true'
      this.addsubForm.newTab = 'true'
      this.addsubForm.remark = ''
      this.addsubForm.children = []
    },
    edit(row) {
      let {
        permissionName,
        permissionCode,
        url,
        menu,
        weight,
        newTab,
        remark,
        children
      } = row
      this.editDalogVisible = true
      this.editForm.permissionName = permissionName
      this.editForm.permissionCode = permissionCode
      this.editForm.url = url
      this.editForm.weight = weight
      this.editForm.menu = String(menu)
      this.editForm.newTab = String(newTab)
      this.editForm.remark = remark
      this.editForm.children = children
      console.log(this.editForm)
    },
    del(row) {
      // console.log(row)
      //  if (roleCount === 0) {
      //   this.$confirm('确定要删除【' + roleName + '】吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   })
      //     .then(async () => {
      //       let res = await this.axios.delete(`/role/${roleId}/${roleName}`)
      //       let { code } = res.data.content
      //       if (code === +0) {
      //         this.$message.success('【' + roleName + '】' + '已删除')
      //         this.getList()
      //       }
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消删除'
      //       })
      //     })
      // } else {
      //   this.$confirm(
      //     '【' +
      //       roleName +
      //       '】下共有【' +
      //       roleCount +
      //       '】名用户，删除角色后用户将取消相应角色及其授权，是否继续',
      //     '提示',
      //     {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      //   )
      //     .then(async () => {
      //       let res = await this.axios.delete(`/role/${roleId}/${roleName}`)
      //       let { code } = res.data.content
      //       if (code === +0) {
      //         this.$message.success('【' + roleName + '】' + '已删除')
      //         this.getList()
      //       }
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消删除'
      //       })
      //     })
      // }
    },
    async render() {
      let res = await this.axios.get(
        `/company/${this.$route.query.companyName}/1/50`
      )
      let {
        code,
        data: { list }
      } = res.data.content
      if (code === +0) {
        this.copyList = list.map(function(item) {
          return {
            value: '【' + item.companyName + '（' + item.companyCode + '）】',
            companyId: item.companyId,
            companyName: item.companyName
          }
        })
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.copyList
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        )
      }
    },
    clear() {
      this.copyForm.state = ''
    },
    copy(formName) {
      // console.log(this.companyId)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // console.log(this.companyId)
          this.$confirm('是否放弃已有权限配置?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              console.log(this.companyId)
              this.getList()
              this.$message.success(`已复制【${this.companyName}】配置权限`)
              this.copyDalogVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消复制权限'
              })
            })
        } else {
          return false
        }
      })
    },
    handleSelect(item) {
      this.companyId = item.companyId
    }
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  },
  created() {
    this.companyId = this.$route.query.id
    this.getList()
  },
  mounted() {
    this.render()
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
