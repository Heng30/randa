<template>
  <div
    style="
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow-x: scroll;
    "
  >
    <Network />
    <APIKey />
    <AddressBook />
  </div>
</template>

<script setup>
import Network from './Network.vue';
import APIKey from './APIKey.vue';
import AddressBook from './AddressBook.vue';
</script>
