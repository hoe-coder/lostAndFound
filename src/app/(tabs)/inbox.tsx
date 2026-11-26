import Ionicons from '@react-native-vector-icons/ionicons';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useInboxThreads } from '../../state/ItemActivity';
import { useItemReports } from '../../state/ItemReports';
import { getAccentColors } from '../../theme/colors';
import { getItemById } from '../../utils';

export default function InboxPage() {
  const threads = useInboxThreads();
  const { reports } = useItemReports();
  const dark = useColorScheme() === 'dark';
  const { accent } = getAccentColors(dark);
  const textColor = dark ? '#F1F5F9' : '#0F172A';
  const muted = dark ? '#CBD5E1' : '#475569';

  return (
    <FlatList
      data={threads}
      keyExtractor={(thread) => thread.itemId}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={[styles.title, { color: textColor }]}>Inbox</Text>
          <Text style={{ color: muted }}>Return messages saved in this demo session.</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={[styles.empty, { borderColor: dark ? '#334155' : '#CBD5E1' }]}>
          <Ionicons name="chatbubbles-outline" color={accent} size={28} accessible={false} />
          <Text style={[styles.itemTitle, { color: textColor }]}>No conversations yet</Text>
          <Text style={[styles.emptyText, { color: muted }]}>
            Save a return message from an item to start a conversation here.
          </Text>
        </View>
      }
      renderItem={({ item: thread }) => {
        const report = reports.find((item) => item.id === thread.itemId) ?? getItemById(thread.itemId);
        const title = report?.title ?? 'Item conversation';

        return (
          <Link href={{ pathname: '/messages/[id]', params: { id: thread.itemId } }} push asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={'Open conversation about ' + title}
              style={StyleSheet.flatten([styles.thread, { backgroundColor: dark ? '#1E293B' : '#FFFFFF' }])}
            >
              <Ionicons name="chatbubble-outline" size={22} color={accent} accessible={false} />
              <View style={styles.summary}>
                <Text numberOfLines={1} style={[styles.itemTitle, { color: textColor }]}>{title}</Text>
                <Text numberOfLines={1} style={{ color: muted }}>{thread.latest.body}</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={muted} accessible={false} />
            </Pressable>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  header: { gap: 6 },
  title: { fontSize: 26, fontWeight: '800' },
  empty: { alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 16, padding: 20 },
  emptyText: { textAlign: 'center', lineHeight: 20 },
  thread: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68, padding: 14, borderRadius: 14 },
  summary: { flex: 1, minWidth: 0, gap: 4 },
  itemTitle: { fontSize: 16, fontWeight: '700' },
});
