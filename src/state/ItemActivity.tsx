import { createContext, useContext, useState, type ReactNode } from 'react';

type Activity = {
  favorite?: boolean;
  reported?: boolean;
  claimMessage?: string;
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

export function useItemActivity(id: string) {
  const context = useContext(ItemActivityContext);
  if (!context) throw new Error('ItemActivityProvider is required.');

  return {
    activity: context.activity[id] ?? {},
    toggleFavorite: () => context.update(id, (item) => ({ favorite: !item.favorite })),
    markReported: () => context.update(id, () => ({ reported: true })),
    saveClaim: (claimMessage: string) => context.update(id, () => ({ claimMessage })),
  };
}
