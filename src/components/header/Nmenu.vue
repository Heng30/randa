<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="homepage">主页</el-menu-item>
    <el-menu-item index="orderpage">订单管理 </el-menu-item>
  </el-menu>
</template>

<style scope>
.el-menu-item,
.el-submenu__title {
  font-size: 1.2em;
}
</style>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['switchMenu']);
const activeIndex = ref('homepage');

function handleSelect(key) {
  emit('switchMenu', key);
}
</script>
