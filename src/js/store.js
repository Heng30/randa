import { reactive } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { rlog } from '../js/utils.js';
import { initDB } from './db.js';

export let APP_DATA_DIR = '';
export let APP_CONFIG_DIR = '';
export const APP_VERSION = "v0.0.1";

export const initApp = async function () {
  APP_CONFIG_DIR = await invoke('config_dir');
  APP_DATA_DIR = await invoke('data_dir');
  await initDB();
  rlog('init App successfully!');
};

export const navmenu = reactive({
  selectedPage: 'ethAddrGen',
  ethAddrGen: true,
  ethAddrBalance: false,
  ethSetting: false,
  about: false,
});

export let ethNetwork = reactive([
  {
    name: 'Ethereum 主网',
    network: 'homestead',
    disabled: true,
  },
  {
    name: 'Goerli 测试网',
    network: 'goerli',
    disabled: true,
  },
  {
    name: 'Ropsten 测试网',
    network: 'ropsten',
    disabled: true,
  },
]);
