import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserInfo } from '../components/UserInfo';
import { HeaderBar } from '../layout/HeaderBar';
import { ItemReportsProvider } from '../state/ItemReports';
import { ItemActivityProvider } from '../state/ItemActivity';
import { currentUser } from '../state/currentUser';

export default function RootLayout() {
  const [section] = useSegments();
  const showHeader = section !== 'items' && section !== 'messages';
  const dark = useColorScheme() === 'dark';
  const backgroundColor = dark ? '#0F172A' : '#F8FAFC';

  return (
    <ItemActivityProvider>
      <ItemReportsProvider>
        <SafeAreaProvider>
          <StatusBar style={dark ? "light" : "dark"} />

          <View style={[styles.fill, { backgroundColor }]}>
            {showHeader && (
              <HeaderBar
                title="Lost&Found"
                action={
                  <UserInfo
                    firstName={currentUser.firstName}
                    image={currentUser.avatar}
                  />
                }
              />
            )}

            <View style={styles.fill}>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }} />
            </View>
          </View>
        </SafeAreaProvider>
      </ItemReportsProvider>
    </ItemActivityProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 }
});
