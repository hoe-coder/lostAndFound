import { brandAccent, brandAccentOnDark } from '../theme/colors';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';

type SearchBarProps = {
  action?: () => void;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ action, placeholder, value, onChangeText }: SearchBarProps) {
  const dark = useColorScheme() === 'dark';
  const hintColor = dark ? '#A3A3A3' : '#475569';

  return (
    <View
      style={[
        styles.field,
        {
          backgroundColor: dark ? '#202020' : '#FFFFFF',
          borderColor: dark ? '#454545' : '#CBD5E1',
        },
      ]}
    >
      <View pointerEvents="none" importantForAccessibility="no" style={styles.icon}>
        <View style={[styles.lens, { borderColor: hintColor }]} />
        <View style={[styles.handle, { backgroundColor: hintColor }]} />
      </View>
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={hintColor}
        selectionColor={dark ? brandAccentOnDark : brandAccent}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={action}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={[styles.input, { color: dark ? '#F1F5F9' : '#0F172A' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 16,
  },
  icon: {
    width: 18,
    height: 18,
  },
  lens: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  handle: {
    position: 'relative',
    left: 10,
    top: 12,
    width: 7,
    height: 1.5,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
});
