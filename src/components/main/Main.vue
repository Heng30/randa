<script setup>
import About from './About.vue';
import EthAddrGen from './eth/AddrGen.vue';
import EthAddrBalance from './eth/AddrBalance.vue';
import EthSetting from './setting/eth/Eth.vue';
import { navmenu } from '../../js/store.js';
</script>

<template>
  <div style="background-color: white; height: 100%; width: 100%; overflow: hidden;">
    <EthAddrGen v-show="navmenu.ethAddrGen" />
    <EthAddrBalance v-show="navmenu.ethAddrBalance" />
    <EthSetting v-show="navmenu.ethSetting" />
    <About v-show="navmenu.about" />
  </div>
</template>
