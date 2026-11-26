import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppIntro } from '../components/AppIntro';
import { UserInfo } from '../components/UserInfo';
import { HeaderBar } from '../layout/HeaderBar';
import { ItemActivityProvider } from '../state/ItemActivity';

const introKey = 'campus-lost-and-found:intro-v1';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [introComplete, setIntroComplete] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(introKey).then(
      (value) => { if (active) setIntroComplete(value === 'complete'); },
      () => { if (active) setIntroComplete(false); },
    );
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (introComplete !== null) SplashScreen.hide();
  }, [introComplete]);

  async function completeIntro() {
    try {
      await AsyncStorage.setItem(introKey, 'complete');
    } catch (error) {
      console.warn('Could not save intro completion.', error);
    } finally {
      setIntroComplete(true);
    }
  }

  const [section] = useSegments();
  const isItemDetail = section === 'items';
  const dark = useColorScheme() === 'dark';
  const backgroundColor = dark ? '#0F172A' : '#F8FAFC';

  if (introComplete === null) return null;

  if (!introComplete) {
    return (
      <SafeAreaProvider>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <AppIntro onFinish={completeIntro} />
      </SafeAreaProvider>
    );
  }

  return (
    <ItemActivityProvider>
      <SafeAreaProvider>
        <StatusBar style={dark ? "light" : "dark"} />

        <View style={[styles.fill, { backgroundColor }]}>
          {!isItemDetail && (
            <HeaderBar
              title="Lost&Found"
              action={
                <UserInfo
                  firstName="Hüseyin"
                  image="https://randomuser.me/api/portraits/men/75.jpg"
                />
              }
            />
          )}

          <View style={styles.fill}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }} />
          </View>
        </View>
      </SafeAreaProvider>
    </ItemActivityProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 }
});
