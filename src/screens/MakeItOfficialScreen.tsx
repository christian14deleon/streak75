import React from 'react';
import { View, Text, ScrollView, StyleSheet, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ShareStoryFrame, AppPressable } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore } from '../store';
import { colors, spacing } from '../theme';
import { fonts } from '../theme/typography';

// Screen 23 — "Make it official." The final onboarding step. A faux IG-story
// frame (with the DayOneCard sticker) previews what gets shared. "Get my
// sticker" opens the OS share sheet with a text message (best-effort; expo-
// sharing is reserved for real image sharing later) and records sharedSticker;
// "Skip" just continues. Because this is the LAST step, goNext() finishes
// onboarding (sets onboardingComplete), and the root navigator swaps to the
// main app. Nothing is actually posted to any social network.
export function MakeItOfficialScreen() {
  const insets = useSafeAreaInsets();
  const { goNext } = useOnboardingNav();
  const setSharedSticker = useAppStore((s) => s.setSharedSticker);

  const onGetSticker = async () => {
    try {
      await Share.share({ message: 'Day 1 of my Streak75 challenge 🌅 #streak75' });
    } catch {
      /* best-effort */
    }
    setSharedSticker(true);
    goNext();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <RichHeadline size={38} align="center" style={styles.headline}>
          {'Make *it* official'}
        </RichHeadline>

        <ShareStoryFrame style={styles.frame} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Get my sticker" onPress={onGetSticker} />
        <AppPressable onPress={goNext} style={styles.skip} hitSlop={8} soundOnPress={false}>
          <Text style={styles.skipText}>Skip</Text>
        </AppPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  headline: {
    color: colors.ink,
    marginBottom: spacing.xl,
  },
  frame: {
    width: 236,
  },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  skip: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  skipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});

export default MakeItOfficialScreen;
