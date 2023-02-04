<template>
  <div
    style="
      width: calc(100% - 8px);
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

    <div style="flex-grow: 1; overflow-y: scroll">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="transactionTime" label="交易时间" width="180">
        </el-table-column>
        <el-table-column prop="transactionHash" label="交易哈希">
        </el-table-column>
        <el-table-column prop="fromAddr" label="发送者" width="430">
        </el-table-column>
        <el-table-column prop="toAddr" label="接收者" width="430">
        </el-table-column>
        <el-table-column prop="amount" label="数量(Eth)" width="100">
        </el-table-column>
        <el-table-column prop="confirmations" label="确认数" width="120">
        </el-table-column>
      </el-table>
    </div>

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
        :total="totalHistoryCnt"
        :current-page="curPage"
        :page-size="pageSize"
        @current-change="jump2Page"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { Message } from 'element3';
import { ethers } from 'ethers';
import {
  ethScanProvider,
  isValidEthAddr,
  timeFormat,
} from '../../../js/utils.js';

const isQuerying = ref(false);
const inputAddr = ref('');
const tableData = ref([]);
const historys = ref([]);
const totalHistoryCnt = ref(0);
const curPage = ref(0);
const pageSize = ref(15);

watchEffect(() => {
  totalHistoryCnt.value = historys.value.length;
});

async function queryHistoryTransaction() {
  if (!isValidEthAddr(inputAddr.value)) {
    Message({
      message: '警告: 输入地址格式非法!',
      type: 'warning',
    });
    return;
  }

  isQuerying.value = true;
  const provider = ethScanProvider();

  try {
    const res = await provider.getHistory(inputAddr.value);

    let tmpdata = [];
    res.forEach((transaction) => {
      tmpdata.unshift({
        transactionTime: timeFormat(transaction.timestamp),
        transactionHash: transaction.hash,
        fromAddr: transaction.from,
        toAddr: transaction.to,
        amount: Number(
          ethers.utils.formatEther(transaction.value.toString())
        ).toFixed(4),
        confirmations: transaction.confirmations,
      });
    });

    historys.value = tmpdata;
    jump2Page(1);

    Message({
      message: '获取历史交易记录成功',
      type: 'success',
    });
  } catch (e) {
    Message({
      message: `警告: 获取历史交易记录失败! 原因: ${e}`,
      type: 'warning',
    });
  }

  isQuerying.value = false;
}

function jump2Page(page) {
  let data = [];
  let start = (page - 1) * pageSize.value;
  let end = page * pageSize.value;

  for (let i = start; i < historys.value.length && i < end; i++) {
    data.push(historys.value[i]);
  }

  tableData.value = data;
  curPage.value = page;
}
</script>
