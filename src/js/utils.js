import { invoke } from '@tauri-apps/api/tauri';

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
