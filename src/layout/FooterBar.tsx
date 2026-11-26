import { useRouter } from 'expo-router';
import { Children, type ReactNode } from 'react';
import { Button, Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../components/BrandLogo';
import { brandAccent, brandAccentOnDark } from '../theme/colors';

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
  const router = useRouter();
  const dark = useColorScheme() === 'dark';
  const footerButtonColor = dark && Platform.OS !== 'android' ? brandAccentOnDark : brandAccent;

  return (
    <FooterBar heading="Lost & Found">
      <Button color={footerButtonColor} title="Home" onPress={() => router.navigate('/')} />
      <Button color={footerButtonColor} title="Found Items" onPress={() => router.navigate('/found')} />
      <Button color={footerButtonColor} title="Lost Items" onPress={() => router.navigate('/lost')} />
      <Button color={footerButtonColor} title="Profile" onPress={() => router.navigate('/profile')} />
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
  linkCell: {
    width: '50%',
    minHeight: 44,
    justifyContent: 'center',
  },
});
