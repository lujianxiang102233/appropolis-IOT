<template>
    <div class="show">
        <div class="icon-tit icon-home fl">
            <img src="../../assets/images/showImg/home.png">
        </div>
        <el-popover
            visible-arrow = "true"
            placement="bottom-start"
            width="400"
            trigger="click">
            <el-table :data= "gridData">
                <el-table-column width="150" property="date" label="日期"></el-table-column>
                <el-table-column width="100" property="name" label="姓名"></el-table-column>
                <el-table-column width="300" property="address" label="地址"></el-table-column>
            </el-table>
            <div slot="reference" class="icon-tit icon-more fl">
                <img src="../../assets/images/showImg/down.png">
            </div>
        </el-popover>
    </div>
</template>
<script>
export default {
  data() {
    return {
      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  }
}
</script>
<style lang="less">
.show {
  @brColor: #d7d7d7;
  overflow: hidden;
  .icon-tit {
    width: 70px;
    height: 50px;
    padding: 0;
    border: 1px solid @brColor;
    cursor: pointer;
    img {
      width: 30px;
      height: 30px;
      margin-left: 20px;
      margin-top: 10px;
    }
  }
  .icon-home {
    border-right: 1px solid transparent;
    border-radius: 10px 0 0 10px;
  }
  .icon-more {
    border-radius: 0 10px 10px 0;
  }
}
</style>
