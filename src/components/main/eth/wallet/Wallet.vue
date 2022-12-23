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
    <GenWallet
      ref="genWalletDialog"
      @finished="
        (addr) => {
          walletAddr = addr;
        }
      "
    />
    <SendDialog ref="sendTokenDialog" />
    <div
      style="
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-select
        v-model="currentNetwork"
        placeholder="请选择网络"
        @change="refreshTableData"
      >
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
          <el-button
            type="primary"
            @click="refreshTableInfo"
            :loading="isRefreshingTableInfo"
            >刷新</el-button
          >
        </template>

        <template v-slot="scope">
          <div>
            <el-button type="primary" @click="showSendDialog(scope.row)">
              发送
            </el-button>

            <el-button
              type="danger"
              @click="deleteToken(scope.row)"
              :disabled="!!scope.row.disabled"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import { ref, onMounted } from 'vue';
import { Msgbox, Message } from 'element3';
import { isValidEthAddr, ethProvider, rlog } from '../../../../js/utils.js';
import { ethNetwork } from '../../../../js/store.js';
import { walletInfoTable, ethWalletInfoTable } from '../../../../js/db.js';
import { writeText } from '@tauri-apps/api/clipboard';
import GenWallet from './GenWallet.vue';
import SendDialog from './SendDialog.vue';
import CryptoJS from 'crypto-js';
import { aseDecrypt } from '../../../../js/utils.js';

const walletAddrDefault = '请先导入地址';
const networkName = 'Ethereum';

const currentNetwork = ref('homestead');
const walletAddr = ref(walletAddrDefault);
const inputImportTokenName = ref('');
const inputImportTokenAddr = ref('');
const isRefreshingTableInfo = ref(false);
const genWalletDialog = ref(null);
const sendTokenDialog = ref(null);
const tableData = ref([]);
const tableDataAll = ref([]);


onMounted(async () => {
  let tdata = await ethWalletInfoTable.load();
  if (Array.isArray(tdata)) {
    tdata.forEach((item) => {
      tableDataAll.value.push({
        tokenName: item.name,
        tokenAddr: item.tokenAddr,
        amount: item.amount,
        disabled: item.disabled,
        network: item.network,
        status: 'N/A',
        isSending: false,
      });
    });
  }
  refreshTableData();

  let item = await walletInfoTable.load(networkName);
  if (item.length === 1) {
    walletAddr.value = item[0].address;
  }
});

function refreshTableData() {
  tableData.value = [];
  tableDataAll.value.forEach((item) => {
    if (item.network === currentNetwork.value) {
      tableData.value.push(item);
    }
  });
}

async function _newWallet() {
  let password = await _checkPassword();
  if (!password) return null;

  let item = await walletInfoTable.load(networkName);
  if (item.length === 1) {
    const privateKey = aseDecrypt(password, item[0].privateKey);
    const provider = ethProvider(currentNetwork.value);
    return new ethers.Wallet(privateKey, provider);
  }

  return null;
}

async function _newPassword() {
  let password = '';
  await Msgbox.prompt('', '请输入密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^\S{8,}$/,
    inputPlaceholder: '至少8位数字或字母',
  })
    .then(async ({ value }) => {
      password = value;
    })
    .catch(() => {});

  return password;
}

async function _checkPassword() {
  let password = '';
  await Msgbox.prompt('', '请输入密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password',
    inputPattern: /^\S{8,}$/,
    inputPlaceholder: '至少8位数字或字母',
  })
    .then(async ({ value }) => {
      let item = await walletInfoTable.load(networkName);
      if (item.length !== 1) {
        Message({
          message: '警告：数据库出错，请重启程序!',
          type: 'warning',
        });
        return password;
      }

      if (CryptoJS.MD5(value).toString() !== item[0].password) {
        Message({
          message: '警告：密码错误!',
          type: 'warning',
        });
        return password;
      }

      password = value;
    })
    .catch(() => {});

  return password;
}

async function importWallet() {
  if (isValidEthAddr(walletAddr.value)) {
    Message({
      message: '警告：请先重置钱包!',
      type: 'warning',
    });
    return;
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

  if (!(await _checkPassword())) return;
  await walletInfoTable.delete(networkName);
  walletAddr.value = walletAddrDefault;

  Message({
    message: '恢复钱包成功!',
    type: 'success',
  });
  return;
}

async function _updateTokenAmount(provider) {
  for (let i = 0; i < tableData.value.length; i++) {
    let item = tableData.value[i];
    try {
      const address = item.tokenAddr;
      if (address === 'N/A') {
        const balance = await provider.getBalance(walletAddr.value);
        item.amount = Number(ethers.utils.formatEther(balance)).toFixed(4);
      } else {
        const abi = [
          'function balanceOf(address owner) view returns (uint256)',
        ];
        const erc20 = new ethers.Contract(address, abi, provider);
        const balance = await erc20.balanceOf(walletAddr.value);
        item.amount = Number(ethers.utils.formatEther(balance)).toFixed(4);
      }
      ethWalletInfoTable.update(item);
    } catch (e) {
      rlog(e.toString());
    }
  }
}

async function refreshTableInfo() {
  if (!isValidEthAddr(walletAddr.value)) {
    Message({
      message: '警告：请先导入地址!',
      type: 'warning',
    });
    return;
  }

  isRefreshingTableInfo.value = true;
  const provider = ethProvider(currentNetwork.value);
  await _updateTokenAmount(provider);
  isRefreshingTableInfo.value = false;

  Message({
    message: '刷新成功!',
    type: 'success',
  });
}

async function importToken() {
  let tokenName = inputImportTokenName.value;
  let tokenAddr = inputImportTokenAddr.value;
  if (tokenName.length <= 0 || !isValidEthAddr(tokenAddr)) {
    Message({
      message: '警告：代币名称为空或代币地址非法!',
      type: 'warning',
    });
    return;
  }

  for (let i = 0; i < tableDataAll.value.length; i++) {
    if (
      tableDataAll.value[i].network === currentNetwork.value &&
      (tableDataAll.value[i].tokenName === tokenName ||
        tableDataAll.value[i].tokenAddr === tokenAddr)
    ) {
      Message({
        message: '警告：代币名称或地址重复，无法添加!',
        type: 'warning',
      });
      return;
    }
  }

  let item = {
    tokenName: tokenName,
    tokenAddr: tokenAddr,
    network: currentNetwork.value,
    amount: 'N/A',
    status: 'N/A',
    disabled: false,
    isSending: false,
  };
  tableDataAll.value.push(item);
  await ethWalletInfoTable.insert(item);
  refreshTableData();

  inputImportTokenAddr.value = '';
  inputImportTokenName.value = '';

  Message({
    message: '添加代币成功!',
    type: 'success',
  });
}

async function deleteToken(row) {
  for (let i = 0; i < tableDataAll.value.length; i++) {
    const item = tableDataAll.value[i];
    if (item.network === row.network && item.tokenName === row.tokenName) {
      Msgbox.confirm('是否删除该代币?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await ethWalletInfoTable.delete(item);
          tableDataAll.value.splice(i, 1);
          refreshTableData();
          Message({
            message: '删除成功!',
            type: 'success',
          });
        })
        .catch(() => {});
    }
  }
}

async function copyWalletAddr() {
  await writeText(walletAddr.value);
  Message({
    message: '复制成功',
    type: 'success',
  });
}

async function _doTransaction(item) {
  const wallet = await _newWallet();
  if (!wallet) return false;
  console.log(item);
  // TODO: send token
  return true;
}

function showSendDialog(row) {
  let item = null;
  for (let i = 0; i < tableData.value.length; i++) {
    if (row.tokenName === tableData.value[i].tokenName) {
      item = tableData.value[i];
    }
  }

  sendTokenDialog.value.setProps(item, async () => {
    item.isSending = true;
    const ret = await _doTransaction(item);
    item.isSending = false;
    return ret;
  });
  sendTokenDialog.value.show();
}
</script>
