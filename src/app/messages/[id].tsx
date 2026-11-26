import Ionicons from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItemActivity } from '../../state/ItemActivity';
import { useItemReports } from '../../state/ItemReports';
import { getAccentColors } from '../../theme/colors';
import { getItemById } from '../../utils';

export default function ConversationPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reports } = useItemReports();
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);
  const textColor = dark ? '#F1F5F9' : '#0F172A';
  const muted = dark ? '#CBD5E1' : '#475569';
  const backgroundColor = dark ? '#0F172A' : '#F8FAFC';
  const borderColor = dark ? '#475569' : '#CBD5E1';
  const itemId = typeof id === 'string' ? id : '';
  const item = reports.find((report) => report.id === itemId) ?? getItemById(itemId);
  const { messages, addMessage } = useItemActivity(itemId);
  const [draft, setDraft] = useState('');
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const canSave = !!itemId && !!draft.trim() && (!!item || messages.length > 0);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/inbox');
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor }]}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderColor }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to Inbox" style={styles.back} onPress={goBack}>
            <Ionicons name="chevron-back" size={24} color={accent} accessible={false} />
          </Pressable>
          <View style={styles.heading}>
            <Text numberOfLines={1} accessibilityRole="header" style={[styles.title, { color: textColor }]}>
              {item?.title ?? 'Conversation'}
            </Text>
            <Text style={{ color: muted }}>{item ? 'Posted by ' + item.postedBy : 'Saved return messages'}</Text>
          </View>
        </View>

        <ScrollView
          ref={scroll}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.messages}
        >
          {messages.length === 0 && <Text style={{ color: muted }}>No messages yet.</Text>}
          {messages.map((message) => (
            <View key={message.id} style={[styles.bubble, { backgroundColor: accent }]}>
              <Text style={[styles.body, { color: onAccent }]}>{message.body}</Text>
              {message.createdAt && (
                <Text style={[styles.time, { color: onAccent }]}>
                  {new Date(message.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.composer, { borderColor }]}>
          <Text style={{ color: muted }}>Messages stay in this demo session.</Text>
          <View style={styles.controls}>
            <TextInput
              accessibilityLabel="Message"
              placeholder="Write a message"
              placeholderTextColor={muted}
              style={[styles.input, { color: textColor, borderColor }]}
              value={draft}
              onChangeText={setDraft}
              maxLength={500}
              multiline
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
              disabled={!canSave}
              onPress={() => {
                addMessage(draft);
                setDraft('');
              }}
              style={[styles.save, { backgroundColor: accent, opacity: canSave ? 1 : 0.5 }]}
            >
              <Text style={{ color: onAccent, fontWeight: '700' }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  heading: { flex: 1, gap: 3 },
  title: { fontSize: 19, fontWeight: '800' },
  messages: { padding: 16, gap: 10 },
  bubble: { alignSelf: 'flex-end', maxWidth: '87%', padding: 12, gap: 4, borderRadius: 16 },
  body: { fontSize: 16, lineHeight: 22 },
  time: { fontSize: 11 },
  composer: { padding: 12, gap: 8, borderTopWidth: StyleSheet.hairlineWidth },
  controls: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9, fontSize: 16 },
  save: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 22 },
});
