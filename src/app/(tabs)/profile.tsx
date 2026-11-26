import Ionicons from '@react-native-vector-icons/ionicons';
import { Link } from 'expo-router';
import { Appearance, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';
import { currentUser } from '../../state/currentUser';
import { useUserProfile } from '../../state/UserProfile';
import { getAccentColors } from '../../theme/colors';

const links = [
  { label: 'Edit profile', href: '/profile/edit', icon: 'create-outline' },
  { label: 'My Reports', href: '/my-reports', icon: 'clipboard-outline' },
  { label: 'Inbox', href: '/inbox', icon: 'chatbubbles-outline' },
] as const;

export default function ProfilePage() {
  const { displayName } = useUserProfile();
  const dark = useColorScheme() === 'dark';
  const { accent } = getAccentColors(dark);
  const color = dark ? '#F1F5F9' : '#0F172A';
  const card = {
    backgroundColor: dark ? '#1E293B' : '#FFFFFF',
    borderColor: dark ? '#475569' : '#CBD5E1',
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text accessibilityRole="header" style={[styles.heading, { color }]}>Profile</Text>
      <View style={[styles.card, styles.row, card]}>
        <Image src={currentUser.avatar} accessible={false} style={styles.avatar} />
        <Text style={[styles.label, { color }]}>{displayName}</Text>
      </View>
      <View style={[styles.card, card]}>
        {links.map(({ label, href, icon }, index) => (
          <Link key={href} href={href} asChild>
            <Pressable
              accessibilityRole="link"
              style={StyleSheet.flatten([styles.row, index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderColor: card.borderColor }])}
            >
              <Ionicons name={icon} size={22} color={accent} accessible={false} />
              <Text style={[styles.label, { color }]}>{label}</Text>
              <Ionicons name="chevron-forward" size={18} color={color} accessible={false} />
            </Pressable>
          </Link>
        ))}
      </View>
      <View style={[styles.card, styles.row, card]}>
        <Text style={[styles.label, { color }]}>Dark mode</Text>
        <Switch
          accessibilityLabel="Dark mode"
          value={dark}
          onValueChange={(enabled) => Appearance.setColorScheme(enabled ? 'dark' : 'light')}
          trackColor={{ true: accent }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 16, padding: 16 },
  heading: { fontSize: 24, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 8 },
  label: { flex: 1, fontSize: 16, fontWeight: '600' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E2E8F0' },
});
