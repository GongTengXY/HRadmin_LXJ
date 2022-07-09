<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <el-button slot="btn" type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
      </PageTools>
      <!-- 表格 -->
      <el-table border :data="List" row-key="id">
        <el-table-column align="center" label="名称" prop="name"/>
        <el-table-column align="center" label="标识" prop="code"/>
        <el-table-column align="center" label="描述" prop="description"/>
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <!-- type为1时才有访问权，添加按钮只在访问权的层级显示 -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增权限 -->
    <el-dialog :title="showText" :visible="showDialog" @close="btnCancel">
      <el-form ref="permission" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input style="width : 90%" v-model="formData.name"/>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input style="width : 90%" v-model="formData.code"/>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input style="width : 90%" v-model="formData.description"/>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch 
          active-color="#13ce66"
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="6" class="newCol">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getAllPermission, deletePermission, addPermission, getPermissionInfo, updatePermission} from '@/api/permission'
import {tranListToTreeDate} from '@/utils'
export default {
  data () {
    return {
      List : [],
      showDialog : false,
      formData : {   //角色权限信息
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.List = tranListToTreeDate(await getAllPermission(), '0')
    },
    async delPermission(id) {
      try {
        await this.$confirm('确定删除该权限点吗？','提示')
        await deletePermission(id)
        this.getPermissionList()
        this.$message.success('删除成功！')
      } catch (error) {
        this.$message.error('请稍后重试')
      }
    },
    addPermission(type, pid) {
      //访问权添加是type=1 ，按钮操作权是type=2
      //pid是表示当前数据父节点的标识
      //添加当前的父标识和类型(看是访问权还是按钮操作权)
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async btnOK() {
      await this.$refs.permission.validate()
      if (this.formData.id) {
        await updatePermission(this.formData)
      } else {
        await addPermission(this.formData)
      }
      this.getPermissionList()
      this.$message.success(this.pointText)
      this.showDialog = false
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permission.resetFields()
      this.showDialog = false
    },
    async editPermission(id) {
      this.formData = await getPermissionInfo(id)
      this.showDialog = true
    }
  },
  computed : {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    },
    pointText() {
      return this.formData.id ? '编辑成功' : '添加成功'
    }
  }
}
</script>

<style lang="scss" scoped>
.newCol {
  display: flex;
  justify-content: center;
}
</style>