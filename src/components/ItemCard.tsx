import { getAccentColors } from '../theme/colors';
import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useItemActivity } from '../state/ItemActivity';
import { formatItemAge, type ItemReport } from '../utils';
import { ItemAction } from './ItemAction';

export function ItemCard({ item }: { item: ItemReport }) {
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);
  const text = dark ? '#F8FAFC' : '#0F172A';
  const muted = dark ? '#B8B8B8' : '#475569';
  const border = dark ? '#454545' : '#CBD5E1';
  const { activity, toggleFavorite } = useItemActivity(item.id);

  return (
    <View style={[styles.card, { backgroundColor: dark ? '#202020' : '#FFFFFF', borderColor: border }]}>
      <View style={styles.photo}>
        {item.image
          ? <Image source={{ uri: item.image }} style={styles.image} accessible={false} />
          : <Text style={styles.noPhoto}>No photo</Text>}
        <View style={styles.favorite}>
          <ItemAction
            label={activity.favorite ? 'Remove from favorites' : 'Add to favorites'}
            symbol={activity.favorite ? '♥' : '♡'}
            active={!!activity.favorite}
            onPress={toggleFavorite}
          />
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.metadata}>
          <Text style={[styles.badge, { color: muted, borderColor: border }]}>{item.status}</Text>
          <Text style={[styles.metaText, { color: muted }]}>
            {item.category} · {formatItemAge(item.createdAt)}
          </Text>
        </View>
        <Text numberOfLines={2} style={[styles.title, { color: text }]}>{item.title}</Text>
        <Text numberOfLines={2} style={[styles.description, { color: muted }]}>{item.description}</Text>

        <View style={styles.actions}>
          <Text numberOfLines={1} style={[styles.location, { color: text, borderColor: border }]}>
            {item.location}
          </Text>
          <Link href={{ pathname: '/items/[id]', params: { id: item.id } }} push asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={'View ' + item.title}
              style={StyleSheet.flatten([styles.viewButton, { backgroundColor: accent }])}
            >
              <Text style={[styles.viewLabel, { color: onAccent }]}>View</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, borderWidth: 1, borderRadius: 20 },
  photo: { width: '29%', aspectRatio: 1, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderRadius: 14, backgroundColor: '#DCE3EA' },
  noPhoto: { color: '#475569', fontSize: 12 },
  image: { width: '100%', height: '100%' },
  favorite: { position: 'absolute', top: 5, start: 5 },
  details: { flex: 1, minWidth: 0, gap: 5 },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  badge: { paddingHorizontal: 7, borderWidth: 1, borderRadius: 10, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7 },
  metaText: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 },
  title: { fontSize: 17, fontWeight: '700' },
  description: { fontSize: 14, lineHeight: 19 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 3 },
  location: { flexShrink: 1, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderRadius: 14, fontSize: 12 },
  viewButton: { minHeight: 44, paddingHorizontal: 14, justifyContent: 'center', borderRadius: 22 },
  viewLabel: { fontSize: 14, fontWeight: '700' },
});
