import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAccentColors } from '../theme/colors';

const logo = require('../../assets/splash-brand.png');
const darkLogo = require('../../assets/splash-brand-dark.png');

const steps = [
  {
    title: 'Lost something on campus?',
    description: 'Campus Lost & Found brings local lost and found reports together so you can see what’s missing and what’s been found.',
  },
  {
    title: 'Find a match faster',
    description: 'Search by item or location and narrow your results by category. Open a listing to check its photo, description, and where the item was seen.',
  },
  {
    title: 'Help an item get home',
    description: 'Use “I found this” or “This is mine” on a listing to prepare a return message with the details that can identify the item.',
  },
] as const;

export function AppIntro({ onFinish }: { onFinish: () => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const dark = useColorScheme() === 'dark';
  const { accent, onAccent } = getAccentColors(dark);
  const backgroundColor = dark ? '#0F172A' : '#F8FAFC';
  const textColor = dark ? '#F8FAFC' : '#0F172A';
  const mutedColor = dark ? '#CBD5E1' : '#475569';
  const lastStep = step === steps.length - 1;
  const slide = steps[step];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={dark ? darkLogo : logo}
          style={styles.logo}
          contentFit="contain"
          accessible
          accessibilityLabel="Campus Lost & Found"
        />

        <View style={styles.intro}>
          <Text style={[styles.progressLabel, { color: mutedColor }]}>
            Step {step + 1} of {steps.length}
          </Text>
          <View style={styles.progress} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {steps.map(({ title }, index) => (
              <View
                key={title}
                style={[styles.segment, { backgroundColor: index <= step ? accent : dark ? '#334155' : '#CBD5E1' }]}
              />
            ))}
          </View>
          <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={[styles.title, { color: textColor }]}>
            {slide.title}
          </Text>
          <Text style={[styles.description, { color: mutedColor }]}>{slide.description}</Text>
        </View>

        <View style={styles.actions}>
          {step > 0 && (
            <Pressable
              accessibilityRole="button"
              disabled={finishing}
              onPress={() => setStep((current) => Math.max(0, current - 1))}
              style={styles.back}
            >
              <Text style={[styles.buttonLabel, { color: accent }]}>Back</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: finishing, busy: finishing }}
            disabled={finishing}
            style={[styles.primary, { backgroundColor: accent }]}
            onPress={() => {
              if (!lastStep) {
                setStep((current) => Math.min(current + 1, steps.length - 1));
                return;
              }
              setFinishing(true);
              void onFinish();
            }}
          >
            <Text style={[styles.buttonLabel, { color: onAccent }]}>
              {lastStep ? 'Start using the app' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flexGrow: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 540,
    justifyContent: 'space-between',
    gap: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  logo: { width: 184, height: 184, alignSelf: 'center' },
  intro: { gap: 14 },
  progressLabel: { fontSize: 14, fontWeight: '600' },
  progress: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  title: { fontSize: 34, fontWeight: '800' },
  description: { fontSize: 17, lineHeight: 25 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12 },
  primary: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 26,
  },
  buttonLabel: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
