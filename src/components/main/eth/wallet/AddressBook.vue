<template>
  <el-popover placement="right" width="700" trigger="hover">
      <el-table :data="tableData" @row-click="rowClick">
        <el-table-column
          width="250"
          property="name"
          label="名称"
        ></el-table-column>
        <el-table-column
          width="450"
          property="address"
          label="地址"
        ></el-table-column>
      </el-table>
    <template #reference>
      <i class="el-input__icon el-icon-notebook-2"></i>
    </template>
  </el-popover>
</template>

<script setup>
import { Message } from 'element3';
import { ethAddressBookTableData } from '../../../../js/store.js';

const emit = defineEmits(['finished']);
const tableData = ethAddressBookTableData;

function rowClick(row) {
  emit('finished', row.address);
  Message({
    message: `选择地址: ${row.address} 成功!`,
    type: 'success',
  });
}
</script>
