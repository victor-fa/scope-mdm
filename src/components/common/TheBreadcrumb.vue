<template>
 <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <span class="postion-befor-long">|</span>
        <span class="client-postion">{{$t('Breadcrumb.Fuction')}}</span>
      </el-breadcrumb-item>
      <slot></slot>
      <el-breadcrumb-item>{{ this.$parent.crumbs }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
  export default {
    name: 'theBreadcrumb'
  
  }
</script>

<style scoped>

</style>