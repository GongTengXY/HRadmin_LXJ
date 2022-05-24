<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容--头部 -->
      <el-card class="tree-card">
        <!-- 里面放置结构内容 -->
        <TreeTools :treeNode="company" :isRoot="true"></TreeTools>
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次-->
          <!-- 作用域插槽 slot-space="obj" 接收传递给插槽的数据 -->
          <TreeTools slot-scope="{data}" :treeNode="data"></TreeTools>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
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
      company : {name: '江苏传智播客教育科技股份有限公司', manager: '负责人'}
    }
  },
  components: {
    TreeTools,
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>