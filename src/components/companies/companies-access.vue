<template>
  <div class="companyaccess">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="first">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item class="first" :to="{ path: '/companies' }">公司管理</el-breadcrumb-item>
      <el-breadcrumb-item class="two">公司权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="funQuery">
    <div class="editCom"><p>编辑【{{queryCompanyName}}】权限</p></div>
    <el-form :inline="true" class="clearfix demo-form-inline" ref="formInline" v-if="coList.indexOf('permission_co_func_query')>-1" :model="queryTable">
      <div class="filter">筛选</div>
      <el-form-item label="功能点名称">
        <el-input size="mini" v-model.trim="filterText" placeholder="请输入" class="filter-ipt" :clearable = "true"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit(filterText)" size="mini">查询</el-button>
        <el-button @click="resetForm(filterText)" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" class="top-button" size="mini" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_add')>-1"><img src="../../assets/images/add-icon.png"  class="fl"> <span class="btn-text fr">新建一级功能点</span></el-button>
     <el-button type="primary" class="top-button" size="mini" @click="copyDalogVisible = true" v-if="coList.indexOf('permission_co_func_copy')>-1"><img src="../../assets/images/copy-icon.png"  class="fl"> <span class="btn-text fr">复制其他公司权限</span></el-button>
    <div class="table" >
      <div class="tableTitle">
        <span class="permissionName">功能点名称</span>
        <span class="permissionCode">FUNCID</span>
        <span class="menu">菜单栏（权重）</span>
        <span class="url">url</span>
        <span class="remark">功能描述</span>
        <span class="handle">操作</span>
      </div>
      <div class="treeBody">
        <el-tree
          class="treeWrapper"
          :data = "funcTable"
          node-key = "id"
          :default-expanded-keys = "expandedKeys"
          ref="tree2"
          :filter-node-method="filterNode"
          :expand-on-click-node = "false">
          <template slot-scope= "empty">
            <span class="pic"></span>
          </template>
          <span slot-scope= "{node,data}" class="treeTable">
            <span class="permissionName" >{{data.permissionName}}</span>
            <span class="elli permissionCode" :title="data.permissionCode">{{data.permissionCode}}</span>
            <div  class="menu">{{data.menu?'是':'否'}}&nbsp;&nbsp;&nbsp;<span v-show="data.weight>-1">(</span>{{data.weight}}<span v-show="data.weight >-1">)</span></div>
            <span class="elli url" :title="data.url">{{data.url}}</span>
            <span class="elli remark" :title="data.remark">{{data.remark}}</span>
            <span class="handle">
            <el-button class="operation last"  v-if="coList.indexOf('permission_co_func_addsub')>-1"  plain @click="addsub(data)">添加</el-button>
            <el-button class="operation last" v-if="coList.indexOf('permission_co_func_edit')>-1"  plain @click="edit(data)">编辑</el-button>
            <el-button class="operation last delete" v-if="coList.indexOf('permission_co_func_del')>-1"  plain @click="del(data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      title="新建一级功能点"
      :visible.sync="addDalogVisible"
      :before-close="addHandleClose"
      :close-on-click-modal=false>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="addForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input v-model="addForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu" class="dRadio">
          <el-radio v-model="addForm.menu" label="true">是</el-radio>
          <el-radio v-model="addForm.menu" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input  v-model="addForm.url"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面内打开" prop="newTab" class="dRadio">
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
        <el-button @click="addCancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建功能点"
      :visible.sync="addsubDalogVisible"
      :before-close="addsubHandleClose"
      :close-on-click-modal=false>
      <el-form :model="addsubForm" :rules="rules" ref="addsubForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="父级功能点名称" prop="paipermissionName">
          <el-input :disabled="true" v-model="paipermissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="父级FUNCID" prop="paipermissionCode">
          <el-input :disabled="true" v-model="paipermissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="addsubForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input v-model="addsubForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu" class="dRadio">
          <el-radio v-model="addsubForm.menu" label="true">是</el-radio>
          <el-radio v-model="addsubForm.menu" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input  v-model="addsubForm.url"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面内打开" prop="newTab" class="dRadio">
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
        <el-button @click="addsubCancel('addsubForm')">取 消</el-button>
        <el-button type="primary" @click="addSubTrue('addsubForm')">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog
      title="编辑功能点"
      :visible.sync="editDalogVisible"
      :before-close="editHandleClose"
      :close-on-click-modal=false>
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="功能点名称" prop="permissionName">
          <el-input v-model="editForm.permissionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="FUNCID" prop="permissionCode">
          <el-input :disabled="disabled" v-model="editForm.permissionCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否菜单栏" prop="menu" class="dRadio">
          <el-radio v-model="editForm.menu" label="true">是</el-radio>
          <el-radio v-model="editForm.menu" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input  v-model="editForm.url"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面内打开" prop="newTab" class="dRadio">
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
        <el-button @click="editDalogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editTrue('editForm')">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog
      title="请选择模板公司"
      :visible.sync="copyDalogVisible"
      :before-close="copyHandleClose"
      :close-on-click-modal=false>
      <el-form :model="copyForm" :rules="rules" ref="copyForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="公司名称" prop="state">
           <el-autocomplete
          class="inline-input"
          v-model="copyForm.state"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          style="width:360px;"
          @select="handleSelect">
        </el-autocomplete>
         <i class="el-icon-circle-close" v-show="copyForm.state.length > 0" @click="clear" style="position:absolute; top:13px; right:31px;"></i>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyCancel('copyForm')">取 消</el-button>
        <el-button type="primary" @click="copy('copyForm')">确 定</el-button>
      </span>
    </el-dialog>
    </div>
     <div class="noText" v-else>您没有当前api访问权限 ~</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      disabled: false,
      funQuery: '',
      filterText: '',
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
      nowCompanyId: '',
      companyName: '',
      queryCompanyName: '',
      rules: {
        permissionName: [
          { required: true, message: '请输入功能点名称', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '最长50个中文字符',
            trigger: 'blur'
          }
        ],
        permissionCode: [
          { required: true, message: '请输入FUNCID', trigger: 'blur' },
          {
            min: 0,
            max: 100,
            message: '最长100个中文字符',
            trigger: 'blur'
          }
        ],
        remark: [
          { required: false, message: '请输入功能点描述', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '最长50个中文字符',
            trigger: 'blur'
          }
        ],
        weight: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          {
            pattern: /^[1-9]\d{0,9}$/,
            message: '10位以内正整数',
            trigger: 'blur'
          }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' },
          {
            min: 0,
            max: 1000,
            message: '最长1000个中文字符',
            trigger: 'blur'
          }
        ],
        state: [
          { required: true, message: '请输入公司名称', trigger: 'change' },
          {
            min: 0,
            max: 1000,
            message: '最长1000个中文字符',
            trigger: 'change'
          }
        ]
      },
      coList: [],
      tableWidth: '',
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
      copyList: [],
      editId: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      expandedKeys: [],
      lastId: ''
    }
  },
  methods: {
    onSubmit(val) {
      this.$refs.tree2.filter(val)
    },
    resetForm(formInline) {
      this.filterText = ''
      this.getList()
    },
    async getList() {
      // debugger
      let indexi = 0
      // 给每组数据添加id值和parentId
      function getArray(data, parentId) {
        for (var i in data) {
          // if (data[i].permissionCode !== undefined) {
          data[i].id = ++indexi
          // data[i].depth = depth
          data[i].parentId = parentId
          // data[i].child_num = data[i].children.length
          // }
          if (data[i].children.length > 0) {
            // let tempDept = depth + 1
            getArray(data[i].children, data[i].id)
          }
        }
      }
      this.coList = JSON.parse(localStorage.getItem('points'))
      this.funQuery = localStorage
        .getItem('points')
        .includes('permission_co_func_query')
      let res = await this.axios.get(
        `/company/permission/${this.$route.query.id}`
      )
      let { code, data } = res.data.content
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
      if (code === 0) {
        let newdata = JSON.parse(data)
        getArray(newdata.permissionTree, null)
        this.funcTable = newdata.permissionTree
        if (this.funcTable !== undefined) {
          this.expandedKeys = this.funcTable.map(item => {
            if (item.id) {
              return item.id
            } else {
              return ''
            }
          })
        }
        this.treeList = newdata
      }
    },
    add(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.addForm.menu === 'false') {
            this.addForm.weight = ''
          }
          if (this.treeList.permissionTree === undefined) {
            this.treeList.permissionTree = []
            this.treeList.permissionTree.push(this.addForm)
          } else {
            this.treeList.permissionTree.push(this.addForm)
          }
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
          if (code === +-3011) {
            this.$message.error(`权限树版本问题`)
          }
          if (code === +-9999) {
            this.$message.error(`Exception Message`)
            this.getList()
          }
          if (code === +0) {
            this.getList()
            this.addDalogVisible = false
            this.$message.success('新建一级功能点成功')
            this.$refs[formName].resetFields()
          }
        } else {
          return false
        }
      })
    },
    addCancel(formName) {
      this.addDalogVisible = false
      this.$refs[formName].resetFields()
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
            break
          }
          if (data[i].children.length > 0) {
            getAddArray(data[i].children, id, child)
          }
        }
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.addsubForm.menu === 'false') {
            this.addsubForm.weight = ''
          }
          getAddArray(this.treeList.permissionTree, this.paiId, this.addsubForm)
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
            this.getList()
          }
          if (code === +0) {
            this.getList()
            this.addsubDalogVisible = false
            this.$message.success('添加功能点成功')
            this.$refs[formName].resetFields()
          }
        } else {
          return false
        }
      })
    },
    addsubCancel(formName) {
      this.addsubDalogVisible = false
      this.$refs[formName].resetFields()
    },
    async edit(row) {
      let {
        permissionName,
        permissionCode,
        url,
        menu,
        weight,
        newTab,
        remark,
        children,
        id
      } = row
      let getUrl = `/company/checkCompanyPermissionChildrenAndRoles/${
        this.$route.query.id
      }/${permissionCode}`
      if (permissionCode === undefined) {
        getUrl = `/company/checkCompanyPermissionChildrenAndRoles/${
          this.$route.query.id
        }/{funcId}`
      }
      let res = await this.axios.put(getUrl, {
        permissionTree: this.treeList.permissionTree,
        version: this.treeList.version
      })
      let {
        code,
        data: { numOfRoles, firstRolesName }
      } = res.data.content
      if (code === 0) {
        if (numOfRoles === 1) {
          this.disabled = true
          this.$confirm(
            `该功能点已配置给【${firstRolesName}】,FUNID不可编辑，如需编辑FUNCID请先取消角色授权`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.editDalogVisible = true
              this.editForm.permissionName = permissionName
              this.editForm.permissionCode = permissionCode
              this.editForm.url = url
              this.editForm.weight = weight
              this.editForm.menu = String(menu)
              this.editForm.newTab = String(newTab)
              this.editForm.remark = remark
              this.editForm.children = children
              this.editId = id
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消编辑功能点'
              })
            })
        } else if (numOfRoles > 1) {
          this.disabled = true
          this.$confirm(
            `该功能点已配置给【${firstRolesName}】等【${numOfRoles}】个角色,FUNID不可编辑，如需编辑FUNCID请先取消角色授权`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.editDalogVisible = true
              this.editForm.permissionName = permissionName
              this.editForm.permissionCode = permissionCode
              this.editForm.url = url
              this.editForm.weight = weight
              this.editForm.menu = String(menu)
              this.editForm.newTab = String(newTab)
              this.editForm.remark = remark
              this.editForm.children = children
              this.editId = id
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消编辑功能点'
              })
            })
        } else {
          this.disabled = false
          this.editDalogVisible = true
          this.editForm.permissionName = permissionName
          this.editForm.permissionCode = permissionCode
          this.editForm.url = url
          this.editForm.weight = weight
          this.editForm.menu = String(menu)
          this.editForm.newTab = String(newTab)
          this.editForm.remark = remark
          this.editForm.children = children
          this.editId = id
        }
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
    },
    async del(row) {
      let { id, permissionCode, permissionName } = row
      this.editId = id
      let getUrl = `/company/checkCompanyPermissionChildrenAndRoles/${
        this.$route.query.id
      }/${permissionCode}`
      if (permissionCode === undefined) {
        getUrl = `/company/checkCompanyPermissionChildrenAndRoles/${
          this.$route.query.id
        }/{funcId}`
      }
      let res1 = await this.axios.put(getUrl, {
        permissionTree: this.treeList.permissionTree,
        version: this.treeList.version
      })
      let {
        code,
        data: { numOfChildren, numOfRoles, firstRolesName }
      } = res1.data.content
      function getAddArray(data, id) {
        for (var i in data) {
          if (data[i].id === id) {
            data.splice(i, 1)
            break
          }
          if (data[i].children.length > 0) {
            getAddArray(data[i].children, id)
          }
        }
      }
      if (code === 0) {
        if (numOfChildren <= 0 && numOfRoles <= 0) {
          this.$confirm(
            `确定取消【${
              this.$route.query.companyName
            }】关于【${permissionName}】的授权吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(async () => {
              getAddArray(this.treeList.permissionTree, this.editId)
              let delUrl = `/company/permission/${
                this.$route.query.id
              }/${permissionCode}/${permissionName}`
              if (permissionCode === undefined) {
                delUrl = `/company/permission/${
                  this.$route.query.id
                }/{permissionCode}/${permissionName}`
              }
              let res2 = await this.axios.put(delUrl, {
                permissionTree: this.treeList.permissionTree,
                version: this.treeList.version
              })
              let { code } = res2.data.content
              if (code === 0) {
                this.$message.success(
                  `已取消【${
                    this.$route.query.companyName
                  }】的【${permissionName}】权限`
                )
                this.getList()
                this.show = true
              }
              if (code === -9999) {
                this.$message.error('Exception Message')
              }
              if (code === -3009) {
                this.$message.error('权限已存在')
              }
              if (code === -3010) {
                this.$message.error('权限已授权')
              }
              if (code === -3011) {
                this.$message.error('权限树版本问题')
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else if (numOfChildren > 0) {
          this.$message.error('无法删除，请先删除该功能下的其他子功能点')
        } else if (numOfChildren === 0 && numOfRoles === 1) {
          this.$message.error(
            `无法删除，【${
              row.permissionName
            }】已授权给【${firstRolesName}】,请先取消对角色的授权`
          )
        } else {
          this.$message.error(
            `无法删除，【${
              row.permissionName
            }】已授权给【${firstRolesName}】等【${numOfRoles}】个角色,请先取消对角色的授权`
          )
        }
      }
    },
    async render() {
      let res = await this.axios.get(`/company/{companyName}/1/50`)
      let {
        code,
        data: { list }
      } = res.data.content
      if (code === +0) {
        this.copyList = list.map(function(item) {
          return {
            value: `【${item.companyName}(${item.companyCode}】`,
            companyId: item.companyId,
            companyName: item.companyName
          }
        })
        // 去除登录时（自己）的公司名称
        let index = ''
        this.copyList.forEach((value, i) => {
          if (Number(value.companyId) === Number(this.$route.query.id)) {
            index += i
          }
        })
        this.copyList.splice(index, 1)
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
    },
    copyCancel(formName) {
      this.copyDalogVisible = false
      this.$refs[formName].resetFields()
    },
    // 搜索输入的字符并返回
    querySearch(queryString, cb) {
      var restaurants = this.copyList
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      cb(results)
    },
    // 搜索要求，！==-1是指只要包含该字符即可
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
    async copyRender() {
      let res = await this.axios.post(
        `/company/permission/copy/${this.nowCompanyId}/${this.lastId}`
      )
      let { data } = res.data.content
      if (data === 1) {
        this.getList()
        this.lastId = this.nowCompanyId
      }
      if (data === 0) {
        this.$message.error('复制其他公司权限失败')
      }
    },
    copy(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.funcTable !== undefined) {
            this.$confirm('是否放弃已有权限配置?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(async () => {
                this.copyRender()
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
            this.copyRender()
            this.$message.success(`已复制【${this.companyName}】配置权限`)
            this.copyDalogVisible = false
          }
        } else {
          return false
        }
      })
    },
    // 获取被选中的公司的信息
    handleSelect(item) {
      this.nowCompanyId = item.companyId
      this.companyName = item.companyName
    },
    editTrue(formName) {
      function getAddArray(data, id, child) {
        for (var i in data) {
          if (data[i].id === id) {
            data.splice(i, 1, child)
          }
          if (data[i].children.length > 0) {
            getAddArray(data[i].children, id, child)
          }
        }
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          getAddArray(this.treeList.permissionTree, this.editId, this.editForm)
          let getUrl = `/company/permission/${this.$route.query.id}/${
            this.editForm.permissionCode
          }`
          if (this.editForm.permissionCode.length === 0) {
            getUrl = `/company/permission/${this.$route.query.id}/{
              originalFuncId
            }`
          }
          let res = await this.axios.put(getUrl, {
            permissionTree: this.treeList.permissionTree,
            version: this.treeList.version
          })
          let { code } = res.data.content
          if (code === 0) {
            this.$message.success(`编辑功能完成`)
            this.getList()
          }
          if (code === -3009) {
            this.$message.error('权限已存在')
          }
          if (code === -3010) {
            this.$message.error('权限已授权')
          }
          if (code === -3011) {
            this.$message.error('权限树版本问题')
          }
          this.editDalogVisible = false
        } else {
          return false
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.permissionName.indexOf(value) !== -1
    },
    addHandleClose(done) {
      done()
      this.$refs.addForm.resetFields()
    },
    addsubHandleClose(done) {
      done()
      this.$refs.addsubForm.resetFields()
    },
    editHandleClose(done) {
      done()
      this.$refs.editForm.resetFields()
    },
    copyHandleClose(done) {
      done()
      this.$refs.copyForm.resetFields()
    },
    // 树的高度
    treeHeight() {
      this.$refs.tree2.$el.style.height =
        document.documentElement.clientHeight -
        (this.$refs.formInline.$el.offsetHeight + 338) +
        'px'
    }
  },
  created() {
    this.queryCompanyName = this.$route.query.companyName
    this.lastId = this.$route.query.id
    this.getList()
    if (this.funQuery) {
      this.$nextTick(() => {
        this.treeHeight()
      })
    }
  },
  mounted() {
    // 复制其他公司权限的下拉列表明细
    this.render()
    window.onresize = () => {
      return (() => {
        this.treeHeight()
      })()
    }
  },
  beforeDestroy() {
    window.onresize = () => {
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
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
      font-weight: 700;
    }
  }
  &.two {
    /deep/ .el-breadcrumb__inner {
      color: #9ea0a5;
    }
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
    /deep/ .el-form-item__label {
      padding-right: 20px;
      font-size: 16px;
      text-align: center;
    }
    /deep/ .el-form-item__content {
      height: 64px;
      line-height: 64px;
      width: 225px;
      margin-right: 20px;
      .filter-ipt .el-input__inner {
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
      background: url(../../assets/images/icon_筛选.png) no-repeat center center;
      position: absolute;
      top: 13px;
      left: 30px;
    }
  }
}
.el-input.filter-ipt {
  /deep/ .el-input__inner {
    height: 30px;
    width: 100%;
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
.table {
  border: 1px solid #ebeef5;
  // overflow: auto;
  .elli {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 10em;
    height: 42px;
    line-height: 42px;
    // font-size: 12px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tableTitle {
    height: 42px;
    line-height: 42px;
    display: flex;
    width: 1020px;
    align-items: center;
    justify-content: space-between;
    .permissionName {
      flex: 2.6;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .permissionCode {
      text-align: left;
      width: 160px;
      // flex: 1;
      // padding: 0 10px;
    }
    .menu {
      text-align: left;
      // width: 120px;
      flex: 1.2;
      padding: 0 0px;
      box-sizing: border-box;
    }
    .remark {
      text-align: left;
      // width: 170px;
      flex: 1.4;
    }
    .url {
      text-align: left;
      // width: 140px;
      flex: 1.5;
    }
    .handle {
      text-align: left;
      // width: 209px;
      flex: 1.8;
      box-sizing: border-box;
    }
  }
  .treeBody {
    overflow: auto;
  }
  .el-tree {
    width: 1000px;
    // height: 1000px;
    /deep/ .el-tree-node__content {
      height: 48px;
      line-height: 53px;
      border-top: 1px solid #ebeef5;
      // flex: 1;
      // display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .treeTable {
        flex: 1;
        display: flex;
        height: 48px;
        .permissionName {
          flex: 2;
          height: 48px;
        }
        .elli.permissionCode {
          text-align: left;
          display: inline-block;
          width: 140px;
          height: 48px;
          padding: 0 10px;
        }
        .elli.url {
          text-align: left;
          display: inline-block;
          width: 130px;
          height: 48px;
          padding: 0 10px;
        }
        .elli.remark {
          text-align: left;
          display: inline-block;
          width: 130px;
          height: 48px;
          padding: 0 10px;
        }
        div.menu {
          text-align: left;
          display: inline-block;
          width: 100px;
          height: 48px;
          padding: 0 10px;
        }
        .elli.handle {
          text-align: left;
          flex: 1;
          height: 48px;
          padding: 0 10px;
          display: inline-block;
        }
      }
    }
  }
}
.top-button {
  width: 190px;
  .btn-text {
    width: 108px;
  }
}
</style>
