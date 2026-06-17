import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingHeader } from '../components';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { colors, spacing } from '../theme';

interface OnboardingScreenProps {
  children: React.ReactNode;
  // Pinned bottom area (typically the primary CTA). Sits above the safe inset.
  footer?: React.ReactNode;
  // Scroll the content area (for longer questionnaire screens).
  scroll?: boolean;
  // Hide the top header entirely (rare; most onboarding screens show it).
  showHeader?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  // Override the header config derived from the current step (rarely needed).
  showBackOverride?: boolean;
  showProgressOverride?: boolean;
}

// Shared layout for onboarding screens: a safe-area container, the standard
// OnboardingHeader (back button + centered progress pill, both derived from the
// current step via useOnboardingNav), a content region, and an optional pinned
// footer for the CTA. Centralizing this keeps all 18 chrome-bearing screens
// visually consistent and tiny.
export function OnboardingScreen({
  children,
  footer,
  scroll = false,
  showHeader = true,
  contentStyle,
  showBackOverride,
  showProgressOverride,
}: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { showBack, showProgress, progress, goBack } = useOnboardingNav();

  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? {
        style: styles.scrollOuter,
        contentContainerStyle: [styles.scrollContent, contentStyle],
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled' as const,
      }
    : { style: [styles.content, contentStyle] as StyleProp<ViewStyle> };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      {showHeader ? (
        <OnboardingHeader
          showBack={showBackOverride ?? showBack}
          onBack={goBack}
          showProgress={showProgressOverride ?? showProgress}
          progress={progress}
        />
      ) : null}

      <Body {...(bodyProps as any)}>{children}</Body>

      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenH,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: spacing.xl,
  },
  scrollOuter: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
  },
});

export default OnboardingScreen;
