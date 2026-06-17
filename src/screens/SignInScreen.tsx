import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore } from '../store';
import { img } from '../data/images';
import { colors, radii, spacing } from '../theme';

// Screen 16 — "Save your progress." A MOCK sign-in. The Apple/Google buttons do
// NOT perform any real authentication or OAuth — they simply flip the local
// isSignedIn flag and continue. (No credentials are ever collected.)
export function SignInScreen() {
  const { goNext } = useOnboardingNav();
  const setSignedIn = useAppStore((s) => s.setSignedIn);
  const flowers = img('flowers');

  const signIn = () => {
    setSignedIn(true);
    goNext();
  };

  return (
    <OnboardingScreen
      footer={
        <View style={styles.buttons}>
          <Button
            label="Continue with Apple"
            onPress={signIn}
            leftIcon={<Ionicons name="logo-apple" size={20} color={colors.white} />}
          />
          <Button
            label="Continue with Google"
            variant="secondary"
            onPress={signIn}
            leftIcon={<Ionicons name="logo-google" size={18} color={colors.ink} />}
          />
        </View>
      }
    >
      <View style={styles.body}>
        <RichHeadline size={36} align="center" style={styles.headline}>
          {'Save your *progress*'}
        </RichHeadline>

        <View style={styles.imageWrap}>
          {flowers ? (
            <Image source={flowers} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imageFallback]} />
          )}
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    color: colors.ink,
    marginBottom: spacing.xxxl,
  },
  imageWrap: {
    width: 220,
    height: 220,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.disabledBg,
  },
  imageFallback: { backgroundColor: colors.lilac },
  buttons: { gap: spacing.md },
});

export default SignInScreen;
