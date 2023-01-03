<template>
  <div style="height: 100%; display: flex">
    <el-card style="width: 800px" :body-style="{ padding: '8px' }">
      <template v-slot:header>
        <span>Ethereum API Key 配置</span>
      </template>

      <div style="margin-bottom: 10px; display: flex">
        <el-select
          v-model="apiKeyProvider"
          placeholder="请选择API供应商"
          style="margin-right: 10px"
        >
          <el-option
            v-for="item in apiKeyProviderOpt"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>

        <el-input
          v-model="inputAPIKey"
          placeholder="请输入API Key"
          style="display: inline-block"
        />

        <el-button
          type="primary"
          style="margin: 0 4px 0 10px"
          @click="addProvider"
          >添加</el-button
        >
      </div>

      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="name" label="供应商" width="160">
        </el-table-column>
        <el-table-column prop="apikey" label="API Key" width="540">
        </el-table-column>
        <el-table-column align="right">
          <template v-slot="scope">
            <el-button type="danger" @click="deleteProvider(scope.row)"
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
import { ref, onMounted, reactive } from 'vue';
import { Message } from 'element3';
import { ethProviderAPIKey } from '../../../../js/store.js';
import { ethProviderAPIKeyTable } from '../../../../js/db.js';

const tableData = reactive([]);
const inputAPIKey = ref('');
const apiKeyProvider = ref('etherscan');
const apiKeyProviderOpt = ref([]);

onMounted(async () => {
  for (let key in ethProviderAPIKey) {
    apiKeyProviderOpt.value.push(key);
    if (ethProviderAPIKey[key]) {
      tableData.push({
        name: key,
        apikey: ethProviderAPIKey[key],
      });
    }
  }
});

async function addProvider() {
  if (inputAPIKey.value.length <= 0 || apiKeyProvider.value.length <= 0) {
    Message({
      message: '警告: 请选择API供应商和输入API Key!',
      type: 'warning',
    });
    return;
  }

  for (let i = 0; i < tableData.length; i++) {
    if (
      apiKeyProvider.value === tableData[i].name ||
      inputAPIKey.value === tableData[i].apikey
    ) {
      Message({
        message: '警告: 请勿重复添加!',
        type: 'warning',
      });
      return;
    }
  }

  const item = {
    name: apiKeyProvider.value,
    apikey: inputAPIKey.value,
  };
  tableData.push(item);

  await ethProviderAPIKeyTable.insert(item);
  ethProviderAPIKey[apiKeyProvider.value] = inputAPIKey.value;
  inputAPIKey.value = '';

  Message({
    message: '添加成功!',
    type: 'success',
  });
}

async function deleteProvider(item) {
  for (let i = 0; i < tableData.length; i++) {
    if (item.name === tableData[i].name) {
      tableData.splice(i, 1);
      await ethProviderAPIKeyTable.delete(item);
      ethProviderAPIKey[item.name] = null;
      return;
    }
  }
}
</script>
