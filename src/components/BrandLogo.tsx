import { Image } from 'expo-image';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { brandAccentOnDark } from '../theme/colors';

const logo = require('../../assets/logo.svg');
const darkLogoColors = { '--logo-purple': brandAccentOnDark };

export function BrandLogo({ label }: { label?: string }) {
  const dark = useColorScheme() === 'dark';

  return (
    <View style={styles.surface}>
      <Image
        source={logo}
        contentFit="contain"
        svgVariables={dark ? darkLogoColors : undefined}
        accessible={!!label}
        accessibilityLabel={label}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 4,
  },
  image: {
    width: 34,
    height: 36,
  },
});
