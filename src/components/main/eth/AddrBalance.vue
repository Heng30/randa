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
        @click="queryAddrsBalance"
        style="margin-left: 30px"
        :loading="isQuerying"
        >{{ isQuerying ? '正在查询' : '查询' }}</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%" height="1000" border stripe>
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
              style="width: 400px"
            />
            <el-button
              type="primary"
              style="margin: 0 10px 0 30px"
              @click="addAddr"
              >添加</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="提示: 每个地址占一行" placement="top">
              <FileDialog
                @accept="importAddrs"
                style="margin-left: 10px"
                buttonLabel="批量导入"
              >
              </FileDialog>
            </el-tooltip>

            <el-button type="primary" @click="saveAddrs"> 保存 </el-button>
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
import { ref, onMounted } from 'vue';
import { Message } from 'element3';
import { arrayBuffer2UTF8 } from '../../../js/utils.js';
import { ethNetwork } from '../../../js/store.js';
import { ethAddrBalanceTable } from '../../../js/db.js';
import FileDialog from '../../cbase/FileDialog.vue';
import Web3 from 'web3';

const currentNetwork = ref('homestead');
const tableData = ref([]);
const inputAddr = ref('');
const isQuerying = ref(false);
let addArray = [];
let delArray = [];

function _addDBCache(addr) {
  if (addArray.indexOf(addr) === -1) {
    addArray.push(addr);
    let i = delArray.indexOf(addr);
    if (i !== -1) delArray.splice(i, 1);
  }
}

function _delDBCache(addr) {
  if (delArray.indexOf(addr) === -1) {
    delArray.push(addr);
    let i = addArray.indexOf(addr);
    if (i !== -1) addArray.splice(i, 1);
  }
}

onMounted(async () => {
  const addrs = await ethAddrBalanceTable.load();
  if (!Array.isArray(addrs)) return;
  addrs.forEach((item) => {
    tableData.value.push({
      address: item.address,
      balance: '',
    });
  });
});

async function queryAddrsBalance() {
  let provider = ethers.getDefaultProvider(currentNetwork.value);

  isQuerying.value = true;
  for (let i = 0; i < tableData.value.length; i++) {
    let addr = tableData.value[i].address;
    try {
      let balance = await provider.getBalance(addr);
      let ethStr = ethers.utils.formatEther(balance);
      tableData.value[i].balance = Number(ethStr).toFixed(4) + ' Eth';
    } catch (e) {
      Message({
        message: `${addr} 查询余额失败! 原因: ${e.toString()}`,
        type: 'warning',
      });
    }
  }
  isQuerying.value = false;
}

function addAddr() {
  const addr = inputAddr.value;
  if (!Web3.utils.isAddress(addr)) {
    Message({
      message: '非法地址格式，添加失败!',
      type: 'warning',
    });

    return;
  }

  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].address === inputAddr.value) {
      Message({
        message: '地址已经在列表中，添加失败!',
        type: 'info',
      });
      return;
    }
  }

  tableData.value.push({
    address: inputAddr.value,
    balance: '',
  });

  _addDBCache(inputAddr.value);
  inputAddr.value = '';

  Message({
    message: '添加成功!',
    type: 'success',
  });
}

function deleteAddr(row) {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].address === row.address) {
      tableData.value.splice(i, 1);
      _delDBCache(row.address);
      return;
    }
  }
}

function importAddrs(file, data) {
  const addrs = arrayBuffer2UTF8(data);
  const addrList = addrs.split('\n');
  addrList.forEach((addr) => {
    if (!Web3.utils.isAddress(addr)) return;
    for (let i = 0; i < tableData.value.length; i++) {
      if (addr === tableData.value[i].address) return;
    }
    tableData.value.push({
      address: addr,
      balance: '',
    });
    _addDBCache(addr);
  });
  Message({
    message: `导入${file}成功!`,
    type: 'success',
  });
}

function saveAddrs() {
  ethAddrBalanceTable.delete(delArray);
  ethAddrBalanceTable.insert(addArray);
  Message({
    message: '保存成功!',
    type: 'success',
  });
  addArray = [];
  delArray = [];
}
</script>
