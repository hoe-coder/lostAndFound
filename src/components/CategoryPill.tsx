import { getAccentColors } from '../theme/colors';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

type CategoryPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function CategoryPill({ label, selected, onPress }: CategoryPillProps) {
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: selected ? accent : dark ? '#1E293B' : '#FFFFFF',
          borderColor: selected ? accent : dark ? '#475569' : '#CBD5E1',
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Text style={{ color: selected ? onAccent : dark ? '#FFFFFF' : '#0F172A' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
