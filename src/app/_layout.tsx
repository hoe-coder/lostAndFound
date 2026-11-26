import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserInfo } from '../components/UserInfo';
import { FooterBar } from '../layout/FooterBar';
import { HeaderBar } from '../layout/HeaderBar';

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />

      <View style={styles.fill}>
        <HeaderBar
          title="Lost&Found"
          action={
            <UserInfo
              firstName="Hüseyin"
              image="'https://randomuser.me/api/portraits/men/75.jpg"
            />
          }
        />

        <View style={styles.fill}>
          <Slot />
        </View>

        <FooterBar heading="Browse Lost & Found">
          <Button title="Home" onPress={() => router.navigate('/')} />
          <Button title="Found Items" onPress={() => router.navigate('/found')} />
        </FooterBar>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
