<template>
  <el-dialog
    title="初始化钱包"
    :visible.sync="dialogVisible"
    width="40%"
    v-model:visible="dialogVisible"
  >
    <template v-slot:default>
      <div>
        <div style="margin-bottom: 10px">
          <el-radio v-model="radio" label="mnemonic">组记词</el-radio>
          <el-radio v-model="radio" label="privateKey">私钥</el-radio>
        </div>

        <el-input
          type="textarea"
          rows="4"
          :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
      </div>
    </template>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="cancelGenWallet">取 消</el-button>
        <el-button type="primary" @click="genWallet">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { ethers } from 'ethers';
import { Message } from 'element3';
import { walletInfoTable } from '../../../../js/db.js';

const emit = defineEmits(['finished']);

let password = '';
const dialogVisible = ref(false);
const radio = ref('mnemonic');
const textarea = ref('');

defineExpose({
  setPassword: (pwd) => {
    password = pwd;
  },
  show: () => {
    dialogVisible.value = true;
  },
});

async function genWallet() {
  console.log(password);

  if (textarea.value.length <= 0) {
    Message({
      message: '组记词或密钥不能为空!',
      type: 'warning',
    });
    return;
  }

  let wallet = null;
  if (radio.value === 'mnemonic') {
    wallet = ethers.Wallet.fromMnemonic(textarea.value);
  } else {
    wallet = new ethers.Wallet(textarea.value);
  }

  if (!wallet) {
    Message({
      message: '组记词或密钥格式不对!',
      type: 'warning',
    });
    return;
  }

  let encMnemonic = '';
  let encPrivateKey = '';
  if (radio.value === 'mnemonic') {
    // TODO
    encMnemonic = '';
    encPrivateKey = '';
  } else {
    encPrivateKey = '';
  }

  let item = {
    name: 'Ethereum',
    password: ethers.utils.sha256(password),
    mnemonic: encMnemonic,
    privateKey: encPrivateKey,
    encryptWallet: wallet.encrypt(password),
    publicKey: wallet.publicKey,
    address: wallet.address,
  };
  await walletInfoTable.insert(item);
  emit('finished', item.address);

  console.log(item);

  textarea.value = '';
  dialogVisible.value = false;
  Message({
    message: '导入钱包成功!',
    type: 'success',
  });
}

function cancelGenWallet() {
  textarea.value = '';
  dialogVisible.value = false;
}
</script>
