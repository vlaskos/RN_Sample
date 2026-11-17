import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBaseCurrency, setThemePreference, type ThemePreference } from '@/store/settingsSlice';
import { Pressable, Text, View } from 'react-native';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH'];
const THEMES: ThemePreference[] = ['system', 'light', 'dark'];

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const baseCurrency = useAppSelector((s) => s.settings.baseCurrency);
  const themePreference = useAppSelector((s) => s.settings.themePreference);

  return (
    <View style={{ flex: 1, padding: 16, gap: 28 }}>
      <View style={{ gap: 10 }}>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>Base currency</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CURRENCIES.map((c) => (
            <Chip key={c} label={c} active={c === baseCurrency} onPress={() => dispatch(setBaseCurrency(c))} />
          ))}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>Theme</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {THEMES.map((t) => (
            <Chip key={t} label={t} active={t === themePreference} onPress={() => dispatch(setThemePreference(t))} />
          ))}
        </View>
      </View>

      <Text style={{ color: '#888', fontSize: 13 }}>
        Both values persist to MMKV via redux-persist. Changing the theme re-renders
        the app immediately (ThemedNavigation reads the state).
      </Text>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? '#208AEF' : '#bbb',
        backgroundColor: active ? '#208AEF' : 'transparent',
      }}
    >
      <Text style={{ color: active ? 'white' : undefined, fontWeight: active ? '600' : '400' }}>{label}</Text>
    </Pressable>
  );
}
