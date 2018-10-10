<template>
  <div class="companyaccess" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/companies' }">公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
    <el-form :inline="true" class="demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_co_func_query')>-1" :model="queryTable">
      <div class="filter">筛选</div>
      <el-form-item label="功能点名称">
        <el-input v-model="companyName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item label="FUNCID">
        <el-input v-model="companyName" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="medium">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_add')>-1">+ 新建一级功能点</el-button>
     <el-button type="primary" style="margin:0px 40px;" size="medium" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_copy')>-1">复制其他公司权限</el-button>
      <el-table
      :data="funcTable"
      height="350"
      style="width: 100%">
      <el-table-tree-column
        :indent-size="30"
        parent-key="parentId"
        prop="permissionName"
        width="170"
        label="功能点名称">
        <template slot-scope="scope">
          <span class="elliSpan" :title="scope.row.permissionName">{{scope.row.permissionName}}</span>
        </template>
      </el-table-tree-column>
      <el-table-column
        prop="permissionCode"
        width="150"
        label="FUNCID">
         <template slot-scope="scope">
          <div class="elli" :title="scope.row.permissionCode">{{scope.row.permissionCode}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="menu"
        width="120"
        label="菜单栏（权重）">
       <template slot-scope="scope">
          {{scope.row.menu?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        width="140"
        label="url">
        <template slot-scope="scope">
          <a href="scope.row.url" class="elli" target="_blank"  :title="scope.row.url">{{scope.row.url}}</a>
          <!-- <div class="elli" :title="scope.row.url">{{scope.row.url}}</div> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        width="150"
        label="功能描述">
        <template slot-scope="scope">
          <div class="elli" :title="scope.row.remark">{{scope.row.remark}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- addsub(scope.row) -->
          <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_addsub')>-1"  plain @click="addsub(scope.row)" >添加</el-button>
          <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_edit')>-1"  plain>编辑</el-button>
          <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_del')>-1"  plain>删除</el-button>
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
      title="新建一级功能点"
      :visible.sync="addsubDalogVisible"
      width="40%">
      <el-form :model="addsubForm" :rules="rules" ref="addsubForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="addsubForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input v-model="addsubForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu">
          <el-radio v-model="addForm.menu" label="true">是</el-radio>
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
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="新建一级功能点"
      :visible.sync="addsubDalogVisible"
      width="40%">
      <el-form :model="addsubForm" :rules="rules" ref="addsubForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="父级功能点名称" prop="paiName">
          <el-input v-model="paiName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="父级FUNCID" prop="paiId">
          <el-input v-model="paiId" placeholder="请输入"></el-input>
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
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addSubTrue('addForm')">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    return {
      dialogVisible: false,
      addDalogVisible: false,
      addsubDalogVisible: false,
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
            pattern: /^([\u2E80-\u9FFF]|[a-zA-Z0-9]){1,1000}$/,
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
        ]
      },
      companyName: '',
      coList: [],
      funcTable: [],
      queryTable: {
        func: '',
        permissionCode: ''
      },
      treeList: {},
      paiName: '',
      paiId: ''
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
      let indexi = 0
      function getArray(data, depth, parentId) {
        for (var i in data) {
          if (data[i].permissionCode !== undefined) {
            data[i].id = ++indexi
            // data[i].label = data[i].permissionName
            data[i].depth = depth
            data[i].parentId = parentId
            data[i].child_num = data[i].children.length
          }
          if (data[i].children.length > 0) {
            let tempDept = depth + 1
            getArray(data[i].children, tempDept, data[i].id)
          }
        }
      }
      this.coList = JSON.parse(localStorage.getItem('points'))
      this.companyId = `${this.$route.query.id}`
      let res = await this.axios.get(
        `/company/permission/${this.$route.query.id}`
      )

      let { code, data } = res.data.content
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
      if (code === 0) {
        let newdata = JSON.parse(data)
        getArray(newdata.permissionTree, 0, null)
        this.funcTable = newdata.permissionTree
        this.treeList = newdata
      }
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
      console.log(row)
      this.paiName = row.permissionName
      this.paiId = row.permissionCode
    },
    addSubTrue(formName) {
      console.log(formName)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // this.treeList.permissionTree.push(this.addForm)
          // console.log(this.addForm)
          // console.log(this.treeList.permissionTree)
          // let res = await this.axios.post(
          //   `/company/permission/${this.$route.query.id}/${
          //     this.addForm.permissionName
          //   }`,
          //   {
          //     permissionTree: this.treeList.permissionTree,
          //     version: this.treeList.version
          //   }
          // )
          // let { code } = res.data.content
          // if (code === +-3009) {
          //   this.$message.error(`权限已存在`)
          // }
          // if (code === +-3010) {
          //   this.$message.error(`权限已授权`)
          // }
          // if (code === +-3009) {
          //   this.$message.error(`权限树版本问题`)
          // }
          // if (code === +-9999) {
          //   this.$message.error(`Exception Message`)
          // }
          // if (code === +0) {
          //   this.getList()
          //   this.addDalogVisible = false
          //   this.$message.success('新建一级功能点成功')
          //   this.addForm.permissionName = ''
          //   this.addForm.permissionCode = ''
          //   this.addForm.url = ''
          //   this.addForm.weight = ''
          //   this.addForm.menu = 'true'
          //   this.addForm.newTab = 'true'
          //   this.addForm.remark = ''
          //   this.addForm.children = []
          // }
        } else {
          return false
        }
      })
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
