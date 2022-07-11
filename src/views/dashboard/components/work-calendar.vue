<template>
  <div>
    <el-row type="flex" justify="end" style="padding-right:15px">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
        <!-- date是当前的单元格的日期，data是对象 对象里有要显示的day -->
        <template v-slot:dateCell="{date,data}" class="content">
            <div class="date-content">
                <span class="text">{{data.day | getDay}}</span>
                <span v-if="isWeek(date)" class="rest">休</span>
            </div>
        </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      //回掉函数的返回值
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },
  created () {
      //获取当前的月份和年份
      this.currentMonth = this.startDate.getMonth() + 1
      this.currentYear = this.startDate.getFullYear()
      //获取当前年份前后5年的的年份
      this.yearList = Array.from(Array(11), (value,index) => this.currentYear - 5 + index)
      this.currentDate = this.startDate
  },
  filters: {
      getDay(value) {
        const day = value.split('-')[2]
        // console.log(day)
        return day.startsWith('0') ? day.substr(1) : day
      }  
  },
  methods : {
    //该函数是为了每次生成最新的日期
    dateChange() {
        let year = this.currentYear
        let month = this.currentMonth
        this.currentDate = new Date(`${year}-${month}-1`)
    },
    isWeek(date) {
        if (date.getDay() === 0 || date.getDay() === 6) {
            return true
        }
        return false
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 46px;
  text-align: center;
  line-height: 46px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>

