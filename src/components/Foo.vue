<template>
  <div style="display: flex; align-items: center; flex-direction: column">
    <el-button @click="fxx" style="width: 100px">Click Me</el-button>

    <div
      style="
        display: flex;
        margin-top: 20px;
        height: 100px;
        justify-content: center;
      "
    >
      <transition name="el-fade-in-linear">
        <div v-show="show" class="transition-box">.el-fade-in-linear</div>
      </transition>
      <transition name="el-fade-in">
        <div v-show="show" class="transition-box">.el-fade-in</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(true);
function fxx() {
  console.log('jfijfeif');
  show.value = !show.value;
}
</script>

<style scoped>
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
