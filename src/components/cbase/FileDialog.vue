<template>
  <div style="display: inline-block; margin: 0 10px;">
    <el-button type="primary" @click="openFileDialog"> {{buttonLabel}} </el-button>
    <input id="file_dialog" type="file" style="display: none" ref="inputFile" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps(['buttonLabel'])
const emit = defineEmits(['accept']); // 返回文件名和 ArrayBuffer 数据

const inputFile = ref(null);

function openFileDialog() {
  inputFile.value.click();
}

onMounted(() => {
  inputFile.value.addEventListener('change', () => {
    const reader = new FileReader();
    const file = inputFile.value.files[0];
    reader.readAsArrayBuffer(file);
    reader.onload = (event) => {
      emit('accept', file.name, event.target.result);
    };

    inputFile.value.value = '';
  });
});
</script>
