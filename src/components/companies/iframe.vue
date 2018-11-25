<template>
    <div class="iframe1">
        <!-- 这是test2组件 -->
        <iframe id="iframe1" class="iframe" :src="src" :width="width" :height="height" onload="iframe1.focus()"></iframe>
        <!-- <ul>
          <li v-for="item in sortStudents" :key="item.id">{{item.permissionName}}{{item.weight}}
            <ul>
              <li style="padding:0px 20px;color:red;" v-for="v in item.children" :key="v.id">
                {{v.permissionName}}{{v.weight}}
              </li>
            </ul>
          </li>
        </ul> -->
    </div>
</template>

<script>
export default {
  data() {
    return {
      width: 1000,
      height: 500,
      src: '',
      students: [
        {
          menu: true,
          newTab: true,
          permissionCode: 'permission',
          permissionName: '权限管理',
          remark: '权限管理',
          url: '/permission',
          weight: 8,
          id: 1,
          children: [
            {
              menu: true,
              newTab: true,
              permissionCode: 'permission_co',
              permissionName: '公司管理',
              remark: '公司管理',
              url: '/companies',
              weight: 44,
              id: 3,
              children: []
            },
            {
              menu: true,
              newTab: true,
              permissionCode: 'permission_role',
              permissionName: '角色管理',
              remark: '角色管理',
              url: '/role',
              weight: 33,
              id: 4,
              children: []
            },
            {
              menu: true,
              newTab: true,
              permissionCode: 'permission_user',
              permissionName: '用户管理',
              remark: '用户管理',
              url: '/user',
              weight: 22,
              id: 5,
              children: []
            }
          ]
        },
        {
          menu: true,
          newTab: true,
          permissionCode: 'permission_log',
          permissionName: '产品管理',
          remark: '产品管理',
          url: 'https://www.baidu.com',
          weight: 9,
          id: 2,
          children: [
            {
              menu: true,
              newTab: true,
              permissionCode: 'permission_log_query',
              permissionName: '产品分类',
              remark: '操作日志',
              url: '/log',
              weight: 66,
              id: 6,
              children: []
            },
            {
              menu: true,
              newTab: true,
              permissionCode: 'permission_log_query',
              permissionName: '产品列表',
              remark: '操作日志',
              url: '/log',
              weight: 55,
              id: 7,
              children: []
            }
          ]
        },
        {
          menu: true,
          newTab: true,
          permissionCode: 'permission_log',
          permissionName: '产品分类',
          remark: '产品管理',
          url: 'https://www.baidu.com',
          weight: 6,
          id: 12,
          children: []
        }
        // { name: 'Jason Niu', age: '75', id: 2 }
      ]
    }
  },
  created() {
    this.height = document.documentElement.clientHeight - 105
    this.width = document.documentElement.clientWidth - 320
    if (this.$route.query.newTab === 'true') {
      this.src = ''
    } else {
      this.src = this.$route.query.url
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.height = document.documentElement.clientHeight - 105
        this.width = document.documentElement.clientWidth - 320
      })()
    }
  },
  computed: {
    sortStudents: function() {
      return sortByKey(this.students, 'weight')
    }
  }
}
// 排序递归
function sortByKey(data, key) {
  if (data.length > 0) {
    for (var i in data) {
      sortByKey(data[i].children, key)
    }
    return data.sort(function(a, b) {
      var x = a[key]
      var y = b[key]
      return x < y ? -1 : x > y ? 1 : 0
    })
  }
}
</script>

<style scope lang="less">
.iframe {
  margin-top: 10px;
}
</style>
