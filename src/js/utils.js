import { invoke } from '@tauri-apps/api/tauri';
import * as Comlink from 'comlink';
import { ethProviderAPIKey } from './store';
import { ethers } from 'ethers';
import Web3 from 'web3';

export const rlog = async function (text) {
  if (typeof text !== 'string') return;
  await invoke('rlog', {
    text: text,
  });
};

export const json2obj = async function (json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn(e);
    await invoke('rlog', {
      text: 'parse json error: ' + json,
    });

    return null;
  }
};

export const webWorker = async function (workerFile, syncFunc, args) {
  if (Worker) {
    const cl = Comlink.wrap(new Worker(workerFile));
    const inst = await new cl();
    if (inst.run) await inst.run(args);

    return inst.res;
  } else {
    if (syncFunc) {
      return syncFunc(args);
    }
  }
};

export const arrayBuffer2UTF8 = function (buffer) {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
};

export const arrayIndexOf = function (array, matchFunc) {
  if (!Array.isArray(array) || !matchFunc) return;
  for (let i = 0; i < array.length; i++) {
    if (matchFunc(array[i])) return i;
  }
  return -1;
};

export const ethProvider = function (network) {
  if (!network) {
    network = 'homestead';
  }
  let provider = ethers.getDefaultProvider(network);
  if (isEthPubNet(network)) {
    for (let key in ethProviderAPIKey) {
      if (ethProviderAPIKey[key]) {
        provider = ethers.getDefaultProvider(network, ethProviderAPIKey);
        break;
      }
    }
  }
  return provider;
};

export const isEthPubNet = function (network) {
  return network === 'homestead' || network === 'goerli';
};

export const isValidENS = function(value) {
    return String(value).trim().endsWith('.eth');
}

export const isValidEthAddr = function(addr) {
  return Web3.utils.isAddress(addr);
}
