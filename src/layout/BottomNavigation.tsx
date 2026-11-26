import Ionicons from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAccentColors } from '../theme/colors';

const entries = [
  { name: 'index', label: 'Home', accessibilityLabel: 'Home feed', icon: 'home-outline', activeIcon: 'home' },
  { name: 'my-reports', label: 'My Reports', accessibilityLabel: 'My Reports', icon: 'clipboard-outline', activeIcon: 'clipboard' },
  { name: 'create', label: 'Add report' },
  { name: 'inbox', label: 'Inbox', accessibilityLabel: 'Inbox', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
  { name: 'profile', label: 'Profile', accessibilityLabel: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export function BottomNavigation({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);
  const inactive = dark ? '#CBD5E1' : '#475569';

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[styles.bar, {
        backgroundColor: dark ? '#0F172A' : '#FFFFFF',
        borderTopColor: dark ? '#334155' : '#E2E8F0',
      }]}
    >
      <View style={styles.row}>
        {entries.map((entry) => {
          if (entry.name === 'create') {
            return (
              <View key={entry.name} style={styles.addSlot}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={entry.label}
                  onPress={() => router.push('/items/create')}
                  style={({ pressed }) => [styles.addButton, { backgroundColor: accent }, pressed && styles.pressed]}
                >
                  <Ionicons name="add" color={onAccent} size={29} accessible={false} />
                </Pressable>
              </View>
            );
          }

          const route = state.routes.find((candidate) => candidate.name === entry.name);
          if (!route) return null;

          const active = state.routes[state.index].key === route.key;
          const color = active ? accent : inactive;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={entry.accessibilityLabel}
              accessibilityState={{ selected: active }}
              onPress={() => {
                const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!active && !event.defaultPrevented) {
                  navigateToTab(route.key);
                }
              }}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <Ionicons name={active ? entry.activeIcon : entry.icon} size={22} color={color} accessible={false} />
              <Text style={[styles.label, { color }, active && styles.activeLabel]}>{entry.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: { borderTopWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 },
  tab: { flex: 1, minHeight: 54, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, gap: 4 },
  label: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  activeLabel: { fontWeight: '700' },
  addSlot: { flex: 1, alignItems: 'center' },
  addButton: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
});
