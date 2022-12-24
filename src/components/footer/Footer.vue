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
    <span class="lable-item"
      >ETH价格(油价): ${{ ethPrice }}({{ ethGasPrice }}Gwei)</span
    >
  </div>
</template>

<style scoped>
.lable-item {
  margin: 0 5px;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { rlog, ethProvider, http_client_get } from '../../js/utils.js';
import { chainGasPrice, tokenPrice } from '../../js/store.js';
import { ethers } from 'ethers';

const ethGasPrice = ref('N/A');
const ethPrice = ref('N/A');
let interval = null;

onMounted(async () => {
  _getGasPrice();
  _getEthPrice();
  interval = setInterval(async () => {
    _getGasPrice();
    _getEthPrice();
  }, 1000 * 60);
});

async function _getEthPrice() {
  const url = 'https://api.alternative.me/v1/ticker/ethereum/';
  try {
    const response = await http_client_get(url);
    if (response.length <= 0) return;

    const data = JSON.parse(response);
    ethPrice.value = Number(data[0].price_usd).toFixed(0);
    tokenPrice.eth = ethPrice.value;
  } catch (e) {
    rlog(toString());
  }
}

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

onUnmounted(() => {
  clearInterval(interval);
});
</script>
