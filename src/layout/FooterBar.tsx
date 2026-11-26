import type { ReactNode } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FooterBarProps = {
  heading: string;
  children: ReactNode;
};

export function FooterBar({ heading, children }: FooterBarProps) {
  const dark = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[
        styles.footer,
        {
          backgroundColor: dark ? '#0F172A' : '#FFFFFF',
          borderTopColor: dark ? '#334155' : '#E2E8F0',
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.heading, { color: dark ? '#F1F5F9' : '#0F172A' }]}
      >
        {heading}
      </Text>

      <View style={styles.row}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
  },
  heading: {
    paddingTop: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});
