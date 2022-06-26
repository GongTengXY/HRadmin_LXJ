<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容--头部 -->
      <el-card class="tree-card">
        <!-- 里面放置结构内容 -->
        <TreeTools :treeNode="company" :isRoot="true"></TreeTools>
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次-->
          <!-- 作用域插槽 slot-space="obj" 接收传递给插槽的数据 -->
          <TreeTools slot-scope="{data}" :treeNode="data" @editDepts="editDepts" @delDepts="getDepartments" @addDepts="newDepts"></TreeTools>
        </el-tree>
      </el-card>
      <AddDept :showing.sync="showDialog" :treeNode="node" @refresh="getDepartments" ref="addDept"></AddDept>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import {getDepartment} from '@/api/department'
import {tranListToTreeDate} from '@/utils'
export default {
  data () {
    return {
      departs: [
        { name: '总裁办', 
          manager: '曹操',
          children: [
            { name: '董事会',
              manager: '曹植',
            }
          ]
        },
        { name: '行政部',
          manager: '曹丕',
        }, 
        { name: '人事部',
          manager: '刘备'
        }
      ],
      defaultProps : {
        label : 'name',     //从这个属性显示内容
        children : 'children'     //从这个属性去找子节点
      },
      company : {},
      showDialog : false,
      node : null,    //记录当前点击的node节点
      loading : false,   //加载显示
    }
  },
  components: {
    TreeTools,
    AddDept,
  },
  created () {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const res = await getDepartment()
      console.log(res)
      this.company = {name : res.companyName, manager : '负责人',id : ''} //这里加id是为了后面添加部门时表单验证时的规则函数
      this.departs = tranListToTreeDate(res.depts, '')     //需要将其转化成树形结构
      this.loading = false
    },
    newDepts(node) {   //监听子组件中触发点击添加子部门的事件
      this.showDialog = true
      this.node = node
    },
    editDepts(treeNode) {
      this.showDialog = true
      this.node = treeNode
      //这里调用获取部门信息
      this.$refs.addDept.getDepartDetails(treeNode.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>