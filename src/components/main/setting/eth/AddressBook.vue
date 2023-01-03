<template>
  <div style="height: 100%; display: flex">
    <el-card style="width: 800px" :body-style="{ padding: '8px' }">
      <template v-slot:header>
        <span>Ethereum 地址簿</span>
      </template>

      <div style="margin-bottom: 10px; display: flex">
        <el-input
          v-model="inputName"
          placeholder="请输入名称"
          style="display: inline-block; margin-right: 10px; width: 250px;"
        />

        <el-input
          v-model="inputAddr"
          placeholder="请输入地址"
          style="display: inline-block"
        />

        <el-button
          type="primary"
          style="margin: 0 4px 0 10px"
          @click="addAddr"
          >添加</el-button
        >
      </div>

      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="name" label="名称" width="250">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="450">
        </el-table-column>
        <el-table-column align="right">
          <template v-slot="scope">
            <el-button type="danger" @click="deleteAddress(scope.row)"
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
import { ref} from 'vue';
import { Message } from 'element3';
import { ethAddressBookTableData } from '../../../../js/store.js';
import { addressBookTable } from '../../../../js/db.js';
import { isValidEthAddr } from '../../../../js/utils.js';

const tableData = ethAddressBookTableData;
const inputName = ref('');
const inputAddr = ref('');

async function addAddr() {
  if (inputName.value.length <= 0 || inputAddr.value.length <= 0) {
    Message({
      message: '警告: 请输入名称和地址!',
      type: 'warning',
    });
    return;
  }

  if (!isValidEthAddr(inputAddr.value)) {
    Message({
      message: '警告: 地址格式非法!',
      type: 'warning',
    });
    return;
  }

  for (let i = 0; i < tableData.length; i++) {
    if (
      inputName.value === tableData[i].name ||
      inputAddr.value === tableData[i].address
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
    address: inputAddr.value,
    chain: 'Ethereum'
  };
  tableData.push(item);

  await addressBookTable.insert(item);
  inputName.value = '';
  inputAddr.value = '';

  Message({
    message: '添加成功!',
    type: 'success',
  });
}

async function deleteAddress(item) {
  for (let i = 0; i < tableData.length; i++) {
    if (item.name === tableData[i].name) {
      tableData.splice(i, 1);
      await addressBookTable.delete(item);
      return;
    }
  }
}
</script>
