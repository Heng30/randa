import SQLite from 'tauri-plugin-sqlite-api';
import {
  APP_DATA_DIR,
  ethProviderAPIKey,
  ethNetwork,
  ethWalletInfoTableData,
  ethAddressBookTableData,
} from './store.js';
import Web3 from 'web3';
import { rlog } from './utils.js';

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

  await DB.execute(`CREATE TABLE IF NOT EXISTS eth_wallet_info (name TEXT NOT NULL, tokenAddr TEXT NOT NULL, amount TEXT NOT NULL, network TEXT NOT NULL, status TEXT NOT NULL, disabled INT NOT NULL);
`);

  await DB.execute(`CREATE TABLE IF NOT EXISTS address_book (name TEXT NOT NULL, address TEXT NOT NULL, chain TEXT NOT NULL);
`);

  await ethProviderAPIKeyTable.init();
  await ethNetworkTable.init();
  await ethWalletInfoTable.init();
  await addressBookTable.init();
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
  init: async function () {
    const rows = await this.load();
    rows.forEach((item) => {
      ethNetwork.push({
        name: item.name,
        network: item.network,
        disabled: !!item.disabled,
      });
    });
  },
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
  init: async function () {
    const rows = await this.load();
    rows.forEach((item) => {
      if (ethProviderAPIKey.hasOwnProperty(item.name)) {
        ethProviderAPIKey[item.name] = item.apikey;
      }
    });
  },
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
  init: async function () {
    const rows = await this.load();
    ethNetwork.forEach(async (item) => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].network === item.network && rows[i].tokenAddr === 'N/A')
          return;
      }

      try {
        await this.insert({
          tokenName: 'ETH',
          tokenAddr: 'N/A',
          amount: 'N/A',
          network: item.network,
          status: 'N/A',
          disabled: true,
        });
      } catch (e) {
        rlog(e.toString());
      }
    });

    let nrows = await this.load();
    nrows.forEach((item) => {
      ethWalletInfoTableData.push({
        tokenName: item.name,
        tokenAddr: item.tokenAddr,
        amount: item.amount,
        disabled: item.disabled,
        network: item.network,
        status: item.status,
        isSending: false,
      });
    });
  },
  load: async function () {
    let rows = await DB.select('SELECT * FROM eth_wallet_info');
    return rows;
  },

  insert: async function (item) {
    await DB.execute(
      `INSERT INTO eth_wallet_info VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        item.tokenName,
        item.tokenAddr,
        item.amount,
        item.network,
        item.status,
        item.disabled,
      ]
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
      `UPDATE eth_wallet_info SET amount=($1), status=($2) WHERE name=($3) AND network=($4)`,
      [item.amount, item.status, item.tokenName, item.network]
    );
  },
  delete_network: async function (network) {
    await DB.execute(`DELETE FROM eth_wallet_info WHERE network=($1)`, [
      network,
    ]);
  },
};

export const addressBookTable = {
  init: async function () {
    const rows = await this.load();
    rows.forEach((item) => {
      if (item.chain === 'Ethereum') {
        ethAddressBookTableData.push({
          name: item.name,
          address: item.address,
          chain: item.chain,
        });
      }
    });
  },
  load: async function () {
    let rows = await DB.select('SELECT * FROM address_book');
    return rows;
  },
  insert: async function (item) {
    await DB.execute(`INSERT INTO address_book VALUES ($1, $2, $3)`, [
      item.name,
      item.address,
      item.chain,
    ]);
  },
  delete: async function (item) {
    await DB.execute(
      `DELETE FROM address_book WHERE name=($1) AND chain=($2)`,
      [item.name, item.chain]
    );
  },
};
