import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { mmkvStorage } from './mmkvStorage';
import { settingsReducer } from './settingsSlice';

const rootReducer = combineReducers({
  settings: settingsReducer,
});

// Persist only settings — the whitelist makes that explicit.
const persistedReducer = persistReducer(
  { key: 'root', version: 1, storage: mmkvStorage, whitelist: ['settings'] },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable actions — ignore exactly those
      // so the serializability check stays on for everything else.
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
