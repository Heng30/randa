import { createApp } from 'vue';
import './style.css';
import 'element3/lib/theme-chalk/index.css';
import Element3 from 'element3';
import App from './App.vue';
import { initApp } from './js/store.js';

setTimeout(async () => {
  await initApp();

  createApp(App).use(Element3).mount('#app');
}, 10);
