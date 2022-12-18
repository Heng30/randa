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
    <GenWallet ref="genWalletDialog" @finished="setWalletAddr" />
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
            type="text"
            style="margin-right: 10px"
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
      <el-table-column label="代币" width="150">
        <template v-slot="scope">
          <el-tooltip :content="scope.row.tokenAddr" placement="top">
            <span> {{ scope.row.tokenName }} </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="数量" width="150">
      </el-table-column>
      <el-table-column prop="status" label="交易状态" width="150">
      </el-table-column>
      <el-table-column align="right">
        <template v-slot:header="scope">
          <el-input
            v-model="inputImportTokenName"
            placeholder="输入代币名称"
            style="width: 120px; margin-right: 10px"
          />
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
          <el-divider direction="vertical" style="margin: 0 10px"></el-divider>
          <el-button type="primary" @click="saveTableInfo">保存</el-button>
          <el-button
            type="primary"
            @click="refreshTableInfo"
            :loading="isRefreshingTableInfo"
            >刷新</el-button
          >
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

              <el-button
                type="danger"
                @click="deleteToken(scope.row)"
                :disabled="!scope.row.canDelete"
              >
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
import { ref, onMounted, defineExpose } from 'vue';
import { Msgbox, Message } from 'element3';
import { isValidEthAddr } from '../../../../js/utils.js';
import { ethNetwork } from '../../../../js/store.js';
import { walletInfoTable, ethWalletInfoTable } from '../../../../js/db.js';
import { writeText } from '@tauri-apps/api/clipboard';
import GenWallet from './GenWallet.vue';

const walletAddrDefault = '请先导入地址';
const networkName = 'Ethereum';

const currentNetwork = ref('homestead');
const walletAddr = ref(walletAddrDefault);
const inputRecvAddr = ref('');
const inputSendAmount = ref('');
const inputImportTokenName = ref('');
const inputImportTokenAddr = ref('');
const isRefreshingTableInfo = ref(false);
const genWalletDialog = ref(null);

const tableData = ref([
  {
    tokenName: 'ETH',
    tokenAddr: 'N/A',
    amount: '0',
    status: 'N/A',
    isSendToken: false,
    isSending: false,
    canDelete: false,
  },
  {
    tokenName: 'USDT',
    tokenAddr: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    amount: '0',
    status: 'N/A',
    isSendToken: false,
    isSending: false,
    canDelete: false,
  },
]);

onMounted(async () => {
  let tdata = await ethWalletInfoTable.load();
  if (Array.isArray(tdata)) {
    tdata.forEach((item) => {
      tableData.value.push({
        tokenName: item.name,
        tokenAddr: item.tokenAddr,
        amount: item.amount,
        status: 'N/A',
        isSendToken: false,
        isSending: false,
        canDelete: true,
      });
    });
  }

  let item = await walletInfoTable.load(networkName);
  if (item.length === 1) {
    walletAddr.value = item[0].address;
  }
});

function  setWalletAddr(addr) {
    walletAddr.value = addr;
}

async function _newPassword() {
  let password = '';
  await Msgbox.prompt('', '请输入密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^\S{8,}$/,
    inputErrorMessage: '密码至少8位',
  })
    .then(async ({ value }) => {
      password = value;
    })
    .catch(() => {});

  return password;
}

async function _checkPassword() {
  let passChecked = false;
  await Msgbox.prompt('', '请输入密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(async ({ value }) => {
      let item = await walletInfoTable.load(networkName);
      if (item.length != 1) {
        Message({
          message: '警告：数据库出错，请重启程序!',
          type: 'warning',
        });
        return;
      }

      value = ethers.utils.sha256(value);
      if (value !== item[0].password) {
        Message({
          message: '警告：密码错误!',
          type: 'warning',
        });
        return;
      }

      passChecked = true;
    })
    .catch(() => {});

  return passChecked;
}

async function importWallet() {
  if (isValidEthAddr(walletAddr.value)) {
    Message({
      message: '警告：请先重置钱包!',
      type: 'warning',
    });
    retrun;
  }

  let password = await _newPassword();
  if (password.length < 8) return;
  genWalletDialog.value.setPassword(password);
  genWalletDialog.value.show();
}

async function resetWallet() {
  let waddr = walletAddr.value;
  if (!isValidEthAddr(waddr)) {
    Message({
      message: '警告：请先导入地址!',
      type: 'warning',
    });
    return;
  }

  await _checkPassword();
  await walletInfoTable.delete(networkName);
  walletAddr.value = walletAddrDefault;

  Message({
    message: '恢复钱包成功!',
    type: 'success',
  });
  return;
}
async function refreshTableInfo() {}

async function importToken() {
  let tokenName = inputImportTokenName.value;
  let tokenAddr = inputImportTokenAddr.value;
  let amount = '0';
  if (!isValidEthAddr(tokenAddr)) {
    Message({
      message: '警告：代币地址非法!',
      type: 'warning',
    });
    return;
  }

  if (tokenName.length <= 0) {
    // TODO: get token name
  }

  for (let i = 0; i < tableData.value.length; i++) {
    if (
      tableData.value[i].tokenName === tokenName ||
      tableData.value[i].tokenAddr === tokenAddr
    ) {
      Message({
        message: '警告：代币名称或地址重复，无法添加!',
        type: 'warning',
      });
      return;
    }
  }

  //TODO: get token amount

  let item = {
    tokenName: tokenName,
    tokenAddr: tokenAddr,
    amount: amount,
    status: 'N/A',
    isSendToken: false,
    isSending: false,
    canDelete: true,
  };
  tableData.value.push(item);
  await ethWalletInfoTable.insert(item);

  inputImportTokenAddr.value = '';
  inputImportTokenName.value = '';

  Message({
    message: '添加代币成功!',
    type: 'success',
  });
}

async function deleteToken(row) {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].tokenName === row.tokenName) {
      await ethWalletInfoTable.delete(tableData.value[i]);
      tableData.value.splice(i, 1);
      Message({
        message: '删除成功!',
        type: 'success',
      });
      return;
    }
  }
}

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
