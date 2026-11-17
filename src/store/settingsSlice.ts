import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemePreference = 'system' | 'light' | 'dark';

export type SettingsState = {
  /** ISO 4217 — the currency the detail screen converts amounts into. */
  baseCurrency: string;
  /** 'system' follows the OS; 'light'/'dark' force the scheme. */
  themePreference: ThemePreference;
};

const initialState: SettingsState = {
  baseCurrency: 'EUR',
  themePreference: 'system',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Immer: we write a "mutation" and get a new immutable state back.
    setBaseCurrency(state, action: PayloadAction<string>) {
      state.baseCurrency = action.payload;
    },
    setThemePreference(state, action: PayloadAction<ThemePreference>) {
      state.themePreference = action.payload;
    },
  },
});

export const { setBaseCurrency, setThemePreference } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
