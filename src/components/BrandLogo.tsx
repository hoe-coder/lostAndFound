import { Image } from 'expo-image';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { brandAccentOnDark } from '../theme/colors';

const logo = require('../../assets/logo.svg');
const darkLogoColors = { '--wordmark': '#F8FAFC', '--logo-purple': brandAccentOnDark };

export function BrandLogo({ label }: { label?: string }) {
  const dark = useColorScheme() === 'dark';

  return (
    <View style={styles.surface}>
      <View style={styles.crop}>
        <Image
          source={logo}
          contentFit="contain"
          svgVariables={dark ? darkLogoColors : undefined}
          accessible={!!label}
          accessibilityLabel={label}
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 4,
  },
  // Crop the transparent margins of the 312 × 384 SVG to keep the visible logo compact.
  crop: {
    width: 74,
    height: 70,
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: -18,
    left: -6,
    width: 84,
    height: 103.4,
  },
});
