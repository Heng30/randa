import { reactive } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { getName, getVersion } from '@tauri-apps/api/app';
import { appWindow } from '@tauri-apps/api/window';
import { rlog } from '../js/utils.js';
import { initDB, uninitDB } from './db.js';
import { initGlobalShortcut, uninitGlobalShortcut } from './gs.js';

export let APP_DATA_DIR = '';
export let APP_CONFIG_DIR = '';
export let APP_VERSION = '';
export let APP_NAME = '';

export const initApp = async function () {
  APP_CONFIG_DIR = await invoke('config_dir');
  APP_DATA_DIR = await invoke('data_dir');
  APP_NAME = await getName();
  APP_VERSION = await getVersion();

  appWindow.onCloseRequested(async (_event) => {
    await uninitApp();
  });

  await initGlobalShortcut();
  await initDB();
  rlog('init App successfully!');
};

export const uninitApp = async function () {
  await uninitGlobalShortcut();
  await uninitDB();
  rlog('uninit App successfully!');
};

export const navmenu = reactive({
  selectedPage: 'ethWallet',
  ethWallet: true,
  ethAddrGen: false,
  ethAddrBalance: false,
  ethSetting: false,
  ethTool: false,
  ethHistoryTransaction: false,
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
]);

export let ethProviderAPIKey = reactive({
  etherscan: null,
  infura: null,
  alchemy: null,
  pocket: null,
  ankr: null,
});

export let ethWalletInfoTableData = reactive([]);

export let chainGasPrice = reactive({
    eth: null,
})

export let tokenPrice = reactive({
    eth: null,
})
