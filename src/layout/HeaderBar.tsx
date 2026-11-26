import type { ReactNode } from 'react';
import {
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HeaderBarProps = {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
};

export function HeaderBar({ title, onBack, action }: HeaderBarProps) {
  const dark = useColorScheme() === 'dark';
  const color = dark ? '#F1F5F9' : '#0F172A';

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.header,
        {
          backgroundColor: dark ? '#0F172A' : '#FFFFFF',
          borderBottomColor: dark ? '#334155' : '#E2E8F0',
          borderBottomWidth: 1,
        },
      ]}
    >
      <View style={styles.row}>
        {onBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text accessible={false} style={[styles.arrow, { color }]}>
              {I18nManager.isRTL ? '→' : '←'}
            </Text>
          </Pressable>
        )}

        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[styles.title, { color }]}
        >
          {title}
        </Text>

        {action}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  backButton: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: -8,
  },
  arrow: {
    fontSize: 24,
  },
  title: {
    flex: 1,
    paddingEnd: 8,
    fontSize: 20,
    fontWeight: '600',
  },
});
