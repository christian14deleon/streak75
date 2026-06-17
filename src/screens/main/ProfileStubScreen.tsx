import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppPressable } from '../../components';
import { useAppStore, useChallengeStore, resetAllStores } from '../../store';
import { PLANS } from '../../data/plans';
import { img } from '../../data/images';
import {
  startOfDay,
  fromDateString,
  dayNumber,
  formatLong,
} from '../../utils/dateUtils';
import { colors, radii, spacing, shadows } from '../../theme';
import { fonts } from '../../theme/typography';

// Profile tab — a friendly summary placeholder. Surfaces the locally-stored
// profile + challenge configuration (name, plan, partner choice, the inclusive
// date range, current day) and offers a "Start over" reset that clears both
// persisted stores. After reset, onboardingComplete flips back to false and the
// root navigator returns to onboarding.
export function ProfileStubScreen() {
  const insets = useSafeAreaInsets();

  const name = useAppStore((s) => s.name);
  const selectedPlan = useAppStore((s) => s.selectedPlan);
  const partnerChoice = useAppStore((s) => s.partnerChoice);

  const selectedChallengeName = useChallengeStore((s) => s.selectedChallengeName);
  const startDate = useChallengeStore((s) => s.startDate);
  const durationDays = useChallengeStore((s) => s.durationDays);

  const today = useMemo(() => startOfDay(new Date()), []);
  const start = fromDateString(startDate);
  const dayN = dayNumber(start, today);
  const planTitle = PLANS.find((p) => p.id === selectedPlan)?.title ?? selectedPlan;
  const partnerLabel =
    partnerChoice === 'invited' ? 'With friends' : partnerChoice === 'solo' ? 'Solo' : 'Not set';

  const confirmReset = () => {
    Alert.alert(
      'Start over?',
      'This clears your progress and challenge setup on this device and returns to onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start over', style: 'destructive', onPress: () => resetAllStores() },
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxxl }]}
      >
        <View style={styles.avatarRow}>
          {img('avatar_you') ? (
            <Image source={img('avatar_you')} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={32} color={colors.white} />
            </View>
          )}
        </View>
        <Text style={styles.title}>{name ? name : 'Your profile'}</Text>
        <Text style={styles.sub}>{`Day ${dayN} of your challenge`}</Text>

        <View style={[styles.card, shadows.soft]}>
          <Row icon="flame-outline" label="Challenge" value={selectedChallengeName} />
          <Divider />
          <Row icon="calendar-outline" label="Dates" value={formatLong(start, durationDays)} />
          <Divider />
          <Row icon="time-outline" label="Length" value={`${durationDays} days`} />
          <Divider />
          <Row icon="card-outline" label="Plan" value={planTitle} />
          <Divider />
          <Row icon="people-outline" label="Partner" value={partnerLabel} />
        </View>

        <AppPressable onPress={confirmReset} style={[styles.resetBtn, shadows.soft]}>
          <Ionicons name="refresh" size={18} color={colors.blushInk} />
          <Text style={styles.resetText}>Start over</Text>
        </AppPressable>
      </ScrollView>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.rowIcon} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  scroll: { paddingHorizontal: spacing.screenH },
  avatarRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.disabledBg,
  },
  avatarFallback: {
    backgroundColor: colors.lilac,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.ink,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 10,
  },
  rowLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.textMuted,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  resetText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.blushInk,
  },
});

export default ProfileStubScreen;
