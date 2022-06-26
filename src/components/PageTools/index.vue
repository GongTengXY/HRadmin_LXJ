<template>
  <el-card class="PageTools">
      <el-row type="flex" justify="space-between" align="middle">
          <!-- 提示部分 -->
          <el-col>
              <div class="BeforeInfo" v-if="showTitle">
                <i class="el-icon-info"></i>
                <slot name="BeforeInfo"></slot>
              </div>
          </el-col>
          <!-- 按钮功能 -->
          <el-col>
              <el-row type="flex" justify="end">
                <slot name="btn"></slot>
              </el-row>
          </el-col>
      </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    showTitle : {
      type : Boolean,
      default : false
    }
  }
}
</script>

<style lang="scss" scoped>
.PageTools {
  margin: 10px 0 ;
  .BeforeInfo {
    line-height: 30px;
    width: 50%;
    padding: 0 10px;
    border: 1px solid rgba(145, 213, 255, 1);
    border-radius: 3px;
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 5px;
      color:#409eff;
    }
  }
}
</style>