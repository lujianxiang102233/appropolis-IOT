<template>
    <div class="logs">
        <el-breadcrumb separator = "/" >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>操作日志</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          :inline = "true"
          :model = "formInline"
          ref = "formInline"
          class = "clearfix role-form">
          <div class = "name">筛选</div>
          <el-form-item label = "操作人">
              <el-input
                :clearable = "true"
                size = "mini"
                v-model = "formInline.userName"
                placeholder = "请输入"
                class = "user-form">
              </el-input>
          </el-form-item>
          <el-form-item label = "行为分类">
              <el-select
                :clearable = "true"
                size = "mini"
                v-model = "formInline.type"
                placeholder = "请选择">
                <el-option
                  v-for = "item in allOperationTypes"
                  :key = "item.id"
                  :label = "item.value"
                  :value = "item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label = "操作时间">
              <el-date-picker
                  size = "mini"
                  @blur = "dateBlur"
                  v-model = "formInline.date"
                  type = "datetimerange"
                  range-separator = "至"
                  start-placeholder = "请选择"
                  end-placeholder = "请选择">
              </el-date-picker>
          </el-form-item>
          <el-form-item class="fr">
              <el-button type = "primary" size="mini" @click = "onSubmit">查询</el-button>
              <el-button size = "mini" @click = "onResetForm('formInline')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
            :height = 'tableHeight'
            class = "table"
            :data = "tableData"
            :header-row-class-name = "headerColor"
            style = "100%">
            <el-table-column
                prop = "loginName"
                label = "操作人"
                align = "center"
                width = "180">
            </el-table-column>
            <el-table-column
                prop = "operationType"
                label = "行为分类"
                align = "center"
                width = "180">
            </el-table-column>
            <el-table-column
                prop = "operateDate"
                label = "操作时间"
                align = "center"
                width = "240">
                <template slot-scope="scope">
                  {{ scope.row.operateDate | time}}
                </template>
            </el-table-column>
            <el-table-column
                prop = "loginIp"
                label = "IP地址"
                align = "center"
                width = "180">
            </el-table-column>
            <el-table-column
                prop = "remark"
                align = "center"
                label = "行为描述"
                min-width = "130">
                <template slot-scope ="scope">
                  <div class ="overflowClass" :title = "scope.row.remark">{{scope.row.remark}}</div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change = "handleSizeChange"
            @current-change = "handleCurrentChange"
            :current-page = "currentPage"
            :page-sizes = "[10,20,50,100]"
            :page-size = "pageSize"
            layout ="total,prev,pager,next,sizes,jumper"
            :total = "total">
        </el-pagination>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //   data
      companyId: '',
      operationTypeId: '',
      pageIndex: 1,
      pageSize: 10,
      allOperationTypes: [],
      //   form
      formInline: {
        userName: '',
        type: '',
        date: []
      },
      //   table
      tableHeight: '',
      tableData: [
        {
          loginName: '',
          operationType: '',
          operateDate: '',
          loginIp: '',
          remark: ''
        }
      ],
      //   分页
      currentPage: 0,
      total: 0
    }
  },
  created() {
    this.$nextTick(() => {
      this.flexTableHeight()
    })
    this.fixedTableHeight()
  },
  mounted() {
    this.getTypeData()
    this.getTableData()
    window.onresize = () => {
      return (() => {
        this.flexTableHeight()
      })()
    }
  },
  watch: {
    // tableHeight(val) {
    //   this.tableHeight = val
    // }
  },
  computed: {},
  methods: {
    flexTableHeight() {
      this.tableHeight =
        document.documentElement.clientHeight -
        (this.$refs.formInline.$el.offsetHeight + 196)
    },
    fixedTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 320
    },
    // form picker
    dateBlur() {
      if (!this.formInline.date) {
        return ''
      }
      let startTime = new Date(this.formInline.date[0])
      let endTime = new Date(this.formInline.date[1])
      this.formInline.date[0] = this.formatTime(startTime)
      this.formInline.date[1] = this.formatTime(endTime)
    },
    // from button
    onSubmit() {
      this.currentPage = 1
      this.pageIndex = 1
      this.getTableData()
    },
    onResetForm(formInline) {
      this.formInline.userName = ''
      this.formInline.type = ''
      this.formInline.date = ''
      this.getTableData()
    },
    // table
    headerColor({ row, rowIndex }) {
      return 'headerBgColor'
    },
    // page
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTableData()
    },
    page() {
      return this.pageSize
    },
    // data
    getTypeData() {
      let urlRest = '/logs/allOperationTypes'
      this.axios(urlRest)
        .then(response => {
          if (response.data.content.code === 0) {
            let listAll = Object.entries(response.data.content.data)
            this.allOperationTypes = listAll.map(item => {
              return { value: item[0], id: item[1] }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTableData() {
      this.companyId = localStorage.getItem('companyId')
      let userName = this.formInline.userName
        ? `${this.formInline.userName}`
        : `{empUsername}`
      let type = this.formInline.type !== '' ? `${this.formInline.type}` : '-1'
      let start, end
      if (
        this.formInline.date &&
        this.formInline.date.length > 0 &&
        this.formInline.date[0]
      ) {
        start = `${this.formInline.date[0]}`
        end = `${this.formInline.date[1]}`
      } else {
        start = `{startDate}`
        end = `{endDate}`
      }
      let urlRest = `/logs/employee/${
        this.companyId
      }/${userName}/${type}/${start}/${end}/${this.pageIndex}/${this.pageSize}`
      this.axios
        .get(urlRest)
        .then(response => {
          let data = response.data.content.data
          this.total = data.total
          this.pageSize = data.pageSize
          this.tableData = data.list.map(item => {
            return {
              loginName: item.loginName,
              operationType: item.operationType,
              operateDate: item.operateDate,
              loginIp: item.loginIp,
              remark: item.remark
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 时间戳
    formatTime(t) {
      let d =
        t.getFullYear() +
        '-' +
        (t.getMonth() + 1) +
        '-' +
        (t.getDate() < 10 ? '0' + t.getDate() : t.getDate()) +
        ' ' +
        (t.getHours() < 10 ? '0' + t.getHours() : t.getHours()) +
        ':' +
        (t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes()) +
        ':' +
        (t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds())
      return d
    }
  }
}
</script>
<style lang="less">
.logs {
  padding-left: 34px;
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
    .el-table {
      .headerBgColor {
        //q
        background: red;
      }
    }
    .overflowClass {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
