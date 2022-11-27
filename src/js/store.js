import { reactive } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { getName, getVersion } from '@tauri-apps/api/app';
import { rlog } from '../js/utils.js';
import { initDB } from './db.js';

export let APP_DATA_DIR = '';
export let APP_CONFIG_DIR = '';
export let APP_VERSION = '';
export let APP_NAME = '';

export const initApp = async function () {
  APP_CONFIG_DIR = await invoke('config_dir');
  APP_DATA_DIR = await invoke('data_dir');
  APP_NAME = await getName();
  APP_VERSION = await getVersion();

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
