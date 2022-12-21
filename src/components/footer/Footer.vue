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
    <span class="lable-item">以太坊油价: {{ ethGasPrice }}Gwei</span>
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
import { chainGasPrice } from '../../js/store.js';
import { ethers } from 'ethers';

const ethGasPrice = ref('N/A');
let interval = null;

onMounted(async () => {
  async function _getGasPrice() {
    try {
      const provider = ethProvider();
      const gasPrice = await provider.getGasPrice();
      ethGasPrice.value = Number(
        ethers.utils.formatUnits(gasPrice.toString(), 'gwei')
      ).toFixed(0);
      chainGasPrice.eth = ethGasPrice.value;
    } catch (e) {
      rlog(e.toString());
    }
  }

  _getGasPrice();
  interval = setInterval(async () => {
    await _getGasPrice();
  }, 1000 * 60);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
