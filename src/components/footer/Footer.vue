<template>
  <div
    style="
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      border-top: 2px groove lightblue;
    "
  >
    <span class="lable-item">Eth油费: {{ ethGasPrice }}Gwei</span>
  </div>
</template>

<style scoped>
.lable-item {
  margin: 0 5px;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { rlog, ethProvider } from '../../js/utils.js';
import { ethers } from 'ethers';

const ethGasPrice = ref('N/A');
let interval = null;

onMounted(async () => {
  async function _getGasPrice() {
    let gasPrice = '0';
    try {
      const provider = ethProvider();
      gasPrice = await provider.getGasPrice();
    } catch (e) {
      rlog(e.toString());
      return;
    }

    ethGasPrice.value = Number(
      ethers.utils.formatUnits(gasPrice.toString(), 'gwei')
    ).toFixed(0);
  }

  await _getGasPrice();
  interval = setInterval(async () => {
    await _getGasPrice();
  }, 1000 * 60);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
