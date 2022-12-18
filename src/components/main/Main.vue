<script setup>
import About from './About.vue';
import EthWallet from './eth/wallet/Wallet.vue';
import EthAddrGen from './eth/AddrGen.vue';
import EthAddrBalance from './eth/AddrBalance.vue';
import EthTool from './eth/tool/Tool.vue';
import EthSetting from './setting/eth/Eth.vue';
import EthHistoryTransaction from './eth/HistoryTransaction.vue';
import { navmenu } from '../../js/store.js';
</script>

<template>
  <div
    style="background-color: white; height: 100%; width: 100%; overflow: hidden"
  >
    <EthWallet v-show="navmenu.ethWallet" />
    <EthAddrGen v-show="navmenu.ethAddrGen" />
    <EthAddrBalance v-show="navmenu.ethAddrBalance" />
    <EthSetting v-show="navmenu.ethSetting" />
    <EthHistoryTransaction v-show="navmenu.ethHistoryTransaction" />
    <EthTool v-show="navmenu.ethTool" />
    <About v-show="navmenu.about" />
  </div>
</template>
