<script setup>
import Header from './components/header/Header.vue';
import Main from './components/main/Main.vue';
import Footer from './components/Footer.vue';

import { ref } from 'vue';

const selectedMenu = ref('homepage');
function switchMenu( key) {
    selectedMenu.value = key;
}
</script>

<template>
  <el-container>
    <el-header>
      <Header @switchMenu="switchMenu" />
    </el-header>
    <el-main>
      <Main :selected-menu="selectedMenu" />
    </el-main>
    <el-footer height="40px">
      <Footer />
    </el-footer>
  </el-container>
</template>

<style scoped>
.el-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

.el-header,
.el-main,
.el-footer {
  padding: 0;
}

.el-main {
  margin-top: 2px;
}
</style>
