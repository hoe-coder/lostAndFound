import { StyleSheet, View, useColorScheme } from 'react-native';
import { BrandLogo } from '../components/BrandLogo';

export function AppFooter() {
  const dark = useColorScheme() === 'dark';

  return (
    <View
      style={[styles.footer, {
        backgroundColor: dark ? '#0F172A' : '#FFFFFF',
        borderTopColor: dark ? '#334155' : '#E2E8F0',
      }]}
    >
      <BrandLogo label="Campus Lost & Found" />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
});
