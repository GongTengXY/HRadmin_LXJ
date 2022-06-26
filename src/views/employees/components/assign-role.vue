<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancal">
       <el-checkbox-group v-model="roleIds">
           <!-- 选项 -->
           <el-checkbox :label="item.id" v-for="item in List" :key="item.id">{{item.name}}</el-checkbox>
       </el-checkbox-group>
       <el-row slot="footer" type="flex" justify="center">
           <el-col :span="6">
               <el-button type="primary" size="small" @click="btnOK">确定</el-button>
               <el-button type="info" size="small" @click="btnCancal">取消</el-button>
           </el-col>
       </el-row>
  </el-dialog>
</template>

<script>
import {getRoleList} from '@/api/setting'
import {getUserPhoto} from '@/api/user'
import {assginRole} from '@/api/employees'
export default {
    props : {
        showRoleDialog : {
            type : Boolean,
            default : false
        },
        userId : {
            type : String,
            default : null
        }
    },
    data () {
        return {
            List : [],   //负责存储所有的角色
            roleIds : [],  //存储当前用户所拥有的角色id
        }
    },
    created () {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {    //获取所有角色
            const {rows} = await getRoleList({page : 1, pagesize : 20})
            this.List = rows
        },
        //因为props传值是异步的，所以不能使用this.userId
        async getEmployeeRoleInfo(id) {
            const {roleIds} = await getUserPhoto(id)
            this.roleIds = roleIds
        },
        btnCancal() {
            this.$emit('update:showRoleDialog', false)
        },
        async btnOK() {
            await assginRole({id : this.userId, roleIds : this.roleIds})
            this.$emit('update:showRoleDialog', false)
        }
    }
}
</script>

<style>

</style>