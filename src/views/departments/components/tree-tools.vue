<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100%">
        <el-col>
            <!-- 左侧内容 -->
            <span>{{treeNode.name}}</span>
        </el-col>
        <el-col :span="4">
            <!-- 右侧内容 -->
            <el-row type="flex" justify="end">
            <el-col>
                {{treeNode.manager}}
            </el-col>
            <el-col>
                <!-- 下拉菜单 -->
                <el-dropdown @command="operateDepts">
                <!-- 内容 -->
                    <!-- 显示内容 -->
                    <span>操作
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <!-- 下拉内容 -->
                    <!-- 具名插槽 -->
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                        <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
                        <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import {delDepartments} from '@/api/department'
export default {
    props: {
        //定义传入的属性
        treeNode : {
            required : true,
            type : Object,
        },
        isRoot : {
            type : Boolean,
            default : false
        }
    },
    methods: {
        //点击 添加 编辑 删除都会触发的
        operateDepts(command) {     
            if(command === 'add') {
                //添加
                this.$emit('addDepts',this.treeNode)
            } else if(command === 'edit') {
                //编辑
                this.$emit('editDepts',this.treeNode)
            } else {
                //删除
                this.$confirm('您确定要删除该组织部门吗？',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    return delDepartments(this.treeNode.id)
                }).then(() => {
                    //调用接口处理了后端数据变化，所以还需要让前端重新拉去一下数据
                    this.$emit('delDepts')
                    this.$message({
                        type : 'success',
                        message : '删除成功',
                        center : true
                    })
                })
            }
        }
    }
}
</script>

<style>

</style>