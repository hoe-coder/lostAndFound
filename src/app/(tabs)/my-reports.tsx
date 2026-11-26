import { ActivityIndicator, FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { ItemCard } from '../../components/ItemCard';
import { useItemReports } from '../../state/ItemReports';
import { getAccentColors } from '../../theme/colors';

export default function MyReportsPage() {
  const { reports, loading } = useItemReports();
  const dark = useColorScheme() === 'dark';
  const textColor = dark ? '#F1F5F9' : '#0F172A';
  const mutedColor = dark ? '#CBD5E1' : '#475569';

  return (
    <FlatList
      data={reports}
      keyExtractor={(report) => report.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={[styles.title, { color: textColor }]}>My Reports</Text>
          {!loading && (
            <Text style={{ color: mutedColor }}>
              {reports.length} {reports.length === 1 ? 'report' : 'reports'}
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator accessibilityLabel="Loading your reports" color={getAccentColors(dark).accent} />
        ) : (
          <Text style={[styles.empty, { color: mutedColor }]}>
            Reports you create on this device will appear here.
          </Text>
        )
      }
      renderItem={({ item }) => <ItemCard item={item} />}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 24, fontWeight: '800' },
  empty: { fontSize: 16, lineHeight: 23 },
});
