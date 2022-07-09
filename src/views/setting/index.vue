<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs @tab-click="getDetails">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <el-row style="height : 60px">
              <el-button type="primary" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" align="center"></el-table-column>
              <el-table-column label="角色名称" width="240" prop="name" align="center"></el-table-column>
              <el-table-column label="描述" prop="description" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{row}">
                  <el-button size="small" type="primary" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="success" @click="editSoleRole(row.id)">修改</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" style="height : 50px" justify="center" align="middle">
              <el-pagination 
              layout="prev, pager, next" 
              :total="pages.total"
              :page-size="pages.pagesize" 
              :current-page="pages.page"
              @current-change="changePage"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>

          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
              center
              show-icon>
            </el-alert>
            <el-form label-width="120px" class="companyForm">
              <el-form-item label="公司名称">
                <el-input disabled style="width:400px" v-model="CompanyDetails.name"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width:400px" v-model="CompanyDetails.companyAddress"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width:400px" v-model="CompanyDetails.mailbox"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" disabled  style="width:400px" v-model="CompanyDetails.remarks"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 编辑角色弹层 -->
      <el-dialog :visible="showDialog" @close="btnCancel" :title="roleForm.id ?'修改信息':'新增角色'" >
        <el-form :rules="rules" :model="roleForm" label-width="120px" ref="roleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description"></el-input>
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6" class="keys">
            <el-button size="small" type="info" @click="showDialog = false">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <!-- 分配权限弹层 -->
      <el-dialog title="分配权限" :visible="permissionShow" @close="btnPerCancel">
        <el-tree
        ref="perTree"
        :props="props"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        :data="permData"
        :show-checkbox="true"
        node-key="id"
        ></el-tree>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPerOK">确定</el-button>
            <el-button size="small" @click="btnPerCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getRoleList, getCompanyDetails, deleteRole, editRole, editRoleInfo, addRole, assginPermisson} from '@/api/setting'
import {getAllPermission} from '@/api/permission'
import {tranListToTreeDate} from '@/utils'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      list : [],
      pages : {    //放置页码及相关数据
        page : 1,    //页码
        pagesize : 10,   //每页条数
        total : 0,    //记录总数
      },
      CompanyDetails : {},    //公司详情
      showDialog : false,     //弹出层的状态
      rules : {
        name : [{required : true,message : '角色名称不能为空', trigger : 'blur'}]
      },
      roleForm : {},   //修改的内容或新增内容
      props : {
        label : 'name',   //label属性来查找内容显示
        children : 'children',   //从这个属性去找节点
      },
      permData : [],  //用来接收权限数据（树形）
      permissionShow : false,    //分配权限弹出层
      roleId : null,  //用来记录角色id
      selectCheck : [],     //用来接收已选权限节点
    }
  },
  created () {
    this.getAllRoleList()
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  methods: {
    async getAllRoleList() {
      const res = await getRoleList(this.pages)
      this.list = res.rows
      this.pages.total = res.total
    },
    changePage(newPage) {
      this.pages.page = newPage     //把当前页码赋值给当前最新的页码
      this.getAllRoleList()
    },
    async getDetails(newTab) {
      if(newTab.index == 1) {
        this.CompanyDetails = await getCompanyDetails(this.companyId)
      }
    },
    async deleteRole(id) {     
      try {
        await this.$confirm('确认删除该角色吗','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
        await deleteRole(id)
        this.getAllRoleList()
        this.$message({
          type : 'success',
          message : '删除角色成功！',
          center : true
        })
      } catch (err) {
        console.log(err)
      }
    },
    async editSoleRole(id) {
      this.roleForm = await editRole(id)
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {               //roleForm中有id就是编辑，新增是没有id的
          await editRoleInfo(this.roleForm)
        } else {
          //新增角色的业务
          await addRole(this.roleForm)
        }
        this.getAllRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.roleForm = {
        name : '',
        description : ''
      }
      this.$refs.roleForm.resetFields()   //将整个表单进行重置，各项字段值重置为初始值且移除校验结果
      this.showDialog = false
    },
    async assignPerm(id) {  //获取权限数据
      this.permData = tranListToTreeDate(await getAllPermission(), '0')
      this.roleId = id

      //根据id获取角色的权限
      const {permIds} = await editRole(id)   //permIds是当前角色的权限点数据
      this.selectCheck = permIds
      this.permissionShow = true
    },
    btnPerCancel() {   //取消关闭弹层
      this.selectCheck = []
      this.permissionShow = false
    },
    async btnPerOK() {
      // console.log(this.$refs.perTree.getCheckedKeys())
      await assginPermisson({permIds : this.$refs.perTree.getCheckedKeys(), id : this.roleId})
      this.$message.success('分配权限成功！')
      this.permissionShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.companyForm {
  margin-top: 30px;
  padding-left: 270px;
}
.keys {
  display: flex;
  justify-content: center;
}
</style>