<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <el-button slot="btn" type="primary" size="small" @click="addShowing = true">添加权限</el-button>
      </PageTools>
      <!-- 表格 -->
      <el-table border :data="List" row-key="id">
        <el-table-column align="center" label="名称" prop="name"/>
        <el-table-column align="center" label="标识" prop="code"/>
        <el-table-column align="center" label="描述" prop="description"/>
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <!-- type为1时才有访问权，添加按钮只在访问权的层级显示 -->
            <el-button v-if="row.type === 1" type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增权限 -->
    <el-dialog title="新增权限" :visible.sync="addShowing">
      <el-form label-width="120px">
        <el-form-item label="权限名称">
          <el-input style="width : 90%"/>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input style="width : 90%"/>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input style="width : 90%"/>
        </el-form-item>
        <el-form-item>
          <el-switch 
          active-color="#13ce66"
          ></el-switch>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getAllPermission} from '@/api/permission'
import {tranListToTreeDate} from '@/utils'
export default {
  data () {
    return {
      List : [],
      addShowing : false,
      formData : {

      }
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.List = tranListToTreeDate(await getAllPermission(), '0')
    }
  }
}
</script>

<style>

</style>