<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :showTitle="true">
        <template v-slot:BeforeInfo>
          <span>共有{{pages.total}}条记录</span>
        </template>
        <template v-slot:btn>
          <el-button size="small" type="success" @click="$router.push('/Import')">excel导入</el-button>
          <el-button size="small" type="warning" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="changeShowing">+新增员工</el-button>
        </template>
      </PageTools>
      
      <!-- 员工表格和分页 -->
      
      <el-card>
        <el-table border style="width: 100%" v-loading="loading" :data="List">
          <el-table-column label="序号" sortable="" type="index" align="center" width="80" fixed="left"/>
          <el-table-column label="姓名" sortable="" prop="username" align="center" width="150"/>
          <el-table-column label="头像" align="center" width="150">
            <template v-slot="{row}">
              <img 
              @click="showQrCode(row.staffPhoto)"
              v-imagerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto" 
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" sortable="" prop="mobile" align="center" width="150"/>
          <el-table-column label="工号" sortable="" prop="workNumber" align="center" width="100"/>
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" align="center" width="150"/>
          <el-table-column label="部门" sortable="" prop="departmentName" align="center" width="100"/>
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" align="center" width="150">
            <template v-slot="{row}">
              {{row.timeOfEntry | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="状态" sortable="" prop="formOfEmployment">
            <template v-slot="{row}">
              <el-switch
              :value="row.formOfEmployment === 1"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" sortable="" width="280" align="center">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="changeState(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployees(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height : 60px">
          <el-pagination 
          layout="prev, pager, next" 
          :total="pages.total" 
          :page-size="pages.size"
          @current-change="changePage">
          </el-pagination>
        </el-row>
      </el-card>
      <AddEmployee :addShowing.sync="showingAdd"></AddEmployee>
      <el-dialog title="二维码" :visible.sync="showQrcodeDialog" >
        <el-row type="flex" justify="center">
          <canvas ref="canvasCode"></canvas>
        </el-row>
      </el-dialog>
      <AssginRole :showRoleDialog.sync="showRoleDialog" :userId="userId" ref="AssginRole"></AssginRole>
    </div>
  </div>
</template>

<script>
import {getEmployeesList, deleteEmployee} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'    //引入员工的枚举对象
import AddEmployee from './components/add-employees.vue'
import {formatDate} from '@/filters'
import QrCode from 'qrcode'
import AssginRole from './components/assign-role.vue'
export default {
  data () {
    return {
      loading : false,
      List : [],   //员工列表
      pages : {
        page : 1,    //当前页码
        size : 10,
        total : 0
      },
      showingAdd : false,   //新增弹出状态
      showQrcodeDialog : false,   //二维码弹出状态
      showRoleDialog : false,     //角色弹出状态
      userId : null,   //定义一个id
    }
  },
  created () {
    this.getListInfo()
  },
  components: {
    AddEmployee,
    AssginRole,
  },
  methods: {
    async getListInfo() {            //获取员工列表
      this.loading = true
      const res = await getEmployeesList(this.pages)
      this.List = res.rows
      // console.log(this.List)
      this.pages.total = res.total
      this.loading = false
    },
    changePage(newPage) {            //分页触发
      this.pages.page = newPage
      this.getListInfo()
    },
    formatEmployment(row, column, cellValue, index) {             //根据id枚举获取数据
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployees(id) {         //删除员工
      try {
        await this.$confirm('您确定删除该员工吗？','提示', {
          confirmButtonText : '确定',
          cancelButtonText : '取消',
          type : 'info'
        })
        await deleteEmployee(id)
        this.getListInfo()
        this.$message({
          type : 'success',
          message : '删除成功'
        })
      } catch (err) {
      }
    },
    changeShowing() {
      this.showingAdd = !this.showingAdd
    },
    exportData() {
      //定义表头的中英文对应关系
      let headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      //导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeesList({page : 1, size : this.pages.total})
        const data = this.formatJson(headers, rows)
        // excel是引入文件的导出对象
        // excel.export_json_to_excel({
        // })
        excel.export_json_to_excel({
          header : Object.keys(headers),
          data,
          filename : '员工信息表',
          bookType : 'xlsx'
        })
      })
    },
    //将数组转化为二维数组
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            let hire = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return hire ? hire.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      if(url) {
        this.showQrcodeDialog = true    //弹层状态改变(数据变化)，但是弹出框不会立刻显示，因为页面渲染是异步的
        this.$nextTick(() => {
          //此时就有了ref对象
          QrCode.toCanvas(this.$refs.canvasCode, url)   //将地址转化为二维码
        })
      } else {
        this.$message.warning('该用户还未上传成功')
      }
    },
    async changeState(id) {
      this.userId = id
      await this.$refs.AssginRole.getEmployeeRoleInfo(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>