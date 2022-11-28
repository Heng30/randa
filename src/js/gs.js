import { appWindow } from '@tauri-apps/api/window';
import {
  register,
  unregister,
  isRegistered,
} from '@tauri-apps/api/globalShortcut';

const GS_HIDE_SHOW = 'CommandOrControl+Alt+R';

export const initGlobalShortcut = async function () {
  await uninitGlobalShortcut();
  await register(GS_HIDE_SHOW, async () => {
    if (await appWindow.isVisible()) await appWindow.hide();
    else await appWindow.show();
  });
};

export const uninitGlobalShortcut = async function () {
  if (await isRegistered(GS_HIDE_SHOW)) await unregister(GS_HIDE_SHOW);
};
