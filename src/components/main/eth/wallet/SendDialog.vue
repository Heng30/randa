<template>
  <el-dialog
    title="请确认交易信息"
    width="650px"
    :visible.sync="dialogVisible"
    v-model:visible="dialogVisible"
  >
    <template v-slot:default>
      <div style="font-size: 1.2em; color: #303133">
        <div style="display: flex">
          <span style="width: 50%">
            代币信息: {{ tokenName }} ({{ networkName }})</span
          >
          <span style="width: 50%"> 预估油费: {{ estimatGasFee }} USDT </span>
        </div>

        <div style="margin: 20px 0">
          <span>接收地址: </span>
          <el-input
            v-model="inputRecvAddr"
            placeholder="请输入接收地址"
            style="width: 522px"
          >
            <template v-slot:suffix>
              <el-tooltip content="地址簿" placement="top">
                <i
                  class="el-input__icon el-icon-notebook-2"
                  @click="showAddrBook"
                ></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>

        <div style="display: flex">
          <div style="width: 50%">
            代币数量:
            <el-input
              v-model="inputSendAmount"
              :placeholder="tokenName"
              style="width: 150px"
            />
          </div>

          <div style="width: 25%">
            油价:
            <el-input
              v-model="inputGasPrice"
              placeholder="Gwei"
              style="width: 80px"
              @change="calEstimatGasFee"
            />
          </div>

          <div style="width: 25%">
            油量:
            <el-input
              v-model="inputGasLimit"
              placeholder="油量"
              style="width: 100px"
              @change="calEstimatGasFee"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="cancelSend">取 消</el-button>
        <el-button type="primary" @click="sendToken">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { Message } from 'element3';
import { chainGasPrice, tokenPrice, ethNetwork } from '../../../../js/store.js';

import { isValidEthAddr } from '../../../../js/utils.js';

const dialogVisible = ref(false);
const inputGasPrice = ref('');
const inputGasLimit = ref('21000');

const inputRecvAddr = ref('');
const inputSendAmount = ref('');
const tokenName = ref('');
const networkName = ref('');
const estimatGasFee = ref('N/A');
let sendCB = null;
let titem = null;

defineExpose({
  show: () => {
    dialogVisible.value = true;
    inputRecvAddr.value = '';
    inputSendAmount.value = '';
    inputGasPrice.value = chainGasPrice.eth ? chainGasPrice.eth : '10';
    inputGasLimit.value = tokenName.value === 'ETH' ? '21000' : '250000';
    calEstimatGasFee();
  },

  setProps: (item, cb) => {
    titem = item;
    sendCB = cb;
    tokenName.value = item.tokenName;
    networkName.value = (() => {
      for (let i = 0; i < ethNetwork.length; i++) {
        if (ethNetwork[i].network === item.network) return ethNetwork[i].name;
      }
    })();
  },
});

async function calEstimatGasFee() {
  const ethPrice = tokenPrice.eth !== 'N/A' ? tokenPrice.eth : 0;
  const fee =
    (Number(inputGasPrice.value) *
      Number(inputGasLimit.value) *
      Number(ethPrice)) /
    1e9;
  estimatGasFee.value = fee.toFixed(4);
}

function cancelSend() {
  dialogVisible.value = false;
}

async function sendToken() {
  if (
    !isValidEthAddr(inputRecvAddr.value) ||
    isNaN(Number(inputSendAmount.value)) ||
    Number(inputSendAmount.value) <= 0
  ) {
    Message({
      message: '警告：接收地址或发送数量格式错误!',
      type: 'warning',
    });
    return;
  }

  dialogVisible.value = false;
  if (titem && sendCB) {
    titem.recvAddr = inputRecvAddr.value;
    titem.sendAmount = inputSendAmount.value;
    titem.gasPrice = inputGasPrice.value;
    titem.gasLimit = inputGasLimit.value;
    await sendCB();
    titem.recvAddr = '';
    titem.sendAmount = '0';
  } else {
    Message({
      message: '警告：发送失败，没有设置回调函数!',
      type: 'warning',
    });
  }
}

function showAddrBook() {
  console.log('TODO: show address book');
}
</script>
