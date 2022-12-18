<template>
  <div
    style="
      width: calc(100% - 8px);
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

      <div
        style="
          width: 500px;
          height: 40px;
          background-color: #ebeef5;
          margin-left: 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <span style="margin-left: 20px; color: #606266"> {{ walletAddr }}</span>
        <el-tooltip content="复制地址" placement="top">
          <el-button
            @click="copyWalletAddr"
            icon="el-icon-copy-document"
            style="background-color: transparent; border: none"
          ></el-button>
        </el-tooltip>
      </div>

      <el-button type="primary" @click="importWallet" style="margin-left: 10px"
        >导入</el-button
      >
      <el-button type="danger" @click="resetWallet" style="margin-left: 10px"
        >重置</el-button
      >
    </div>

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 10px"
      height="1000"
      border
      stripe
    >
      <el-table-column prop="tokenName" label="代币" width="150">
      </el-table-column>
      <el-table-column prop="amount" label="数量" width="150">
      </el-table-column>
      <el-table-column align="right">
        <template v-slot:header="scope">
          <el-input
            v-model="inputImportTokenAddr"
            placeholder="请输入代币地址"
            style="width: 510px"
          />
          <el-button
            type="primary"
            @click="importToken"
            style="margin-left: 10px"
            >添加</el-button
          >

          <el-button type="primary" @click="saveTableInfo">保存</el-button>
        </template>

        <template v-slot="scope">
          <div>
            <div v-if="scope.row.isSendToken">
              <el-input
                v-model="inputRecvAddr"
                placeholder="请输入接收地址"
                style="width: 400px; margin-right: 10px"
              />
              <el-input
                v-model="inputSendAmount"
                placeholder="代币数量"
                style="width: 100px; margin-right: 10px"
              />

              <el-button
                type="primary"
                @click="sendToken(scope.row)"
                :loading="scope.row.isSending"
              >
                {{ scope.row.isSending ? '正在发送' : '确定' }}</el-button
              >
              <el-button
                type="danger"
                @click="cancelSendToken(scope.row)"
                :disabled="scope.row.isSending"
                >取消</el-button
              >
            </div>

            <div v-if="!scope.row.isSendToken">
              <el-button type="primary" @click="showSendLayout(scope.row)">
                发送
              </el-button>

              <el-button type="danger" @click="deleteToken(scope.row)">
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import { ref, onMounted } from 'vue';
import { Message } from 'element3';
import { arrayBuffer2UTF8, ethProvider } from '../../../js/utils.js';
import { ethNetwork } from '../../../js/store.js';
import { writeText, readText } from '@tauri-apps/api/clipboard';

const currentNetwork = ref('homestead');
const walletAddr = ref('请导入地址');
const tableData = ref([]);
const inputRecvAddr = ref('');
const inputSendAmount = ref('');
const inputImportTokenAddr = ref('');

onMounted(() => {
  tableData.value.push({
    tokenName: 'eth',
    amount: '100',
    isSendToken: false,
    isSending: false,
  });
});

function importWallet() {}
function resetWallet() {}
function importToken() {}
function deleteToken(row) {}
function saveTableInfo() {}
async function copyWalletAddr() {
  await writeText(walletAddr.value);
  Message({
    message: '复制成功',
    type: 'success',
  });
}

function showSendLayout(row) {
  let data = tableData.value;
  for (let i = 0; i < data.length; i++) {
    if (data[i].tokenName === row.tokenName) {
      data[i].isSendToken = true;
      return;
    }
  }
}

function sendToken(row) {
  let data = tableData.value;
  let item = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i].tokenName === row.tokenName) {
      item = data[i];
      item.isSendToken = false;
      break;
    }
  }

  if (!item) return;
  item.isSending = true;
  // TODO: send token
  item.isSending = false;
}

function cancelSendToken(row) {
  let data = tableData.value;
  for (let i = 0; i < data.length; i++) {
    if (data[i].tokenName === row.tokenName) {
      data[i].isSendToken = false;
      return;
    }
  }
}
</script>
