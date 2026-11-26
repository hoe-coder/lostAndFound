import categories from '../../data/category.json';
import foundItems from '../../data/found-items.json';
import lostItems from '../../data/lost-items.json';

type Item = (typeof foundItems)[number];

export type FoundItem = Item;
export type LostItem = Item;
export type ItemReport = Item & { status: 'Lost' | 'Found' };

export type ItemFilters = {
  category?: string;
  query?: string;
  /** Inclusive UTC calendar day in YYYY-MM-DD format. */
  fromDate?: string;
  /** Inclusive UTC calendar day in YYYY-MM-DD format. */
  toDate?: string;
};

export type FoundItemFilters = ItemFilters;

export function getFoundItemCategories(): string[] {
  return [...categories];
}

export function getFoundItems(filters?: FoundItemFilters): FoundItem[] {
  return filterItems(foundItems, filters);
}

export function getLostItems(filters?: ItemFilters): LostItem[] {
  return filterItems(lostItems, filters);
}

export function getReportsByUserId(userId: string, localReports: readonly ItemReport[]): ItemReport[] {
  const lost = lostItems
    .filter((item) => item.userId === userId)
    .map<ItemReport>((item) => ({ ...item, status: 'Lost' }));
  const found = foundItems
    .filter((item) => item.userId === userId)
    .map<ItemReport>((item) => ({ ...item, status: 'Found' }));

  return [...localReports.filter((item) => item.userId === userId), ...lost, ...found]
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export function getItemById(id: string): ItemReport | undefined {
  const lost = lostItems.find((item) => item.id === id);
  if (lost) return { ...lost, status: 'Lost' };

  const found = foundItems.find((item) => item.id === id);
  return found ? { ...found, status: 'Found' } : undefined;
}

export function formatItemAge(createdAt: string, now = Date.now()): string {
  const days = Math.max(0, Math.floor((now - Date.parse(createdAt)) / 86_400_000));
  if (days === 0) return 'Today';
  return days + (days === 1 ? ' day ago' : ' days ago');
}

export function filterItems<T extends Item>(
  items: readonly T[],
  { category, query, fromDate, toDate }: ItemFilters = {},
): T[] {
  const searchTerm = query?.trim().toLowerCase();

  return items.filter((item) => {
    const createdDate = item.createdAt.slice(0, 10);

    return (
      (!category || item.category === category) &&
      (!searchTerm ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.locationDetail.toLowerCase().includes(searchTerm)) &&
      (!fromDate || createdDate >= fromDate) &&
      (!toDate || createdDate <= toDate)
    );
  });
}
