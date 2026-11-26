import { brandAccent } from '../theme/colors';
import { Appearance, ScrollView, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';
import { AppFooter } from '../layout/FooterBar';

export default function ProfilePage() {
  const dark = useColorScheme() === 'dark';
  const textColor = dark ? '#F1F5F9' : '#0F172A';

  return (
    <ScrollView>
      <View style={styles.screen}>
        <Text accessibilityRole="header" style={[styles.heading, { color: textColor }]}>
          Profile
        </Text>

        <View
          style={[
            styles.setting,
            {
              backgroundColor: dark ? '#1E293B' : '#FFFFFF',
              borderColor: dark ? '#475569' : '#CBD5E1',
            },
          ]}
        >
          <Text style={[styles.label, { color: textColor }]}>Dark mode</Text>
          <Switch
            accessibilityLabel="Dark mode"
            value={dark}
            onValueChange={(enabled) => Appearance.setColorScheme(enabled ? 'dark' : 'light')}
            trackColor={{ true: brandAccent }}
          />
        </View>
      </View>
      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  setting: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  label: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
