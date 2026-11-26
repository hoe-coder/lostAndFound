import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { currentUser } from './currentUser';

type UserProfile = {
  displayName: string;
  loading: boolean;
  saveDisplayName: (name: string) => Promise<void>;
};

const storageKey = 'campus-lost-and-found:profile:' + currentUser.id;
const UserProfileContext = createContext<UserProfile | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayName] = useState<string>(currentUser.firstName);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(storageKey).then(
      (saved) => { if (active && saved?.trim()) setDisplayName(saved); },
      (error: unknown) => { console.warn('Could not load the local profile.', error); },
    ).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function saveDisplayName(name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 60) throw new Error('Invalid display name.');
    await AsyncStorage.setItem(storageKey, trimmed);
    setDisplayName(trimmed);
  }

  return (
    <UserProfileContext.Provider value={{ displayName, loading, saveDisplayName }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const profile = useContext(UserProfileContext);
  if (!profile) throw new Error('UserProfileProvider is required.');
  return profile;
}
