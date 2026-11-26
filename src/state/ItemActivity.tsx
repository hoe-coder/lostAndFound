import { randomUUID } from 'expo-crypto';
import { createContext, useContext, useState, type ReactNode } from 'react';

type LocalMessage = {
  id: string;
  body: string;
  createdAt?: string;
};

type Activity = {
  favorite?: boolean;
  reported?: boolean;
  claimMessage?: string;
  claimCreatedAt?: string;
  replies?: LocalMessage[];
};

type ItemActivityContextValue = {
  activity: Record<string, Activity | undefined>;
  update: (id: string, changes: (current: Activity) => Activity) => void;
};

const ItemActivityContext = createContext<ItemActivityContextValue | null>(null);

export function ItemActivityProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<ItemActivityContextValue['activity']>({});

  const update: ItemActivityContextValue['update'] = (id, changes) => {
    setActivity((current) => {
      const item = current[id] ?? {};
      return { ...current, [id]: { ...item, ...changes(item) } };
    });
  };

  return (
    <ItemActivityContext.Provider value={{ activity, update }}>
      {children}
    </ItemActivityContext.Provider>
  );
}

function getMessages(activity: Activity): LocalMessage[] {
  const replies = activity.replies ?? [];
  if (!activity.claimMessage) return replies;
  return [{ id: 'return-request', body: activity.claimMessage, createdAt: activity.claimCreatedAt }, ...replies];
}

function useActivityContext() {
  const context = useContext(ItemActivityContext);
  if (!context) throw new Error('ItemActivityProvider is required.');

  return context;
}

export function useInboxThreads() {
  const { activity } = useActivityContext();

  return Object.entries(activity).flatMap(([itemId, item]) => {
    const latest = item ? getMessages(item).at(-1) : undefined;
    return latest ? [{ itemId, latest }] : [];
  }).sort((first, second) =>
    (second.latest.createdAt ?? '').localeCompare(first.latest.createdAt ?? ''),
  );
}

export function useReturnMessageActivity() {
  const { activity } = useActivityContext();

  return Object.entries(activity).flatMap(([itemId, item]) =>
    item ? getMessages(item).map((message) => ({ itemId, message })) : [],
  );
}

export function useItemActivity(id: string) {
  const context = useActivityContext();
  const activity = context.activity[id] ?? {};

  return {
    activity,
    messages: getMessages(activity),
    toggleFavorite: () => context.update(id, (item) => ({ favorite: !item.favorite })),
    markReported: () => context.update(id, () => ({ reported: true })),
    saveClaim: (claimMessage: string) => {
      const createdAt = new Date().toISOString();
      context.update(id, (item) => ({ claimMessage, claimCreatedAt: item.claimCreatedAt ?? createdAt }));
    },
    addMessage: (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;

      const message = { id: randomUUID(), body: trimmed, createdAt: new Date().toISOString() };
      context.update(id, (item) => ({ replies: [...(item.replies ?? []), message] }));
    },
  };
}
