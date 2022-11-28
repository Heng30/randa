<script setup></script>

<template>
  <div
    style="
      display: inline-flex;
      height: 100%;
      align-items: center;
      margin-right: 5px;
      cursor: pointer;
    "
  >
    <el-tooltip content="最小化" placement="bottom-end">
      <div class="img-box" @click="minimizeApp">
        <i class="el-icon-minus"></i>
      </div>
    </el-tooltip>
    <el-tooltip
      content="最大化"
      placement="bottom-end"
    >
      <div class="img-box" style="margin: 0 4px" @click="maximizeApp">
        <i class="el-icon-full-screen"></i>
      </div>
    </el-tooltip>

    <el-tooltip content="关闭" placement="bottom-end">
      <div class="img-box" @click="closeApp">
        <i class="el-icon-close"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped>
.img-box {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: lightgray;
}

.img-box:hover {
  background-color: white;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { appWindow } from '@tauri-apps/api/window';

async function minimizeApp() {
  await appWindow.minimize();
}

async function maximizeApp() {
  await appWindow.maximize();
}

async function closeApp() {
  await appWindow.close();
}
</script>
