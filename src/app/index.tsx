import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { CategoryPill } from '../components/CategoryPill';
import { ItemCard } from '../components/ItemCard';
import { ItemStatusFilter, type ItemStatus } from '../components/ItemStatusFilter';
import { SearchBar } from '../components/SearchBar';
import { AppFooter } from '../layout/FooterBar';
import { getFoundItemCategories, getFoundItems, getLostItems, type ItemReport } from '../utils';

const categories = ['', ...getFoundItemCategories()];

export default function StartPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ItemStatus>('lost');
  const filters = { category, query };
  const lost = getLostItems(filters).map<ItemReport>((item) => ({ ...item, status: 'Lost' }));
  const found = getFoundItems(filters).map<ItemReport>((item) => ({ ...item, status: 'Found' }));
  const counts = { lost: lost.length, found: found.length, all: lost.length + found.length };
  const itemsByStatus = {
    lost,
    found,
    all: [...lost, ...found].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)),
  };
  const dark = useColorScheme() === 'dark';
  const textColor = dark ? '#F1F5F9' : '#0F172A';
  const mutedColor = dark ? '#CBD5E1' : '#475569';
  const items = itemsByStatus[status];
  const heading = { lost: 'Lost items', found: 'Found items', all: 'All items' }[status];

  return (
    <View style={[styles.screen, { backgroundColor: dark ? '#0F172A' : '#F8FAFC' }]}>
      <View style={styles.filters}>
        <SearchBar placeholder="Search items, brands, places…" value={query} onChangeText={setQuery} />
        <ItemStatusFilter value={status} counts={counts} onChange={setStatus} />

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.categories}
          >
            {categories.map((option) => (
              <CategoryPill
                key={option}
                label={option || 'All'}
                selected={category === option}
                onPress={() => setCategory(option)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.results}
        ListFooterComponent={AppFooter}
        ListHeaderComponent={
          <View style={styles.listHeading}>
            <Text accessibilityRole="header" style={[styles.heading, { color: textColor }]}>{heading}</Text>
            <Text style={{ color: mutedColor }}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
          </View>
        }
        ListEmptyComponent={
          <Text accessibilityLiveRegion="polite" style={[styles.listInset, { color: mutedColor }]}>
            No items match your filters.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.listInset}>
            <ItemCard item={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  filters: {
    gap: 12,
    padding: 16,
    paddingBottom: 12,
  },
  categories: {
    gap: 8,
  },
  results: {
    gap: 10,
  },
  listInset: { paddingHorizontal: 16 },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
  },
  heading: { fontSize: 21, fontWeight: '700' },
});
