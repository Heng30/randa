<template>
  <div
    style="
      width: 100%;
      height: 100%;
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
      <el-select v-model="currentNetwork" placeholder="请选择网络">
        <el-option
          v-for="item in ethNetwork"
          :key="item.name"
          :label="item.name"
          :value="item.network"
        >
        </el-option>
      </el-select>

      <el-button
        type="primary"
        @click="queryAddrBalance()"
        style="margin-left: 30px"
        >查询</el-button
      >
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      height="1000"
      highlight-current-row
      border
      stripe
    >
      <el-table-column prop="address" label="地址" width="500">
      </el-table-column>
      <el-table-column prop="balance" label="余额" width="250">
      </el-table-column>
      <el-table-column align="right">
        <template v-slot:header="scope">
          <div>
            <el-input
              v-model="inputAddr"
              placeholder="请输入需要查询余额的地址"
              style="width: 500px"
            />
            <el-button
              type="primary"
              style="margin: 0 10px 0 30px"
              @click="addAddr()"
              >添加</el-button
            >
            <el-divider direction="vertical"></el-divider>

            <el-button
              type="primary"
              @click="importAddrs()"
              style="margin-left: 10px"
            >
              批量导入
            </el-button>

            <el-button type="primary" @click="saveAddrs()"> 保存 </el-button>
          </div>
        </template>
        <template v-slot="scope">
          <el-button type="danger" @click="deleteAddr(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import { ref } from 'vue';
import { Message } from 'element3';
import { invoke } from '@tauri-apps/api/tauri';
import { json2obj } from '../../../js/utils.js';
import { ethNetwork } from '../../../js/store.js';

const currentNetwork = ref('ethereum');
const tableData = ref([]);
const inputAddr = ref('');

function addAddr() {
  if (inputAddr.value.length <= 0) {
    // todo
    return;
  }

  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].address === inputAddr.value) {
      // todo
      return;
    }
  }

  tableData.value.push({
    address: inputAddr.value,
    balance: '',
  });

  inputAddr.value = '';
}

function deleteAddr(row) {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].address === row.address) {
      tableData.value.splice(i, 1);
      return;
    }
  }
}
</script>
