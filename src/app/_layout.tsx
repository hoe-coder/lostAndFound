import Ionicons from '@react-native-vector-icons/ionicons';
import { Link, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserInfo } from '../components/UserInfo';
import { HeaderBar } from '../layout/HeaderBar';
import { ItemReportsProvider } from '../state/ItemReports';
import { ItemActivityProvider } from '../state/ItemActivity';
import { currentUser } from '../state/currentUser';
import { UserProfileProvider, useUserProfile } from '../state/UserProfile';
import { getAccentColors } from '../theme/colors';

export default function RootLayout() {
  const [section] = useSegments();
  const showHeader = section !== 'items' && section !== 'messages' && section !== 'profile' && section !== 'notifications';
  const dark = useColorScheme() === 'dark';
  const backgroundColor = dark ? '#0F172A' : '#F8FAFC';

  return (
    <ItemActivityProvider>
      <ItemReportsProvider>
        <UserProfileProvider>
          <SafeAreaProvider>
            <StatusBar style={dark ? "light" : "dark"} />

            <View style={[styles.fill, { backgroundColor }]}>
              {showHeader && (
                <HeaderBar
                  title="Lost&Found"
                  action={<HeaderActions dark={dark} />}
                />
              )}

              <View style={styles.fill}>
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }} />
              </View>
            </View>
          </SafeAreaProvider>
        </UserProfileProvider>
      </ItemReportsProvider>
    </ItemActivityProvider>
  );
}

function HeaderActions({ dark }: { dark: boolean }) {
  const { displayName } = useUserProfile();

  return (
    <View style={styles.actions}>
      <Link href="/notifications" push asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Notifications" style={styles.bell}>
          <Ionicons name="notifications-outline" color={getAccentColors(dark).accent} size={24} accessible={false} />
        </Pressable>
      </Link>
      <UserInfo firstName={displayName} image={currentUser.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '65%' },
  bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
