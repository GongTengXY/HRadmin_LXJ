<template>
  <upload-excel :onSuccess="success"></upload-excel>
</template>

<script>
import {importEmployees} from '@/api/employees'
export default {
    methods: {
        async success({header, results}) {
          const userRelations = {
            '入职日期': 'timeOfEntry',
            '手机号': 'mobile',
            '姓名': 'username',
            '转正日期': 'correctionTime',
            '工号': 'workNumber',
            '部门': 'departmentName'
          }
          //第一种
          // const arr = []
          // results.forEach(item => {
          //   const userInfo = {}
          //   Object.keys(item).forEach(key => {
          //     userInfo[userRelations[key]] = item[key]
          //   })
          //   arr.push(userInfo)
          // })
          // console.log(arr)

          //第二种
          let newArr = results.map(item => {
            const userInfo = {}
            Object.keys(item).forEach(key => {
              if(userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
                //后端接口 限制了 不能是字符串  要求转化时间类型
                userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))  //只有这样，才能入库
                return
              }
              userInfo[userRelations[key]] = item[key]
            })
            return userInfo
          })
          await importEmployees(newArr)
          this.$message.success('excel导入成功')
          this.$router.back()
        },
        //转化excel的日期格式
        formatDate(numb, format) {
          const time = new Date((numb - 1) * 24 * 3600000 + 1)
          time.setYear(time.getFullYear() - 70)
          const year = time.getFullYear() + ''
          const month = time.getMonth() + 1 + ''
          const date = time.getDate() - 1 + ''
          if (format && format.length === 1) {
            return year + format + month + format + date
          }
          return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
        }
    }
}
</script>

<style>

</style>