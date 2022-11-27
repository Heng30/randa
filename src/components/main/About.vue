<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    "
  >
    <img src="../../assets/about.png" alt="about" style="margin-bottom: 6px" />
    <div>v{{ APP_VERSION }}</div>
    <div>
      <span>{{APP_NAME}} is created by </span>
      <el-tooltip :content="homeURL" placement="top">
        <span style="color: blue"> Heng30 </span>
      </el-tooltip>
    </div>
    <div>
      <span>Follow development and report issues on </span>
      <el-tooltip :content="githubURL" placement="top">
        <span style="color: blue">Github</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { APP_VERSION, APP_NAME } from '../../js/store.js';
import { ref } from 'vue';
const githubURL = ref('https://github.com/Heng30/randa');
const homeURL = ref('https://github.com/Heng30');
</script>
