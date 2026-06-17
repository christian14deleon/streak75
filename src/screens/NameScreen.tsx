import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore } from '../store';
import { colors, radii, sizes, spacing } from '../theme';
import { fonts } from '../theme/typography';

// Screen 3 — "What's your name?" A single rounded text field bound to the app
// store. "Continue" stays disabled until the trimmed name is non-empty. The
// field autofocuses so the keyboard is ready immediately.
export function NameScreen() {
  const { goNext } = useOnboardingNav();
  const name = useAppStore((s) => s.name);
  const setName = useAppStore((s) => s.setName);

  const canContinue = name.trim().length > 0;

  return (
    <OnboardingScreen
      footer={<Button label="Continue" onPress={goNext} disabled={!canContinue} />}
    >
      <Ionicons
        name="person-circle-outline"
        size={44}
        color={colors.ink}
        style={styles.icon}
      />
      <RichHeadline size={32} align="left" style={styles.question}>
        {"What's your name?"}
      </RichHeadline>

      <View>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          autoFocus
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={40}
          onSubmitEditing={() => {
            if (canContinue) goNext();
          }}
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  question: {
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  input: {
    height: sizes.inputHeight,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    fontFamily: fonts.sansMedium,
    fontSize: 17,
    color: colors.text,
  },
});

export default NameScreen;
