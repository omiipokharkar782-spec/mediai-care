import { useState } from 'react';
import { StyleSheet, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, componentTokens, motion, typeStyle } from '../theme';
import { Text } from './Text';

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  error?: string | null;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  maxLength,
  error,
}: Props) {
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => ({
    borderColor: focus.value ? colors.primary.blue : colors.surface.border,
    shadowOpacity: withTiming(focus.value ? 0.25 : 0, { duration: motion.duration.fast }),
  }));

  return (
    <View style={styles.wrapper}>
      <Text variant="caption" tone={focused ? 'brand' : 'secondary'}>
        {label}
      </Text>
      <Animated.View style={[styles.field, ringStyle, !!error && styles.fieldError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => {
            setFocused(true);
            focus.value = 1;
          }}
          onBlur={() => {
            setFocused(false);
            focus.value = 0;
          }}
          style={[typeStyle('body'), styles.input]}
        />
      </Animated.View>
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  field: {
    height: componentTokens.input.height,
    borderRadius: componentTokens.input.radius,
    borderWidth: 1.5,
    backgroundColor: colors.surface.base,
    justifyContent: 'center',
    paddingHorizontal: 14,
    shadowColor: colors.primary.blue,
    shadowRadius: componentTokens.input.focusRingWidth * 2,
    shadowOffset: { width: 0, height: 0 },
  },
  fieldError: { borderColor: colors.status.danger },
  input: { color: colors.text.primary, padding: 0 },
});
