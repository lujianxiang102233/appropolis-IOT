<template>
  <div class="companyaccess" style="padding-left: 34px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/companies' }">公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司权限</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="editCom"><p>编辑【蒙羊牧业有限公司】权限</p></div>
    <el-form :inline="true" class="clearfix demo-form-inline" ref="ruleForm" v-if="coList.indexOf('permission_co_func_query')>-1" :model="queryTable">
      <div class="filter">筛选</div>
      <el-form-item label="功能点名称">
        <el-input size="mini" v-model="filterText" placeholder="请输入" class="filter-ipt"></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
     <el-button type="primary" style="margin-top: 10px;" size="mini" @click="addDalogVisible = true" v-if="coList.indexOf('permission_co_func_add')>-1">+ 新建一级功能点</el-button>
     <el-button type="primary" style="margin:0px 40px;" size="mini" @click="copyDalogVisible = true" v-if="coList.indexOf('permission_co_func_copy')>-1">复制其他公司权限</el-button>
    <div class="table" :style="{height: tableHeight + 'px' }">
      <div class="tableTitle">
        <span class="permissionName">功能点名称</span>
        <span class="permissionCode">FUNCID</span>
        <span class="menu">菜单栏（权重）</span>
        <span class="url">url</span>
        <span class="remark">功能描述</span>
        <span class="handle">操作</span>
      </div>
      <el-tree
        :data = "funcTable"
        show-checkbox
        node-key = "id"
        default-expand-all
        ref="tree2"
        :filter-node-method="filterNode"
        :expand-on-click-node = "false">
        <span slot-scope= "{node,data}" class="treeTable">
          <span class="permissionName" >{{data.permissionName}}</span>
          <span class="elli permissionCode" :title="data.permissionCode">{{data.permissionCode}}</span>
          <div  class="menu">{{data.menu?'是':'否'}}&nbsp;&nbsp;&nbsp;<span v-show="data.weight>-1">(</span>{{data.weight}}<span v-show="data.weight >-1">)</span></div>
          <span class="elli url" :title="data.url">{{data.url}}</span>
          <span class="elli remark" :title="data.remark">{{data.remark}}</span>
          <span class="handle">
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_addsub')>-1"  plain @click="addsub(data)" >添加</el-button>
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_edit')>-1"  plain @click="edit(data)">编辑</el-button>
            <el-button type="primary" size="mini" v-if="coList.indexOf('permission_co_func_del')>-1"  plain @click="del(data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
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
        <el-button @click="addCancel('addForm')">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建功能点"
      :visible.sync="addsubDalogVisible"
      width="40%">
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
        <el-button @click="addsubCancel('addsubForm')">取 消</el-button>
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
          <el-input :disabled="true" v-model="editForm.permissionCode" placeholder="请输入"></el-input>
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
        <el-button @click="editDalogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editTrue('editForm')">确 定</el-button>
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
        <el-button @click="copyCancel">取 消</el-button>
        <el-button type="primary" @click="copy('copyForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    const data = [
      {
        id: 1,
        label: '一级 1',
        children: [
          {
            id: 4,
            label: '二级 1-1',
            children: [
              {
                id: 9,
                label: '三级 1-1-1'
              },
              {
                id: 10,
                label: '三级 1-1-2'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '一级 2',
        children: [
          {
            id: 5,
            label: '二级 2-1'
          },
          {
            id: 6,
            label: '二级 2-2'
          }
        ]
      },
      {
        id: 3,
        label: '一级 3',
        children: [
          {
            id: 7,
            label: '二级 3-1'
          },
          {
            id: 8,
            label: '二级 3-2'
          }
        ]
      }
    ]
    return {
      data5: JSON.parse(JSON.stringify(data)),
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
      companyId: '',
      companyName: '',
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
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          {
            pattern: /^[1-9]\d{0,9}$/,
            message: '10位以内正整数',
            trigger: 'blur'
          }
        ],
        url: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
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
      tableHeight: '',
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
      bbb: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ccc: [5]
    }
  },
  methods: {
    onSubmit() {
      this.pageIndex = 1
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
      let res = await this.axios.get(`/company/permission/${this.companyId}`)
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
      let res = await this.axios.put(
        `/company/checkCompanyPermissionChildrenAndRoles/${
          this.$route.query.id
        }/${permissionCode}`,
        {
          permissionTree: this.treeList.permissionTree,
          version: this.treeList.version
        }
      )
      let {
        code,
        data: { numOfRoles, firstRolesName }
      } = res.data.content
      if (code === 0) {
        if (numOfRoles === 1) {
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
      let res1 = await this.axios.put(
        `/company/checkCompanyPermissionChildrenAndRoles/${
          this.$route.query.id
        }/${permissionCode}`,
        {
          permissionTree: this.treeList.permissionTree,
          version: this.treeList.version
        }
      )
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
              let res2 = await this.axios.put(
                `/company/permission/${
                  this.$route.query.id
                }/${permissionCode}/${permissionName}`,
                {
                  permissionTree: this.treeList.permissionTree,
                  version: this.treeList.version
                }
              )
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
        let index = ''
        this.copyList.forEach((value, i) => {
          if (Number(value.companyId) === Number(this.$route.query.id)) {
            index += i
          }
        })
        this.copyList.splice(index, 1)
        console.log(this.copyList)
      }
      if (code === -9999) {
        this.$message.error(`Exception Message`)
      }
    },
    copyCancel() {
      this.copyDalogVisible = false
      this.copyForm.state = ''
    },
    querySearch(queryString, cb) {
      var restaurants = this.copyList
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
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
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.funcTable !== undefined) {
            this.$confirm('是否放弃已有权限配置?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(async () => {
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
            this.getList()
            this.$message.success(`已复制【${this.companyName}】配置权限`)
            this.copyDalogVisible = false
          }
        } else {
          return false
        }
      })
    },
    handleSelect(item) {
      this.companyId = item.companyId
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
          let res = await this.axios.put(
            `/company/permission/${this.$route.query.id}/${
              this.editForm.permissionCode
            }`,
            {
              permissionTree: this.treeList.permissionTree,
              version: this.treeList.version
            }
          )
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
    }
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  },
  created() {
    this.ccc = [5]
    this.companyId = this.$route.query.id
    this.getList()
    this.tableHeight = `${document.documentElement.clientHeight}` - 320
  },
  mounted() {
    this.render()
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.documentElement.clientHeight - 320
      })()
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
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
  min-height: 60px;
  .el-form-item {
    margin-bottom: 0;
  }
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

  .el-autocomplete {
    position: relative;
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
.table {
  margin-top: 20px;
  border: 1px solid #999;
  // width: 1009px;
  overflow: auto;
  .elli {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    width: 10em;
    height: 53px;
    line-height: 53px;
    // font-size: 12px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tableTitle {
    height: 53px;
    line-height: 53px;
    display: flex;
    width: 1200px;
    .permissionName {
      flex: 1.5;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .permissionCode {
      text-align: center;
      // width: 300px;
      flex: 1;
      padding: 0 10px;
    }
    .menu {
      text-align: center;
      // width: 120px;
      flex: 1;
      padding: 0 10px;
    }
    .remark {
      text-align: center;
      // width: 170px;
      padding: 0 10px;
      flex: 1;
    }
    .url {
      text-align: center;
      // width: 140px;
      padding: 0 10px;
      flex: 1;
    }
    .handle {
      text-align: center;
      // width: 300px;
      flex: 1;
      padding: 0 10px;
    }
  }
  .el-tree {
    width: 1200px;
    /deep/ .el-tree-node__content {
      height: 53px;
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
        font-size: 14px;
        .permissionName {
          flex: 3;
        }
        .elli.permissionCode {
          text-align: center;
          display: inline-block;
          // width: 160px;
          flex: 1;
          padding: 0 50px;
        }
        .elli.url {
          text-align: center;
          display: inline-block;
          width: 170px;
          // flex: 1;
          padding: 0 10px;
        }
        .elli.remark {
          text-align: center;
          display: inline-block;
          width: 170px;
          padding: 0 10px;
        }
        div.menu {
          text-align: center;
          display: inline-block;
          width: 140px;
          // flex: 1;
          padding: 0 10px;
        }
        .elli.handle {
          text-align: center;
          flex: 1;
          // width: 300px;
          padding: 0 10px;
          display: inline-block;
        }
      }
    }
  }
  .overflowClass {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
