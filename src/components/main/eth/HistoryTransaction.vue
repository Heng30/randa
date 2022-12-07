<template>
  <div
    style="
      width: 100%;
      height: calc(100% - 10px);
      margin: 4px;
      display: flex;
      flex-direction: column;
    "
  >
    <div
      style="
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-input
        placeholder="请输入地址"
        v-model="inputAddr"
        style="width: 500px"
      >
        <template v-slot:prepend> 交易历史查询 </template>
      </el-input>

      <el-button
        :loading="isQuerying"
        type="primary"
        @click="queryHistoryTransaction"
        style="margin: 0 10px"
        icon="el-icon-search"
      >
        查询
      </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" height="1000" border stripe>
      <el-table-column prop="transactionTime" label="交易时间" width="250">
      </el-table-column>
      <el-table-column prop="transactionHash" label="交易哈希" width="500">
      </el-table-column>
      <el-table-column prop="fromAddr" label="发送者" width="450">
      </el-table-column>
      <el-table-column prop="toAddr" label="接收者" width="450">
      </el-table-column>
      <el-table-column prop="amount" label="数量"> </el-table-column>
    </el-table>

    <div
      style="
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      "
    >
      <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next, total"
        :total="100"
        @current-change="jump2Page"
        @prev-click="prevPage"
        @next-click="nextPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isQuerying = ref(false);
const inputAddr = ref('');
const tableData = ref([]);

function queryHistoryTransaction() {}

function jump2Page() {}
function prevPage() {}
function nextPage() {}
</script>
