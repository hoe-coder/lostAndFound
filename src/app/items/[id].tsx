import { getAccentColors } from '../../theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemAction } from '../../components/ItemAction';
import { useItemActivity } from '../../state/ItemActivity';
import { getItemById, type ItemReport } from '../../utils';

export default function ItemDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const item = typeof id === 'string' ? getItemById(id) : undefined;

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  if (!item) {
    return (
      <SafeAreaView style={[styles.empty, { backgroundColor: dark ? '#141414' : '#F8FAFC' }]}>
        <Text accessibilityRole="header" style={[styles.title, { color: dark ? '#FFFFFF' : '#0F172A' }]}>
          Item not found
        </Text>
        <ItemAction label="Back to items" symbol="‹" onPress={goBack} />
      </SafeAreaView>
    );
  }

  return <ItemDetail key={item.id} item={item} dark={dark} goBack={goBack} />;
}

function ItemDetail({ item, dark, goBack }: { item: ItemReport; dark: boolean; goBack: () => void }) {
  const { activity, toggleFavorite, markReported, saveClaim } = useItemActivity(item.id);
  const [editingMessage, setEditingMessage] = useState(false);
  const [message, setMessage] = useState('');
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { accent, onAccent } = getAccentColors(dark);
  const text = dark ? '#F8FAFC' : '#0F172A';
  const muted = dark ? '#B8B8B8' : '#475569';
  const border = dark ? '#424242' : '#CBD5E1';
  const surface = dark ? '#202020' : '#FFFFFF';
  const savedMessage = activity.claimMessage;
  const actionLabel = item.status === 'Lost' ? 'I found this' : 'This is mine';
  const postedAt = new Date(item.createdAt).toLocaleString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });

  async function shareItem() {
    try {
      await Share.share({ message: [item.status + ': ' + item.title, item.description, item.location].join('\n') });
    } catch {
      Alert.alert('Unable to open sharing', 'Try again in a moment.');
    }
  }

  function reportItem() {
    if (activity.reported) {
      Alert.alert('Report saved', 'This report is stored in the demo session.');
      return;
    }
    Alert.alert('Report this item?', 'The report will be saved in this demo session.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Report', style: 'destructive', onPress: markReported },
    ]);
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: dark ? '#141414' : '#F8FAFC' }]}>
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          if (editingMessage) scroll.current?.scrollToEnd({ animated: true });
        }}
        style={styles.scroll}
      >
        <View style={styles.hero}>
          <Image
            source={{ uri: item.image }}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel={item.title}
            accessible
          />
          <View style={styles.toolbar}>
            <ItemAction label="Back to items" symbol="‹" onPress={goBack} />
            <View style={styles.toolbarActions}>
              <ItemAction
                label={activity.favorite ? 'Remove from favorites' : 'Add to favorites'}
                symbol={activity.favorite ? '♥' : '♡'}
                active={!!activity.favorite}
                onPress={toggleFavorite}
              />
              <ItemAction label="Share item" symbol="↗" onPress={shareItem} />
              <ItemAction
                label={activity.reported ? 'Report saved' : 'Report item'}
                symbol="⚑"
                active={!!activity.reported}
                onPress={reportItem}
              />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.metadata}>
            <Text style={[styles.badge, { borderColor: border, color: muted }]}>{item.status}</Text>
            <Text style={[styles.eyebrow, { color: muted }]}>{item.category}</Text>
          </View>
          <Text accessibilityRole="header" style={[styles.title, { color: text }]}>{item.title}</Text>

          <View style={[styles.info, { backgroundColor: surface, borderColor: border }]}>
            <View style={styles.place}>
              <Text style={[styles.location, { color: text }]}>{item.location}</Text>
              <Text style={{ color: muted }}>{item.locationDetail}</Text>
            </View>
            <Text style={[styles.body, { color: text }]}>{postedAt}</Text>
            <Text style={[styles.body, { color: text }]}>Posted by {item.postedBy}</Text>
          </View>

          <View style={styles.description}>
            <Text accessibilityRole="header" style={[styles.eyebrow, { color: muted }]}>Description</Text>
            <Text style={[styles.body, { color: text }]}>{item.description}</Text>
          </View>

          <Text style={[styles.note, { color: muted, borderColor: border }]}>
            {savedMessage ? 'Message saved for this demo session.' : 'Messages stay in this demo session.'}
          </Text>
          {editingMessage && (
            <View style={styles.description}>
              <Text style={[styles.eyebrow, { color: muted }]}>Message</Text>
              <TextInput
                accessibilityLabel="Claim message"
                placeholder="Add details about the item"
                placeholderTextColor={muted}
                value={message}
                onChangeText={setMessage}
                multiline
                autoFocus
                style={[styles.input, { color: text, borderColor: border, backgroundColor: surface }]}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderColor: border }]}>
        {editingMessage && (
          <Pressable accessibilityRole="button" onPress={() => setEditingMessage(false)} style={styles.cancel}>
            <Text style={[styles.buttonLabel, { color: text }]}>Cancel</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: editingMessage && !message.trim() }}
          disabled={editingMessage && !message.trim()}
          style={[
            styles.primary,
            { backgroundColor: accent },
            editingMessage && !message.trim() && styles.disabled,
          ]}
          onPress={() => {
            if (editingMessage) {
              saveClaim(message.trim());
              setEditingMessage(false);
            } else {
              setMessage(savedMessage ?? '');
              setEditingMessage(true);
            }
          }}
        >
          <Text style={[styles.buttonLabel, { color: onAccent }]}>
            {editingMessage ? 'Save message' : savedMessage ? 'Edit message' : actionLabel}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  empty: { flex: 1, padding: 24, gap: 20 },
  hero: { aspectRatio: 1.45, backgroundColor: '#DEE7EB' },
  heroImage: { width: '100%', height: '100%' },
  toolbar: {
    position: 'absolute', top: 12, start: 12, end: 12,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  toolbarActions: { flexDirection: 'row', gap: 8 },
  content: { padding: 18, gap: 16 },
  metadata: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  badge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, fontSize: 12, textTransform: 'uppercase' },
  eyebrow: { fontSize: 12, letterSpacing: 1.1, fontWeight: '600', textTransform: 'uppercase' },
  title: { fontSize: 30, fontWeight: '800' },
  info: { gap: 11, padding: 15, borderWidth: 1, borderRadius: 18 },
  place: { gap: 3 },
  location: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22 },
  description: { gap: 8 },
  note: { borderWidth: 1, borderRadius: 14, padding: 12, fontSize: 14, lineHeight: 20 },
  input: { minHeight: 90, textAlignVertical: 'top', padding: 10, borderWidth: 1, borderRadius: 12, fontSize: 16 },
  footer: { flexDirection: 'row', gap: 8, borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 18, paddingVertical: 10 },
  primary: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 24, paddingHorizontal: 12 },
  cancel: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12 },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
