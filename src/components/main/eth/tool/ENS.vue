<template>
  <div style="height: 100%; display: flex">
    <el-card style="width: 800px" :body-style="{ padding: '4px', margin: '4px' }">
      <template v-slot:header>
        <span>Ethereum 小工具</span>
      </template>

      <div style="margin-bottom: 30px; display: flex; flex-direction: column">
        <div style="width: 100%; display: flex">
          <el-input v-model="inputAddr" placeholder="请输入地址">
            <template v-slot:prepend> ENS查询 </template>
          </el-input>

          <el-button
            type="primary"
            icon="el-icon-search"
            style="margin-left: 10px"
            :loading="isQueryingENS"
            @click="queryENS"
            >查询</el-button
          >
        </div>
        <p style="text-align: center">{{ outputENS }}</p>
      </div>

      <div style="display: flex; flex-direction: column">
        <div style="width: 100%; display: flex">
          <el-input v-model="inputENS" placeholder="请输入ENS">
            <template v-slot:prepend> 地址查询 </template>
          </el-input>

          <el-button
            type="primary"
            style="margin-left: 10px"
            icon="el-icon-search"
            :loading="isQueryingAddr"
            @click="queryAddr"
            >查询</el-button
          >
        </div>

        <p style="text-align: center">{{ outputAddr }}</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  height: calc(100% - 20px);
  margin: 10px 10px;
}
</style>

<script setup>
import { ref } from 'vue';
import { Message } from 'element3';
import {
  ethProvider,
  isValidENS,
  isValidEthAddr,
} from '../../../../js/utils.js';

const inputAddr = ref('');
const inputENS = ref('');
const outputAddr = ref('没有数据');
const outputENS = ref('没有数据');
const isQueryingENS = ref(false);
const isQueryingAddr = ref(false);

async function queryAddr() {
  if (!isValidENS(inputENS.value)) {
    Message({
      message: 'ENS地址格式非法!',
      type: 'warning',
    });
    return;
  }

  isQueryingAddr.value = true;
  outputAddr.value = '没有数据';

  const provider = ethProvider();
  try {
    outputAddr.value = await provider.resolveName(inputENS.value);

    if (!outputAddr.value) {
        outputAddr.value = '没有域名绑定';
    }
  } catch (e) {
    Message({
      message: `ENS地址查询失败! 原因: ${e}`,
      type: 'warning',
    });
  }
  isQueryingAddr.value = false;
}

async function queryENS() {
  if (!isValidEthAddr(inputAddr.value)) {
    Message({
      message: 'Eth地址格式非法!',
      type: 'warning',
    });
    return;
  }

  isQueryingENS.value = true;
  outputENS.value = '没有数据';

  const provider = ethProvider();
  try {
    outputENS.value = await provider.lookupAddress(inputAddr.value);
    if (!outputENS.value) {
        outputENS.value = '没有地址绑定';
    }
  } catch (e) {
    Message({
      message: `Eth地址查询失败! 原因: ${e}`,
      type: 'warning',
    });
  }
  isQueryingENS.value = false;
}
</script>
