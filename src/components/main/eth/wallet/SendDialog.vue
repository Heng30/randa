<template>
  <el-dialog
    title="请确认交易信息"
    width="650px"
    :visible.sync="dialogVisible"
    v-model:visible="dialogVisible"
  >
    <template v-slot:default>
      <div style="font-size: 1.2em; color: #303133">
        <div style="margin-bottom: 20px">
          <p style="width: 50%; margin-bottom: 20px">
            代币名称: {{ tokenName }}
          </p>
          <div>
            <span>接收地址: </span>
            <el-input
              v-model="inputRecvAddr"
              placeholder="请输入接收地址"
              style="width: 450px"
            />
          </div>
        </div>

        <div style="display: flex">
          <div style="width: 50%">
            代币数量:
            <el-input
              v-model="inputSendAmount"
              placeholder="数量"
              style="width: 150px"
            />
          </div>

          <div style="width: 25%">
            油价:
            <el-input
              v-model="inputGasPrice"
              placeholder="Gwei"
              style="width: 80px"
            />
          </div>

          <div style="width: 25%">
            油量:
            <el-input
              v-model="inputGasLimit"
              placeholder="油量"
              style="width: 80px"
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
import { chainGasPrice } from '../../../../js/store.js';

const emit = defineEmits(['finished']);

const dialogVisible = ref(false);
const inputGasPrice = ref('');
const inputGasLimit = ref('21000');

const inputRecvAddr = ref('');
const inputSendAmount = ref('');
const tokenName = ref('');
let sendCB = null;
let titem = null;

defineExpose({
  show: () => {
    dialogVisible.value = true;
    inputGasPrice.value = chainGasPrice.eth ? chainGasPrice.eth : '10';
  },

  setProps: (item, cb) => {
    titem = item;
    sendCB = cb;
    tokenName.value = item.tokenName;
  },
});

function cancelSend() {
  dialogVisible.value = false;
}

async function sendToken() {
  dialogVisible.value = false;
  if (titem && sendCB) {
    titem.gasPrice = inputGasPrice.value;
    titem.gasLimit = inputGasLimit.value;
    if (await sendCB()) {
      Message({
        message: '发送成功!',
        type: 'success',
      });
    }
  } else {
    Message({
      message: '警告：发送失败，没有设置回调函数!',
      type: 'warning',
    });
  }
}
</script>

<!-- <div v-if="scope.row.isSendToken"> -->

<!--   <el-button -->
<!--     type="primary" -->
<!--     @click="sendToken(scope.row)" -->
<!--     :loading="scope.row.isSending" -->
<!--   > -->
<!--     {{ scope.row.isSending ? '正在发送' : '确定' }}</el-button -->
<!--   > -->
<!--   <el-button -->
<!--     type="info" -->
<!--     @click="cancelSendToken(scope.row)" -->
<!--     :disabled="scope.row.isSending" -->
<!--     >取消</el-button -->
<!--   > -->
<!-- </div> -->

<!-- async function sendToken(row) { -->
<!--   let data = tableData.value; -->
<!--   let item = null; -->
<!--   for (let i = 0; i < data.length; i++) { -->
<!--     if (data[i].tokenName === row.tokenName) { -->
<!--       item = data[i]; -->
<!--       break; -->
<!--     } -->
<!--   } -->

<!--   if (!item) return; -->
<!--   _showSendDialog(item); -->
<!-- } -->

<!-- function cancelSendToken(row) { -->
<!--   let data = tableData.value; -->
<!--   for (let i = 0; i < data.length; i++) { -->
<!--     if (data[i].tokenName === row.tokenName) { -->
<!--       return; -->
<!--     } -->
<!--   } -->
<!-- } -->

<!-- const recvAddr = inputRecvAddr.value; -->
<!-- const sendAmount = inputSendAmount.value; -->

<!-- if ( -->
<!--   !isValidEthAddr(recvAddr) || -->
<!--   isNaN(Number(sendAmount)) || -->
<!--   Number(sendAmount) <= 0 -->
<!-- ) { -->
<!--   Message({ -->
<!--     message: '警告：交易数据非法，请检查!', -->
<!--     type: 'warning', -->
<!--   }); -->
<!--   return; -->
<!-- } -->
