import {
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  type ImageSourcePropType,
} from 'react-native';

type UserInfoProps = {
  firstName: string;
  image: string;
};

export function UserInfo({ firstName, image }: UserInfoProps) {
  const textColor = useColorScheme() === 'dark' ? '#F1F5F9' : '#0F172A';

  return (
    <View style={styles.row}>
      <Image src={image} style={styles.avatar} resizeMode="cover" />
      <Text numberOfLines={1} style={[styles.name, { color: textColor }]}>
        {firstName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  name: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
