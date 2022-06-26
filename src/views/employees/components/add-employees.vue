<template>
  <el-dialog title="新增员工" :visible="addShowing" width="40%" @close="btnCancal">
      <el-form label-width="120px" class="newForm" :model="formData" :rules="rules" ref="addEmployee">
          <el-form-item label="姓名" prop="username">
              <el-input placeholder="请输入姓名" style="width : 60%" v-model="formData.username"/>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
              <el-input placeholder="请输入手机号" style="width : 60%" v-model="formData.mobile"/>
          </el-form-item>
          <el-form-item label="入职时间" prop="timeOfEntry">
              <el-date-picker type="date" placeholder="请选择日期" style="width : 60%" v-model="formData.timeOfEntry"></el-date-picker>
          </el-form-item>
          <el-form-item label="聘用形式" prop="formOfEmployment">
              <el-select placeholder="请选择" style="width : 60%" v-model="formData.formOfEmployment">
                  <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
              <el-input placeholder="请输入工号" style="width : 60%" v-model="formData.workNumber"/>
          </el-form-item>
          <el-form-item label="部门" prop="departmentName">
              <el-input @focus="getDepartments" placeholder="请选择部门" style="width : 60%" v-model="formData.departmentName"/>
              <el-tree 
              :data="treeData" 
              v-if="treeShowing" 
              default-expand-all="" 
              :props="defaultProps" 
              v-loading="loading"
              @node-click="handleNodeClick"></el-tree>
          </el-form-item>
          <el-form-item label="转正时间" prop="correctionTime">
              <el-date-picker type="date" placeholder="请选择日期" style="width : 60%" v-model="formData.correctionTime"></el-date-picker>
          </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" align="center">
          <el-col :span="6" class="newCol">
              <el-button type="primary" size="small" @click="btnCancal">取消</el-button>
              <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import {getDepartment} from '@/api/department'
import {tranListToTreeDate} from '@/utils'
import {addNewEmployee} from '@/api/employees'
export default {
    props: {
        addShowing : {
            type : Boolean,
            defaults : false
        }
    },
    data () {
        return {
            EmployeeEnum,
            formData : {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            },
            rules : {
                username : [{required:true, message:'姓名不能为空', trigger : 'blur'},
                {min : 1, max : 5, message : '姓名长度为1-5位'}],
                mobile : [{required:true, message:'手机号码不能为空', trigger : 'blur'},
                {pattern : /^1[3~9]\d{9}$/, message : '手机号码格式不正确', trigger:'blur'}],
                timeOfEntry : [{required:true, message:'入职时间不能为空', trigger : 'blur'}],
                formOfEmployment :[{required:true, message:'聘用形式不能为空', trigger : 'blur'}],
                workNumber : [{required:true, message:'工号不能为空', trigger : 'blur'}],
                departmentName : [{required:true, message:'部门不能为空', trigger : 'change'}],
                correctionTime : [{required:true, message:'转正时间不能为空', trigger : 'blur'}],
            },
            treeData : [],          //定义一个数组接收树形数据
            treeShowing : false ,   //定义树形数据展示状态
            defaultProps : {
                label : 'name',
                children: 'children',
            },
            loading : false,        //加载状态
        }
    },
    methods: {
        async getDepartments() {
            this.treeShowing = true
            this.loading = true
            const {depts} = await getDepartment()
            //depts是一个数组，需要转化成树形结构，才能通过er-tree渲染
            this.treeData = tranListToTreeDate(depts, '')
            // console.log(this.treeData)
            this.loading = false
        },
        handleNodeClick(node) {
            this.formData.departmentName = node.name
            this.treeShowing = false
        },
        async btnOK() {
            try {
                await this.$refs.addEmployee.validate()
                await addNewEmployee(this.formData)
                this.$message({
                    type : 'success',
                    message : '成功添加新员工'
                })
                this.$parent.getListInfo()
                this.$parent.showingAdd = false
            } catch (error) {
                console.log(error)
            }
        },
        btnCancal() {
            this.formData = {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            }
            this.$refs.addEmployee.resetField()    //重置表单的校验结果
            this.$parent.showingAdd = false
        }
    }
}
</script>

<style lang="scss" scoped>
.newForm {
    padding-left: 40px;
}
.newCol {
    display: flex;
    justify-content: center;
}
</style>