import Ionicons from '@react-native-vector-icons/ionicons';
import { Link, useRouter, type Href } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReturnMessageActivity } from '../state/ItemActivity';
import { useItemReports } from '../state/ItemReports';
import { getAccentColors } from '../theme/colors';
import { getItemById } from '../utils';

type Notification = {
  id: string;
  title: string;
  detail: string;
  createdAt?: string;
  icon: 'clipboard-outline' | 'chatbubble-outline';
  href: Href;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { reports, loading } = useItemReports();
  const messages = useReturnMessageActivity();
  const dark = useColorScheme() === 'dark';
  const { accent } = getAccentColors(dark);
  const color = dark ? '#F1F5F9' : '#0F172A';
  const muted = dark ? '#CBD5E1' : '#475569';

  const notifications: Notification[] = [
    ...reports.map((item): Notification => ({
      id: 'report:' + item.id,
      title: 'Report saved',
      detail: item.title,
      createdAt: item.createdAt,
      icon: 'clipboard-outline',
      href: { pathname: '/items/[id]', params: { id: item.id } },
    })),
    ...messages.map(({ itemId, message }): Notification => ({
      id: 'message:' + itemId + ':' + message.id,
      title: message.id === 'return-request' ? 'Return request saved' : 'Message saved',
      detail: (reports.find((item) => item.id === itemId) ?? getItemById(itemId))?.title ?? 'Item conversation',
      createdAt: message.createdAt,
      icon: 'chatbubble-outline',
      href: { pathname: '/messages/[id]', params: { id: itemId } },
    })),
  ];
  notifications.sort((first, second) => (second.createdAt ?? '').localeCompare(first.createdAt ?? ''));

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={accent} accessible={false} />
        </Pressable>
        <Text accessibilityRole="header" style={[styles.heading, { color }]}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={[styles.empty, { borderColor: dark ? '#334155' : '#CBD5E1' }]}>
            <Ionicons name="notifications-outline" size={28} color={accent} accessible={false} />
            <Text accessibilityLiveRegion="polite" style={[styles.title, { color }]}>
              {loading ? 'Loading notifications…' : 'No notifications yet'}
            </Text>
            {!loading && <Text style={[styles.emptyText, { color: muted }]}>Activity from your reports and return conversations will appear here.</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <Link href={item.href} push asChild>
            <Pressable accessibilityRole="link" style={StyleSheet.flatten([styles.row, { backgroundColor: dark ? '#1E293B' : '#FFFFFF' }])}>
              <Ionicons name={item.icon} size={22} color={accent} accessible={false} />
              <View style={styles.details}>
                <Text style={[styles.title, { color }]}>{item.title}</Text>
                <Text style={{ color: muted }}>{item.detail}</Text>
                {item.createdAt && (
                  <Text style={[styles.date, { color: muted }]}>{new Date(item.createdAt).toLocaleString()}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={muted} accessible={false} />
            </Pressable>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingTop: 8 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: '700' },
  content: { gap: 12, padding: 16 },
  empty: { alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 16, padding: 20 },
  emptyText: { textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14 },
  details: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: '700' },
  date: { fontSize: 12 },
});
