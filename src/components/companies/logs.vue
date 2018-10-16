<template>
    <div class="logs">
        
            <el-checkbox v-model="checked">
                <el-breadcrumb separator = "/">
                    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                    <el-breadcrumb-item>操作日志</el-breadcrumb-item>
                </el-breadcrumb>
            </el-checkbox>
            <el-form :inline="true" :model = "formInline" class="role-form" >
                <div>筛选</div>
                <el-form-item label = "操作人">
                    <el-input size="mini" v-model = "formInline.userName" placeholder="请输入" class="user-form"></el-input>
                </el-form-item>
                <el-form-item label = "行为分类">
                    <el-autocomplete
                        size="mini"
                        class="inline-input"
                        v-model="formInline.type"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入"
                        @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label = "操作时间" >
                    <el-date-picker
                        size="mini"
                        v-model="formInline.date"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="请选择"
                        end-placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click = "onSubmit">查询</el-button>
                    <el-button size="mini" @click = "onSubmit">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table class="table"
                :data="tableData"
                :header-row-class-name="headerColor"
                style="100%">
                <el-table-column
                    prop="loginName"
                    label="操作人"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="operationType"
                    label="行为分类"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="operateDate"
                    label="操作时间"
                    align="center"
                    width="240">
                    <template slot-scope="scope">
                      {{ scope.row.operateDate | time}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="loginIp"
                    label="IP地址"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    align="center"
                    label="行为描述"
                    width="300">
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,50,100]"
                :page-size="pageSize"
                layout="total,prev,pager,next,sizes,jumper"
                :total="totalAll">
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
      //   check
      checked: false,
      //   form
      formInline: {
        userName: '',
        type: '',
        date: ''
      },

      //   table
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
      currentPage: 1,
      totalAll: 1
    }
  },
  created() {},
  mounted() {
    this.getTypeData()
    this.getTableData()
    // this.getData()
    //   .then(data => {
    //     console.log(data)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  },
  computed: {
    // operateDateChange: {
    //   get: function() {
    //     new Date(this.tableData.operateDate)
    //     console.log(new Date(aa))
    //     retuurn(new Date(aa))
    //   }
    // }
  },
  methods: {
    // from blur
    querySearch(queryString, cb) {
      var allOperationTypes = this.allOperationTypes
      var results = queryString
        ? allOperationTypes.filter(this.createFilter(queryString))
        : allOperationTypes
      cb(results)
    },
    createFilter(queryString) {
      return allOperationTypes => {
        return (
          allOperationTypes.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
      this.operationTypeId = item.id
    },
    // from button
    onSubmit() {
      this.getTableData(this.userName)
    },
    onResetForm() {
      this.formInline.userName = ''
    },
    // table header
    headerColor({ row, rowIndex }) {
      return 'headerBgColor'
    },
    // tableDataList() {
    //   return this.tableData
    // },
    // page
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
    },
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    total() {
      return this.totalAll
    },
    page() {
      return this.pageSize
    },
    // data
    getData() {
      let urlRest = '/logs/allOperationTypes'
      return new Promise(function(resolve, reject) {
        this.axios(urlRest)
          .then(response => {
            if (response.data.content.code != 0) {
              reject(response)
            } else {
              resolve(response)
            }
          })
          .catch(error => {
            console.log(error)
          })
      })
    },

    getTypeData() {
      let urlRest = '/logs/allOperationTypes'
      this.axios(urlRest)
        .then(response => {
          let listAll = Object.entries(response.data.content.data)
          this.allOperationTypes = listAll.map(item => {
            return { value: item[0], id: item[1] }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTableData(userName) {
      this.companyId = localStorage.getItem('companyId')
      userName = this.formInline.userName
        ? `${this.formInline.userName}`
        : `{empUsername}`
      let type = this.formInline.type ? `${this.operationTypeId}` : '-1'

      // date:
      let urlRest = `/logs/employee/${
        this.companyId
      }/${userName}/${type}/{startDate}/{endDate}/${this.pageIndex}/${
        this.pageSize
      }`
      this.axios
        .get(urlRest)
        .then(response => {
          let data = response.data.content.data
          this.totalAll = data.total
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
    }
  }
}
</script>
<style lang="less">
.logs {
  padding-left: 34px;
  @borderColor: #999;

  .role-form {
    border: 1px solid @borderColor;
    padding: 10px;
    margin-top: 10px;
    height: 60px;
    .user-form {
      width: 120px;
    }
  }
  .table {
    margin-top: 20px;
    border: 1px solid @borderColor;
    border-radius: 4px;
    .el-table {
      .headerBgColor {
        //q
        background: red;
      }
    }
  }
  .el-pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
