<script setup>
import { ref } from "vue";

const name = ref("jack");

</script>

<template>
  <div style="background-color: gray; height: 30px; text-align: center; line-height: 30px; ">
    <span> Hello, {{ name }} </span>
  </div>
</template>
