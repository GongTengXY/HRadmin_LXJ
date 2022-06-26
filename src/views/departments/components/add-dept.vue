<template>
  <el-dialog :title="showTitle" :visible="showing" @close="btnCancal">
      <el-form ref="deptref" label-width="120px" :model="formData" :rules="rules">
          <el-form-item label="部门名称" prop="name">
              <el-input style="width:80%" placeholder="请输入部门名称" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
              <el-input style="width:80%" placeholder="请输入部门编码" v-model="formData.code"></el-input>
          </el-form-item>
          <el-form-item label="部门负责人" prop="manager">
              <el-select placeholder="请选择" v-model="formData.manager" @focus="newgetEmployees">
                  <el-option v-for="obj in arr" :key="obj.id" :value="obj.username"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="部门介绍" prop="introduce">
              <el-input style="width:80%" placeholder="请对部门进行介绍描述1-300字" type="textarea" :rows="3" v-model="formData.introduce"></el-input>
          </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6" class="newcol">
            <el-button @click="btnCancal">取消</el-button>
            <el-button type="primary" @click="btnOK">确认</el-button>
        </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
import {getDepartment,addDepartments,getDepartDetail,editDepartDetail} from '@/api/department'
import {getEasyList} from '@/api/employees'
export default {
    props: {
        showing : {
            type : Boolean,
            default : false
        },
        treeNode : {
            type : Object,
            default : null,
        }
    },
    data () {
        //自定义校验函数
        //检测同级部门名称有无重复的
        const checkNameRepeat = async(rule, value, callback) => {
            // value 就是部门名称
            const {depts} = await getDepartment()
            //去找同级部门下 有没有和value相同的数据
            let isRepeat = false
            if (this.formData.id) {        //有id就是编辑模式,无id就是添加子部门模式
                isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.anme === value)
            } else {
                //找到同级部门的所有子部门
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
            }
            //如果isRepeat为true，就说明找到了相同的名字
            isRepeat ? callback(new Error(`同级部门下已经存在${value}部门`)) : callback()
        }
        //检查所有部门编码有无重复的
        const checkCodeRepeat = async(rule, value, callback) => {
            const {depts} = await getDepartment()
            let isRepeat = false
            if (this.formData.id) {
                isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
            } else {
                isRepeat = depts.some(item => item.code === value && value)
            }
            isRepeat ? callback(new Error(`部门编码${value}已存在`)) : callback()
        }
        return {
            //定义表单数据
            formData : {
                name :'',         //部门名称
                code : '',         //部门编码
                manager : '',      //部门负责人
                introduce : '',    //部门介绍
            },
            //校验规则
            rules : {
                name : [{required : true, message : '部门名称不能为空', trigger : 'blur'},
                {min : 1, max : 50, message : '部门名称要求字数在1-50字之内', trigger : 'blur'},
                {trigger : 'blur', validator : checkNameRepeat}
                ],
                code : [{required : true, message : '部门编码不能为空', trigger : 'blur'},
                {min : 1, max : 50, message : '部门编码要求字数在1-50字之内', trigger : 'blur'},
                {trigger : 'blur', validator : checkCodeRepeat}
                ],      
                manager : [{required : true, message : '部门负责人不能为空', trigger : 'blur'}],   
                introduce : [{required : true, message : '部门介绍不能为空', trigger : 'blur'},
                {min : 1, max : 300, message : '部门介绍要求字数在1-300字之内', trigger : 'blur'}
                ], 
            },
            arr : [],   //员工列表
        }
    },
    methods: {
        async newgetEmployees() {
            const res = await getEasyList()
            this.arr = res
        },
        btnOK() {
            this.$refs.deptref.validate(async (isOk) => {
                if(isOk) {
                    //表单手动验证都OK，添加部门/编辑部门
                    if (this.formData.id) {
                        //有id的话就是编辑部门
                        await editDepartDetail(this.formData)
                        this.$message({
                            type : 'success',
                            message : '编辑部门成功',
                            showClose : true,
                            center : true
                        })
                    } else {
                        await addDepartments({
                            //添加部门
                            ...this.formData, pid : this.treeNode.id
                        })
                        this.$message({
                            type : 'success',
                            message : '新增部门成功',
                            showClose : true,
                            center : true
                        })
                    }
                    //通知父组件更新数据
                    this.$emit('refresh')
                    //关闭弹层
                    //使用.sync修饰符关闭弹层，这是vuejs中的
                    this.$emit('update:showing',false)
                    //关闭dialog的时候会触发el-dialog的close事件，所以这里不需要再单独的重置数据了         
                }
            })
        },
        btnCancal() { 
            //重置数据，如果不重置，编辑部门时所获取的id不会清除
            this.formData = {
                name :'',         //部门名称
                code : '',         //部门编码
                manager : '',      //部门负责人
                introduce : '',    //部门介绍
            }
            //表单的重置
            this.$refs.deptref.resetFields()   //resetFields 只能重置 表单上的数据，非表单上的就不行只能手动
            //关闭弹层
            //使用.sync修饰符关闭弹层，这是vuejs中的
            this.$emit('update:showing',false)          
        },
        //获取详情方法
        async getDepartDetails(id) {
            //因为我们是父组件调用子组件的方法，先设置了数据，直接调用方法
            //props传值是异步的
            this.formData = await getDepartDetail(id)
            // console.log(this.formData)
        }
    },
    computed: {
        showTitle () {
            return this.formData.id ? '编辑部门' : '新增子部门'
        }
    }
}
</script>

<style scoped>
.newcol {
    display: flex;
    justify-content: center;
}
</style>