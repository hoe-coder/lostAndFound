import { getAccentColors } from '../theme/colors';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

const options = [
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
  { value: 'all', label: 'All' },
] as const;

export type ItemStatus = (typeof options)[number]['value'];

type ItemStatusFilterProps = {
  value: ItemStatus;
  counts: Record<ItemStatus, number>;
  onChange: (value: ItemStatus) => void;
};

export function ItemStatusFilter({ value, counts, onChange }: ItemStatusFilterProps) {
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Item status"
      style={[styles.track, { backgroundColor: dark ? '#202020' : '#E2E8F0' }]}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const count = counts[option.value];

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label + ', ' + count + (count === 1 ? ' item' : ' items')}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: accent },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? onAccent : dark ? '#C4C4C4' : '#334155' },
                selected && styles.selectedLabel,
              ]}
            >
              {option.label}{' '}
              <Text style={{ color: selected ? onAccent : dark ? '#A3A3A3' : '#475569' }}>
                {count}
              </Text>
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 2,
    borderRadius: 26,
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    textAlign: 'center',
    fontSize: 15,
  },
  selectedLabel: {
    fontWeight: '700',
  },
});
