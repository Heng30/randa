<script setup>
import Homepage from './Homepage.vue';
import Orderpage from './Orderpage.vue';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  selectedMenu: String,
});

const selectedMenu = ref('homepage');

watchEffect(() => {
  selectedMenu.value = props.selectedMenu;
});

</script>
<template>
  <div style="background-color: white; height: 100%; width: 100%">
    <Homepage v-show="selectedMenu == 'homepage'"/>
    <Orderpage v-show="selectedMenu == 'orderpage'"/>
  </div>
</template>
