import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { Directory, File, Paths } from 'expo-file-system';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import type { ItemReport } from '../utils';

type ReportInput = Omit<ItemReport, 'id' | 'createdAt' | 'image'>;
type ReportPhoto = { uri: string; base64?: string | null };
type StoredReport = Omit<ItemReport, 'image'> & { photo: string | null };

type ItemReportsContextValue = {
  reports: ItemReport[];
  loading: boolean;
  saveReport: (input: ReportInput, photo: ReportPhoto | null) => Promise<ItemReport>;
};

const storagePrefix = 'campus-lost-and-found:report:';
const ItemReportsContext = createContext<ItemReportsContextValue | null>(null);

function photoDirectory() {
  return new Directory(Paths.document, 'report-photos');
}

function toItemReport({ photo, ...report }: StoredReport): ItemReport {
  return {
    ...report,
    image: !photo || Platform.OS === 'web' ? photo ?? '' : new File(photoDirectory(), photo).uri,
  };
}

async function loadReports(): Promise<ItemReport[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter((key) => key.startsWith(storagePrefix));
  if (!keys.length) return [];

  const records = await AsyncStorage.multiGet(keys);
  return records.flatMap(([key, value]) => {
    try {
      const stored = value ? JSON.parse(value) as StoredReport | null : null;
      return stored && key === storagePrefix + stored.id ? [toItemReport(stored)] : [];
    } catch {
      return [];
    }
  }).sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export function ItemReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<ItemReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void loadReports().then(
      (saved) => { if (active) setReports(saved); },
      (error: unknown) => { console.warn('Could not load local reports.', error); },
    ).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function saveReport(input: ReportInput, photo: ReportPhoto | null): Promise<ItemReport> {
    const id = input.status.toLowerCase() + '-' + randomUUID();
    let photoFile: File | undefined;
    const record: StoredReport = { ...input, id, createdAt: new Date().toISOString(), photo: null };

    try {
      if (photo && Platform.OS === 'web') {
        if (!photo.base64) throw new Error('Photo data is unavailable.');
        record.photo = 'data:image/jpeg;base64,' + photo.base64;
      } else if (photo) {
        const source = new File(photo.uri);
        const directory = photoDirectory();
        directory.create({ intermediates: true, idempotent: true });
        record.photo = id + (source.extension || '.jpg');
        photoFile = new File(directory, record.photo);
        await source.copy(photoFile);
      }

      const report = toItemReport(record);
      await AsyncStorage.setItem(storagePrefix + id, JSON.stringify(record));
      setReports((current) => [report, ...current]);
      return report;
    } catch (error) {
      try {
        if (photoFile?.exists) photoFile.delete();
      } catch (cleanupError) {
        console.warn('Could not clean up the unsaved photo.', cleanupError);
      }
      throw error;
    }
  }

  return (
    <ItemReportsContext.Provider value={{ reports, loading, saveReport }}>
      {children}
    </ItemReportsContext.Provider>
  );
}

export function useItemReports() {
  const context = useContext(ItemReportsContext);
  if (!context) throw new Error('ItemReportsProvider is required.');
  return context;
}
