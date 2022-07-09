<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
          <el-tabs @tab-click="componentShow = true">
              <el-tab-pane label="登录账户设置">
                  <el-form :model="userInfo" :rules="rules" ref="userForm" label-width="120px" style="margin-left: 100px; margin-top: 30px">
                      <el-form-item label="姓名:" prop="username">
                          <el-input v-model="userInfo.username" style="width: 300px"></el-input>
                      </el-form-item>
                      <el-form-item label="密码:" prop="password2">
                          <el-input v-model="userInfo.password2" type="password" style="width: 300px"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="saveInfo" :disabled="!checkPermission('POINT-USER-UPDATE')">更新</el-button>
                    </el-form-item>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="个人信息">
                  <userInfo v-if="componentShow" :userInfo="userInfo"></userInfo>
              </el-tab-pane>
              <el-tab-pane label="岗位信息">
                  <jobInfo v-if="componentShow"></jobInfo>
              </el-tab-pane>
          </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getUserPhoto} from '@/api/user'
import {saveUserDetail} from '@/api/employees'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
export default {
    data () {
        return {
            userId : this.$route.params.id,
            userInfo : {
                username : '',
                password2 : '',
            },
            rules : {
                username : [{required : true, message : '员工姓名不能为空！', trigger : 'blur'}],
                password2 : [{required : true, message : '密码不能为空！', trigger : 'blur'},
                {min : 6, max : 9, message : '密码长度6～9位', trigger : 'blur'}]
            },
            componentShow : '',     //点击标签得到此标签的下标
        }
    },
    components: {
        userInfo,
        jobInfo,
    },
    created () {
        this.getUserDetail()
    },
    methods: {
        async getUserDetail() {
            this.userInfo = await getUserPhoto(this.userId)
            // console.log(this.userInfo)
            //将员工信息覆盖给userInfo，password2已经在表单中存在，所以一旦输入值会给userInfo重新增一个passwrod2的属性
        },
        async saveInfo() {
            try {
                await this.$refs.userForm.validate()   //发起更新请求之前，先进行表单校验
                await saveUserDetail({...this.userInfo,password : this.userInfo.password2})
                this.$message.success('保存成功')
            } catch (error) {
                this.$message({
                    type : 'error',
                    message : '更新失败，请稍后重试！'
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>