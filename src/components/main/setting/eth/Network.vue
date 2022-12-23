<template>
  <div style="height: 100%; display: flex">
    <el-card style="width: 800px" :body-style="{ padding: '8px' }">
      <template v-slot:header>
        <span>Ethereum 网络配置</span>
      </template>

      <div style="margin-bottom: 10px; display: flex">
        <el-input
          v-model="inputName"
          placeholder="请输入名称"
          style="display: inline-block; width: 250px; margin-right: 10px"
        />
        <el-input
          v-model="inputNetwork"
          placeholder="请输入网络地址"
          style="display: inline-block"
        />

        <el-button
          type="primary"
          style="margin: 0 4px 0 10px"
          @click="addNetwork"
          >添加</el-button
        >
      </div>

      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="name" label="名称" width="250">
        </el-table-column>
        <el-table-column prop="network" label="地址" width="450">
        </el-table-column>
        <el-table-column align="right">
          <template v-slot="scope">
            <el-button
              type="danger"
              @click="deleteNetwork(scope.row)"
              :disabled="scope.row.disabled"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  height: calc(100% - 20px);
  margin: 10px 10px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { Message } from 'element3';
import { ethNetwork } from '../../../../js/store.js';
import { rlog } from '../../../../js/utils.js';
import { ethNetworkTable, ethWalletInfoTable } from '../../../../js/db.js';

const tableData = ethNetwork;
const inputName = ref('');
const inputNetwork = ref('');

onMounted(async () => {
  const rows = await ethNetworkTable.load();
  rows.forEach((item) => {
    tableData.push({
      name: item.name,
      network: item.network,
      disabled: !!item.disabled,
    });
  });
});

async function addNetwork() {
  if (inputName.value.length <= 0 || inputNetwork.value.length <= 0) {
    Message({
      message: '警告: 输入名称或网络非法!',
      type: 'warning',
    });
    return;
  }

  for (let i = 0; i < tableData.length; i++) {
    if (
      inputName.value === tableData[i].name ||
      inputNetwork.value === tableData[i].network
    ) {
      Message({
        message: '警告: 请勿重复添加!',
        type: 'warning',
      });
      return;
    }
  }

  const item = {
    name: inputName.value,
    network: inputNetwork.value,
    disabled: false,
  };
  tableData.push(item);

  try {
    await ethNetworkTable.insert(item);
    await ethWalletInfoTable.insert({
      tokenName: 'ETH',
      tokenAddr: 'N/A',
      amount: 'N/A',
      network: item.network,
      disabled: true,
    });
  } catch (e) {
    rlog(e.toString());
    return;
  }

  inputName.value = '';
  inputNetwork.value = '';

  Message({
    message: '添加成功!',
    type: 'success',
  });
}

async function deleteNetwork(item) {
  for (let i = 0; i < tableData.length; i++) {
    if (item.network === tableData[i].network) {
      tableData.splice(i, 1);
      try {
        await ethNetworkTable.delete(item);
        await ethWalletInfoTable.delete_network(item.network);
      } catch (e) {
        rlog(e.toString());
      }
    }
  }
}
</script>
