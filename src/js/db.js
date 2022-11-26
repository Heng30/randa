import SQLite from 'tauri-plugin-sqlite-api';
import { APP_DATA_DIR } from './store.js';
import Web3 from 'web3';

let DB = null;

export const initDB = async function () {
  const DB_PATH = APP_DATA_DIR + '/randa.db';
  DB = await SQLite.open(DB_PATH);
  await DB.execute(`CREATE TABLE IF NOT EXISTS eth_addr_balance (address TEXT UNIQUE);
`);
};

export const ethAddrBalanceTable = {
  load: async function () {
    let rows = await DB.select('SELECT * FROM eth_addr_balance');
    return rows;
  },
  insert: async function (addrs) {
    if (!Array.isArray(addrs)) return;
    addrs.forEach(async (addr) => {
    if (!Web3.utils.isAddress(addr))return;
      await DB.execute(`INSERT INTO eth_addr_balance VALUES ($1)`, [addr]);
    });
  },
  delete: async function (addrs) {
    if (!Array.isArray(addrs)) return;
    addrs.forEach(async (addr) => {
      if (!Web3.utils.isAddress(addr))return;
      await DB.execute(`DELETE FrOM eth_addr_balance WHERE address=($1)`, [
        addr,
      ]);
    });
  },
};
