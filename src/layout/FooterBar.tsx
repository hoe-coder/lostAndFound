import { Link } from 'expo-router';
import { Children, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../components/BrandLogo';
import { getAccentColors } from '../theme/colors';

type FooterBarProps = {
  heading: string;
  children: ReactNode;
};

export function FooterBar({ heading, children }: FooterBarProps) {
  const dark = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[
        styles.footer,
        {
          backgroundColor: dark ? '#0F172A' : '#FFFFFF',
          borderBottomColor: dark ? '#334155' : '#E2E8F0',
          borderTopWidth: 1,
        },
      ]}
    >
      <View style={styles.brand}>
        <BrandLogo label={heading} />
      </View>

      <View style={styles.links}>
        {Children.map(children, (child) =>
          child == null ? null : <View style={styles.linkCell}>{child}</View>,
        )}
      </View>
    </SafeAreaView>
  );
}

export function AppFooter() {
  const { accent } = getAccentColors(useColorScheme() === 'dark');
  const links = [
    { title: 'Home', href: '/' },
    { title: 'Found Items', href: '/found' },
    { title: 'Lost Items', href: '/lost' },
    { title: 'Profile', href: '/profile' },
  ] as const;

  return (
    <FooterBar heading="Lost & Found">
      {links.map(({ title, href }) => (
        <Link key={href} href={href} asChild>
          <Pressable accessibilityRole="link" style={styles.link}>
            <Text style={[styles.linkLabel, { color: accent }]}>{title}</Text>
          </Pressable>
        </Link>
      ))}
    </FooterBar>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
  },
  brand: {
    alignItems: 'center',
    paddingTop: 6,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  link: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkLabel: {
    fontSize: 16,
  },
  linkCell: {
    width: '50%',
    minHeight: 44,
    justifyContent: 'center',
  },
});
