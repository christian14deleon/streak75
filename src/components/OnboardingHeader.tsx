import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BackButton } from './BackButton';
import { ProgressBar } from './ProgressBar';
import { spacing, sizes } from '../theme';

interface OnboardingHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  showProgress?: boolean;
  progress?: number; // 0..1
}

// Standard onboarding top bar: circular back button pinned left, thin progress
// pill centered. The progress pill is only rendered on questionnaire screens
// (callers pass showProgress). The back button slot is always reserved so the
// progress pill stays centered whether or not back is shown.
export function OnboardingHeader({
  showBack = true,
  onBack,
  showProgress = false,
  progress = 0,
}: OnboardingHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack && onBack ? <BackButton onPress={onBack} /> : null}
      </View>
      <View style={styles.center}>
        {showProgress ? <ProgressBar progress={progress} width={180} /> : null}
      </View>
      {/* Right spacer to balance the back button so the pill is truly centered. */}
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizes.backButton,
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.sm,
  },
  side: {
    width: sizes.backButton,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingHeader;
