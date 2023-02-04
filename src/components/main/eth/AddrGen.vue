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
      <el-select
        v-model="mneByteCnt"
        placeholder="请选择组记词长度"
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in mneCntOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-input
        placeholder="请输入地址数, 最多10个地址"
        v-model="addrCnt"
        style="width: 250px"
      >
      </el-input>

      <el-button
        :loading="isGenerating"
        type="primary"
        @click="genAddr"
        style="margin: 0 10px"
        >{{ isGenerating ? '正在生成地址' : '确定' }}
      </el-button>

      <el-divider direction="vertical"></el-divider>

      <el-button type="primary" @click="exportAddr" style="margin-left: 10px">
        导出为CSV
      </el-button>
    </div>

    <div style="flex-grow: 1; overflow-y:scroll">
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 10px"
        border
        stripe
      >
        <el-table-column prop="priKey" label="私钥" width="500">
        </el-table-column>
        <el-table-column prop="pubKey" label="公钥" width="500">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="mnemonic" label="组记词"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import { ref } from 'vue';
import { Message } from 'element3';
import { invoke } from '@tauri-apps/api/tauri';
import { json2obj } from '../../../js/utils.js';
import { open } from '@tauri-apps/api/dialog';

const addrCnt = ref(1);
const tableData = ref([]);
const isGenerating = ref(false);
const maxAddrCnt = 10;

// Chose the length of your mnemonic:
//   - 16 bytes => 12 words
//   - 20 bytes => 15 words
//   - 24 bytes => 18 words
//   - 28 bytes => 21 words
//   - 32 bytes => 24 words
const mneByteCnt = ref('16');
const mneCntOpt = ref([
  {
    value: '16',
    label: '12个组记词',
  },
  {
    value: '20',
    label: '15个组记词',
  },
  {
    value: '24',
    label: '18个组记词',
  },
  {
    value: '28',
    label: '21个组记词',
  },
  {
    value: '32',
    label: '24个组记词',
  },
]);

function genAddr() {
  if (isNaN(Number(addrCnt.value))) {
    Message({
      message: '警告: 输入生成的地址个数格式非法!',
      type: 'warning',
    });
    return;
  }

  if (!mneByteCnt.value || !addrCnt.value) {
    Message({
      message: '警告: 请选择组记词长度和输入需要生成的地址个数!',
      type: 'warning',
    });
    return;
  }

  if (Number(addrCnt.value) > maxAddrCnt) {
    Message({
      message: `警告: 一次最多只能生成${maxAddrCnt}个地址!`,
      type: 'warning',
    });
    return;
  }

  isGenerating.value = true;
  setTimeout(() => {
    let tdata = [];
    for (let i = 0; i < Number(addrCnt.value); i++) {
      const mnemonic = ethers.utils.entropyToMnemonic(
        ethers.utils.randomBytes(Number(mneByteCnt.value)),
        ethers.wordlists.en
      );
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);

      tdata.push({
        priKey: wallet.privateKey,
        pubKey: wallet.publicKey,
        address: wallet.address,
        mnemonic: mnemonic,
      });
    }

    tableData.value = tdata;
    isGenerating.value = false;

    Message({
      message: '生成地址成功!',
      type: 'success',
    });
  }, 100);
}

async function exportAddr() {
  if (tableData.value.length <= 0) {
    Message({
      message: '没有可导出的地址!',
      type: 'info',
    });
    return;
  }

  let text = 'privateKey,publicKey,address,mnemonic\n';
  tableData.value.forEach((item) => {
    text +=
      item.priKey +
      ',' +
      item.pubKey +
      ',' +
      item.address +
      ',' +
      item.mnemonic +
      '\n';
  });

  const selected = await open({
    directory: true,
    multiple: false,
  });

  if (selected) {
    let jres = await invoke('write_file', {
      filepath: selected + '/eth-addr.csv',
      text: text,
    });

    let res = await json2obj(jres);
    if (res) {
      if (res.code === 0) {
        Message({
          message: '保存成功! 文件路径: ' + res.msg,
          type: 'success',
        });
      } else {
        Message({
          message: '保存文件失败! 原因:' + res.msg,
          type: 'warning',
        });
      }
    } else {
      Message({
        message: '保存文件失败! 原因未知!',
        type: 'warning',
      });
    }
  }
}
</script>
