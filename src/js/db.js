import SQLite from 'tauri-plugin-sqlite-api';
import { APP_DATA_DIR, ethProviderAPIKey, ethNetwork } from './store.js';
import Web3 from 'web3';

let DB = null;

export const initDB = async function () {
  await uninitDB();

  const DB_PATH = APP_DATA_DIR + '/randa.db';
  DB = await SQLite.open(DB_PATH);
  await DB.execute(`CREATE TABLE IF NOT EXISTS eth_addr_balance (address TEXT UNIQUE NOT NULL);
`);

  await DB.execute(`CREATE TABLE IF NOT EXISTS eth_network (name TEXT UNIQUE NOT NULL, network TEXT UNIQUE NOT NULL, disabled INT NOT NULL);
`);

  await DB.execute(`CREATE TABLE IF NOT EXISTS eth_provider_apikey (name TEXT UNIQUE NOT NULL, apikey TEXT UNIQUE NOT NULL);
`);

  await DB.execute(`CREATE TABLE IF NOT EXISTS wallet_info (name TEXT UNIQUE NOT NULL, password TEXT NOT NULL, mnemonic TEXT NOT NULL, privateKey TEXT NOT NULL, publicKey TEXT NOT NULL, address TEXT NOT NULL);
`);

  await DB.execute(`CREATE TABLE IF NOT EXISTS eth_wallet_info (name TEXT NOT NULL, tokenAddr TEXT NOT NULL, amount TEXT NOT NULL, network TEXT NOT NULL, disabled INT NOT NULL);
`);

  initEthWalletInfoTable();
  await initEthProviderAPIKey();
};

export const uninitDB = async function () {
  if (DB) await DB.close();
};

export const ethAddrBalanceTable = {
  load: async function () {
    let rows = await DB.select('SELECT * FROM eth_addr_balance');
    return rows;
  },
  insert: async function (addrs) {
    if (!Array.isArray(addrs)) return;
    addrs.forEach(async (addr) => {
      if (!Web3.utils.isAddress(addr)) return;
      await DB.execute(`INSERT INTO eth_addr_balance VALUES ($1)`, [addr]);
    });
  },
  delete: async function (addrs) {
    if (!Array.isArray(addrs)) return;
    addrs.forEach(async (addr) => {
      if (!Web3.utils.isAddress(addr)) return;
      await DB.execute(`DELETE FROM eth_addr_balance WHERE address=($1)`, [
        addr,
      ]);
    });
  },
};

export const ethNetworkTable = {
  load: async function () {
    let rows = await DB.select('SELECT * FROM eth_network');
    return rows;
  },
  insert: async function (item) {
    await DB.execute(`INSERT INTO eth_network VALUES ($1, $2, $3)`, [
      item.name,
      item.network,
      item.disabled ? 1 : 0,
    ]);
  },
  delete: async function (item) {
    await DB.execute(`DELETE FROM eth_network WHERE network=($1)`, [
      item.network,
    ]);
  },
};

export const ethProviderAPIKeyTable = {
  load: async function () {
    let rows = await DB.select('SELECT * FROM eth_provider_apikey');
    return rows;
  },
  insert: async function (item) {
    await DB.execute(`INSERT INTO eth_provider_apikey VALUES ($1, $2)`, [
      item.name,
      item.apikey,
    ]);
  },
  delete: async function (item) {
    await DB.execute(`DELETE FROM eth_provider_apikey WHERE name=($1)`, [
      item.name,
    ]);
  },
};

export const walletInfoTable = {
  load: async function (name) {
    let rows = await DB.select(`SELECT * FROM wallet_info WHERE name=($1)`, [
      name,
    ]);
    return rows;
  },
  insert: async function (item) {
    await DB.execute(
      `INSERT INTO wallet_info VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        item.name,
        item.password,
        item.mnemonic,
        item.privateKey,
        item.publicKey,
        item.address,
      ]
    );
  },
  delete: async function (name) {
    await DB.execute(`DELETE FROM wallet_info WHERE name=($1)`, [name]);
  },
};

export const ethWalletInfoTable = {
  load: async function () {
    let rows = await DB.select('SELECT * FROM eth_wallet_info');
    return rows;
  },

  insert: async function (item) {
    await DB.execute(
      `INSERT INTO eth_wallet_info VALUES ($1, $2, $3, $4, $5)`,
      [item.tokenName, item.tokenAddr, item.amount, item.network, item.disabled]
    );
  },
  delete: async function (item) {
    await DB.execute(
      `DELETE FROM eth_wallet_info WHERE name=($1) AND network=($2)`,
      [item.tokenName, item.network]
    );
  },
  update: async function (item) {
    await DB.execute(
      `UPDATE eth_wallet_info SET amount=($1) WHERE name=($2) AND network=($3)`,
      [item.amount, item.tokenName, item.network]
    );
  },
  delete_network: async function (network) {
    await DB.execute(`DELETE FROM eth_wallet_info WHERE network=($1)`, [
      network,
    ]);
  },
};

const initEthProviderAPIKey = async function () {
  const rows = await ethProviderAPIKeyTable.load();
  rows.forEach((item) => {
    if (ethProviderAPIKey.hasOwnProperty(item.name)) {
      ethProviderAPIKey[item.name] = item.apikey;
    }
  });
};

const initEthWalletInfoTable = async function () {
  const row = await ethWalletInfoTable.load();
  ethNetwork.forEach(async (item) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i].network === item.network && row[i].tokenAddr === 'N/A')
        return;
    }

    try {
      await ethWalletInfoTable.insert({
        tokenName: 'ETH',
        tokenAddr: 'N/A',
        amount: 'N/A',
        network: item.network,
        disabled: true,
      });
    } catch (e) {
      console.log(e);
    }
  });
};
