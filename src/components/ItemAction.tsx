import { brandAccent } from '../theme/colors';
import { Pressable, StyleSheet, Text } from 'react-native';

type ItemActionProps = {
  label: string;
  symbol: string;
  onPress: () => void;
  active?: boolean;
};

export function ItemAction({ label, symbol, onPress, active }: ItemActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={active === undefined ? undefined : { selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, active && styles.active, { opacity: pressed ? 0.75 : 1 }]}
    >
      <Text style={styles.symbol}>{symbol}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
  },
  active: { backgroundColor: brandAccent },
  symbol: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },
});
