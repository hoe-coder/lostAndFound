import { Tabs } from 'expo-router/js-tabs';
import { useColorScheme } from 'react-native';
import { BottomNavigation } from '../../layout/BottomNavigation';

export default function MainTabs() {
  const backgroundColor = useColorScheme() === 'dark' ? '#0F172A' : '#F8FAFC';

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor } }}
      tabBar={(props) => <BottomNavigation {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="my-reports" options={{ title: 'My Reports' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
