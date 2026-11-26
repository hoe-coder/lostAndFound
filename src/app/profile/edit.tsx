import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile } from '../../state/UserProfile';
import { getAccentColors } from '../../theme/colors';

export default function EditProfilePage() {
  const router = useRouter();
  const { displayName, loading, saveDisplayName } = useUserProfile();
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const savingRef = useRef(false);
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);
  const color = dark ? '#F1F5F9' : '#0F172A';
  const name = draft ?? displayName;
  const disabled = loading || saving || !name.trim();

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  }

  async function submit() {
    if (disabled || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError('');

    try {
      await saveDisplayName(name);
      close();
    } catch {
      setError('Could not save your profile. Please try again.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={[styles.title, { color }]}>Edit profile</Text>
            <Pressable accessibilityRole="button" disabled={saving} onPress={close} style={styles.button}>
              <Text style={[styles.label, { color: accent }]}>Cancel</Text>
            </Pressable>
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color }]}>Display name</Text>
            <TextInput
              accessibilityLabel="Display name"
              autoComplete="name"
              editable={!saving}
              maxLength={60}
              onChangeText={setDraft}
              onSubmitEditing={submit}
              returnKeyType="done"
              selectionColor={accent}
              style={[styles.input, { color, backgroundColor: dark ? '#1E293B' : '#FFFFFF', borderColor: dark ? '#475569' : '#CBD5E1' }]}
              value={name}
            />
          </View>
          {!!error && <Text accessibilityRole="alert" style={{ color: dark ? '#FECACA' : '#991B1B' }}>{error}</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled, busy: saving }}
            disabled={disabled}
            onPress={submit}
            style={[styles.button, styles.save, { backgroundColor: accent, opacity: disabled ? 0.6 : 1 }]}
          >
            <Text style={[styles.label, { color: onAccent }]}>{saving ? 'Saving…' : 'Save changes'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', gap: 16, padding: 16 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  field: { gap: 6 },
  label: { fontSize: 16, fontWeight: '600' },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16 },
  button: { minHeight: 44, justifyContent: 'center' },
  save: { alignItems: 'center', borderRadius: 24 },
});
