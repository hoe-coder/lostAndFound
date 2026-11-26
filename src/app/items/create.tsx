import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../../components/CategoryPill';
import { useItemReports } from '../../state/ItemReports';
import { getAccentColors } from '../../theme/colors';
import { getFoundItemCategories, type ItemReport } from '../../utils';

const categories = getFoundItemCategories();
const statuses = ['Lost', 'Found'] as const;
const fields = [
  { name: 'title', label: 'Item title', placeholder: 'e.g. Blue water bottle', maxLength: 80 },
  { name: 'location', label: 'Campus location', placeholder: 'e.g. Main library', maxLength: 80 },
  { name: 'locationDetail', label: 'Location details (optional)', placeholder: 'e.g. Second floor, by the printers', maxLength: 120 },
  { name: 'description', label: 'Description', placeholder: 'What would help someone recognize it?', maxLength: 500, multiline: true },
  { name: 'postedBy', label: 'Your name', placeholder: 'Name shown on the report', maxLength: 60 },
] as const;
type Draft = Record<(typeof fields)[number]['name'], string>;

export default function CreateItemPage() {
  const router = useRouter();
  const { saveReport, loading } = useItemReports();
  const [status, setStatus] = useState<ItemReport['status'] | null>(null);
  const [category, setCategory] = useState('');
  const [draft, setDraft] = useState<Draft>({ title: '', location: '', locationDetail: '', description: '', postedBy: '' });
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);
  const textColor = dark ? '#F8FAFC' : '#0F172A';
  const mutedColor = dark ? '#CBD5E1' : '#475569';
  const surface = dark ? '#1E293B' : '#FFFFFF';
  const border = dark ? '#475569' : '#CBD5E1';

  async function choosePhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], quality: 0.75, base64: Platform.OS === 'web',
      });
      if (!result.canceled) {
        setPhoto(result.assets[0]);
        setError('');
      }
    } catch {
      setError('Could not open your photo library. Try again or save without a photo.');
    }
  }

  async function submit() {
    if (savingRef.current || loading) return;

    const title = draft.title.trim();
    const location = draft.location.trim();
    const description = draft.description.trim();
    const postedBy = draft.postedBy.trim();
    if (!status || !category || !title || !location || !description || !postedBy) {
      setError('Choose Lost or Found and a category, then enter a title, location, description, and your name.');
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError('');
    try {
      const item = await saveReport({
        status, category, title, location, description, postedBy,
        locationDetail: draft.locationDetail.trim(),
      }, photo);
      router.replace({ pathname: '/items/[id]', params: { id: item.id } });
    } catch {
      setError('The report could not be saved. Your entries are still here. Please try again.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: dark ? '#0F172A' : '#F8FAFC' }]}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={[styles.title, { color: textColor }]}>Report an item</Text>
            <Pressable accessibilityRole="button" disabled={saving} onPress={cancel} style={styles.textButton}>
              <Text style={[styles.buttonLabel, { color: accent }]}>Cancel</Text>
            </Pressable>
          </View>

          <View style={styles.group}>
            <Text style={[styles.label, { color: textColor }]}>What happened?</Text>
            <View accessibilityRole="radiogroup" accessibilityLabel="Report type" style={styles.statuses}>
              {statuses.map((option) => {
                const selected = status === option;
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    disabled={saving}
                    onPress={() => setStatus(option)}
                    style={[styles.status, { backgroundColor: selected ? accent : surface, borderColor: selected ? accent : border }]}
                  >
                    <Text style={[styles.buttonLabel, { color: selected ? onAccent : textColor }]}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={[styles.label, { color: textColor }]}>Category</Text>
            <View style={styles.categories}>
              {categories.map((option) => (
                <CategoryPill key={option} label={option} selected={category === option} onPress={() => setCategory(option)} />
              ))}
            </View>
          </View>

          {fields.map((field) => (
            <View key={field.name} style={styles.group}>
              <Text style={[styles.label, { color: textColor }]}>{field.label}</Text>
              <TextInput
                accessibilityLabel={field.label}
                placeholder={field.placeholder}
                placeholderTextColor={mutedColor}
                selectionColor={accent}
                maxLength={field.maxLength}
                editable={!saving}
                multiline={'multiline' in field}
                value={draft[field.name]}
                onChangeText={(value) => setDraft((current) => ({ ...current, [field.name]: value }))}
                style={[
                  styles.input,
                  'multiline' in field && styles.multiline,
                  { backgroundColor: surface, borderColor: border, color: textColor },
                ]}
              />
            </View>
          ))}

          <View style={styles.group}>
            <Text style={[styles.label, { color: textColor }]}>Photo (optional)</Text>
            {photo && <Image source={photo.uri} style={styles.photo} contentFit="cover" accessibilityLabel="Selected item photo" />}
            <View style={styles.photoActions}>
              <Pressable accessibilityRole="button" disabled={saving} onPress={choosePhoto} style={styles.textButton}>
                <Text style={[styles.buttonLabel, { color: accent }]}>{photo ? 'Change photo' : 'Choose photo'}</Text>
              </Pressable>
              {photo && (
                <Pressable accessibilityRole="button" disabled={saving} onPress={() => setPhoto(null)} style={styles.textButton}>
                  <Text style={[styles.buttonLabel, { color: mutedColor }]}>Remove photo</Text>
                </Pressable>
              )}
            </View>
          </View>

          {!!error && <Text accessibilityRole="alert" style={{ color: dark ? '#FECACA' : '#991B1B' }}>{error}</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: loading || saving, busy: saving }}
            disabled={loading || saving}
            onPress={submit}
            style={[styles.primary, { backgroundColor: accent, opacity: loading || saving ? 0.6 : 1 }]}
          >
            <Text style={[styles.buttonLabel, { color: onAccent }]}>{saving ? 'Saving…' : 'Save report'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', padding: 18, gap: 17 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { flexShrink: 1, fontSize: 28, fontWeight: '800' },
  group: { gap: 7 },
  label: { fontSize: 15, fontWeight: '600' },
  statuses: { flexDirection: 'row', gap: 8 },
  status: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 24 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  multiline: { minHeight: 108, textAlignVertical: 'top' },
  photo: { height: 160, borderRadius: 12 },
  photoActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  textButton: { minHeight: 44, justifyContent: 'center' },
  primary: { minHeight: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  buttonLabel: { fontSize: 16, fontWeight: '700' },
});
