import { createMMKV } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

/**
 * redux-persist storage adapter on top of MMKV (v4, Nitro).
 * createMMKV() is a factory (no `new MMKV()`); removal is `.remove()`.
 * MMKV is synchronous while redux-persist expects an async Storage → wrap in Promise.resolve.
 */
const mmkv = createMMKV({ id: 'receipts-lab-settings' });

export const mmkvStorage: Storage = {
  setItem: (key, value) => {
    mmkv.set(key, value);
    return Promise.resolve();
  },
  getItem: (key) => Promise.resolve(mmkv.getString(key) ?? null),
  removeItem: (key) => {
    mmkv.remove(key);
    return Promise.resolve();
  },
};
