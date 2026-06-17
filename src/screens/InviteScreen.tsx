import React from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, CloseButton, Badge, InviteCard } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore } from '../store';
import { COUNTS } from '../data/seed';
import { colors, spacing } from '../theme';

// Screen 20 — "Start the challenge with your friends?" Presented as a modal. The
// invite code is a LOCAL MOCK; "Send invites" opens the OS share sheet with a
// text message (no real invitation is created or transmitted). Every exit path
// — the X, "Start solo", and "Send invites" — records the partner choice and
// then REPLACES this modal with the Select-Challenge screen, so the modal does
// not linger in the back stack.
//
// Note: expo-sharing (a dependency) targets FILE sharing; sharing a plain text
// invite is done with React Native's built-in Share API here. expo-sharing
// remains available for wiring real image/sticker sharing later.
export function InviteScreen() {
  const insets = useSafeAreaInsets();
  const { replaceNext } = useOnboardingNav();
  const setPartnerChoice = useAppStore((s) => s.setPartnerChoice);
  const inviteCode = useAppStore((s) => s.inviteCode);
  const inviterName = useAppStore((s) => s.inviterName);

  const finishSolo = () => {
    setPartnerChoice('solo');
    replaceNext();
  };

  const finishInvited = async () => {
    try {
      await Share.share({
        message: `Join my Streak75 challenge! Use code ${inviteCode} to join me.`,
      });
    } catch {
      /* no-op: sharing is best-effort */
    }
    setPartnerChoice('invited');
    replaceNext();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <View style={styles.spacer} />
        <CloseButton onPress={finishSolo} />
      </View>

      <View style={styles.body}>
        <RichHeadline size={30} align="left" style={styles.headline}>
          {'Start the challenge *with* your friends?'}
        </RichHeadline>

        <Badge
          label={`+${COUNTS.successBoost}% success with friends`}
          tone="black"
          style={styles.badge}
        />

        <View style={styles.cardWrap}>
          <InviteCard inviterName={inviterName} code={inviteCode} />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Send invites" onPress={finishInvited} />
        <Button
          label="Start solo"
          variant="secondary"
          onPress={finishSolo}
          style={styles.soloButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenH,
  },
  spacer: { width: 36 },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenH,
    justifyContent: 'center',
  },
  headline: {
    color: colors.ink,
    marginBottom: spacing.md,
  },
  badge: { marginBottom: spacing.xl },
  cardWrap: { marginTop: spacing.sm },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  soloButton: { marginTop: 0 },
});

export default InviteScreen;
