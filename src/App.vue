<script setup>
import Header from './components/header/Header.vue';
import Main from './components/main/Main.vue';
import Footer from './components/footer/Footer.vue';
import { uninitDB } from './js/db.js';
import { onUnmounted } from 'vue';

onUnmounted(async () => {
  await uninitDB();
});
</script>

<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <Main />
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
