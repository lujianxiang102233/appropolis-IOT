<template>
    <div class="logs">
        <el-breadcrumb separator = "/" >
            <el-breadcrumb-item class="first">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item class="two">操作日志</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if= "this.logsQuery">
          <el-form
            :inline = "true"
            :model = "formInline"
            ref = "formInline"
            class = "clearfix demo-form-inline">
            <div class = "filter">筛选</div>
            <el-form-item label = "操作人" class="user">
                <el-input
                  :clearable = "true"
                  size = "mini"
                  v-model.trim = "formInline.userName"
                  placeholder = "请输入"
                  class = "user-form">
                </el-input>
            </el-form-item>
            <el-form-item label = "行为分类" class="behavior">
                <el-select
                  size = "mini"
                  v-model = "formInline.type"
                  placeholder = "请选择">
                  <el-option
                    v-for = "item in allOperationTypes"
                    :key = "item.value"
                    :label = "item.label"
                    :value = "item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label = "操作时间" class="time">
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
                    {{ scope.row.operateDate |time}}
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
        <div v-if= "!this.logsQuery" style="text-align:center;margin-top:60px;color:#666">
          您没有当前api访问权限 ~
        </div>
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
      allOperationTypes: [{ label: '全部', value: -1 }],
      //   form
      formInline: {
        userName: '',
        type: '',
        date: ''
      },
      postDate: ['', ''],
      //   table
      tableHeight: '',
      tableData: [],
      // tableData: [
      //   {
      //     loginName: '',
      //     operationType: '',
      //     operateDate: '',
      //     loginIp: '',
      //     remark: ''
      //   }
      // ],
      //   分页
      currentPage: 0,
      total: 0,
      pages: ''
    }
  },
  created() {
    this.getTypeData()
    this.logsQuery = localStorage
      .getItem('points')
      .includes('permission_log_query')
    if (this.logsQuery) {
      this.$nextTick(() => {
        this.flexTableHeight()
      })
      this.fixedTableHeight()
    }
  },
  mounted() {
    this.getTableData()
    this.formInline.type = -1
    if (this.logsQuery) {
      window.onresize = () => {
        return (() => {
          this.flexTableHeight()
        })()
      }
    }
  },
  beforeDestroy() {
    window.onresize = () => {
      return ''
    }
  },
  watch: {},
  methods: {
    flexTableHeight() {
      this.tableHeight =
        document.documentElement.clientHeight -
        (this.$refs.formInline.$el.offsetHeight + 205)
    },
    fixedTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 320
    },
    // form picker
    dateBlur() {
      if (!this.formInline.date) {
        return ''
      } else if (this.formInline.date[0] === undefined) {
        this.formInline.date = ''
      }
      this.postDate[0] = this.formatTime(this.formInline.date[0])
      this.postDate[1] = this.formatTime(this.formInline.date[1])
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
      this.postDate = ''
      this.getTableData()
    },
    // table
    headerColor({ row, rowIndex }) {
      return 'headerBgColor'
    },
    // page
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      if (val === 0) {
        this.pageIndex = 1
      }
      this.pageIndex = val
      this.getTableData()
    },
    // data
    getTypeData() {
      let urlRest = '/logs/allOperationTypes'
      this.axios(urlRest)
        .then(response => {
          if (response.data.content.code === 0) {
            let listAll = Object.entries(response.data.content.data)
            this.allOperationTypes = listAll.map(item => {
              return { label: item[0], value: item[1] }
            })
            this.allOperationTypes.unshift({ label: '全部', value: -1 })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    postFilter() {
      this.companyId = localStorage.getItem('companyId')
      let userName = this.formInline.userName
        ? `${this.formInline.userName}`
        : `{empUsername}`
      let type = this.formInline.type !== '' ? `${this.formInline.type}` : '-1'
      let start, end
      if (this.postDate && this.postDate.length > 0 && this.postDate[0]) {
        start = `${this.postDate[0]}`
        end = `${this.postDate[1]}`
      } else {
        start = `{startDate}`
        end = `{endDate}`
      }
      return `/logs/employee/${
        this.companyId
      }/${userName}/${type}/${start}/${end}/${this.pageIndex}/${this.pageSize}`
    },
    getTableData() {
      let urlRest = this.postFilter()
      this.axios
        .get(urlRest)
        .then(response => {
          let code = response.data.content.code
          if (code === 0) {
            let data = response.data.content.data
            this.total = data.total
            this.pageSize = data.pageSize
            // if (
            //   !data.list.length &&
            //   data.pages !== 0 &&
            //   data.pageNum !== data.pages
            // ) {
            //   this.pageIndex = Math.min(data.pages, data.pageNum)
            //   this.currentPage = Math.min(data.pages, data.pageNum)
            //   this.getTableData()
            // } else if (
            //   data.list.length &&
            //   data.pages !== 0 &&
            //   data.pageNum !== data.pages
            // ) {
            //   this.pageIndex = Math.max(data.pages, data.pageNum)
            //   this.currentPage = Math.max(data.pages, data.pageNum)
            //   this.getTableData()
            // }
            this.tableData = data.list.map(item => {
              return {
                loginName: item.loginName,
                operationType: item.operationType,
                operateDate: item.operateDate,
                loginIp: item.loginIp,
                remark: item.remark
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 时间戳
    formatTime(t) {
      t = new Date(t)
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
  @borderColor: #ebeef5;
  .el-breadcrumb__item {
    height: 58px;
    line-height: 58px;
    .el-breadcrumb__inner {
      font-size: 16px;
    }
    &.first {
      .el-breadcrumb__inner,
      .el-breadcrumb__separator {
        color: #3e3f42;
        font-weight: 700;
      }
    }
    &.two {
      .el-breadcrumb__inner {
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
      .el-form-item__label {
        font-size: 16px;
      }
    }
    .el-form-item.user {
      padding-left: 30px;
      .el-form-item__content {
        line-height: 64px;
        .user-form .el-input__inner {
          height: 36px;
          width: 140px;
        }
      }
    }
    .el-form-item.behavior {
      margin-right: 0px;
      .el-form-item__content {
        line-height: 64px;
        .el-select .el-input .el-input__inner {
          height: 36px;
          width: 140px;
        }
      }
    }
    .el-form-item.time {
      margin-left: 15px;
      .el-form-item__content {
        line-height: 64px;
        .el-range-editor--mini.el-input__inner {
          width: 431px;
          height: 36px;
          .el-range-input {
            text-align: left;
          }
          .el-range-separator {
            line-height: 30px;
          }
        }
      }
    }
    .el-form-item.fr {
      padding-left: 0px;
      width: 245px;
      margin-right: 30px;
      height: 36px;
      margin-bottom: 15px;
      .el-form-item__content {
        width: 245px;
        .el-button {
          height: 36px;
          letter-spacing: 20px;
          text-indent: 15px;
          font-size: 14px;
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
