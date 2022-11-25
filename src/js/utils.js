import { invoke } from '@tauri-apps/api/tauri';
import * as Comlink from 'comlink';

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
