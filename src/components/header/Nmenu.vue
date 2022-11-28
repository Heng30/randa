<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    @select="handleSelect"
    text-color="#fff"
    background-color="#545c64"
    active-text-color="#ffd04b"
    menu-trigger="click"
    unique-opened
    style="flex: auto;"
  >
    <el-submenu index="eth">
      <template v-slot:title>Ethereum</template>
      <el-menu-item index="ethAddrGen">地址生成</el-menu-item>
      <el-menu-item index="ethAddrBalance">余额查询</el-menu-item>
    </el-submenu>
    <el-submenu index="setting">
      <template v-slot:title>设置</template>
      <el-menu-item index="ethSetting">Ethereum</el-menu-item>
    </el-submenu>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
</template>

<style scope>
.el-menu-item,
.el-submenu__title {
  font-size: 1em;
}
</style>

<script setup>
import { ref } from 'vue';
import { navmenu } from '../../js/store.js';

const activeIndex = ref(navmenu.selectedPage);

function handleSelect(page) {
  navmenu[navmenu.selectedPage] = false;
  navmenu[page] = true;
  navmenu.selectedPage = page;
}
</script>
