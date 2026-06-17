import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreen } from './_OnboardingScreen';
import {
  Button,
  OptionCard,
  GradientTile,
  RadioRow,
  type GradientName,
} from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { colors, spacing } from '../theme';

export interface SelectOption {
  label: string;
  imageKey?: string; // for imageGrid
  gradient?: GradientName; // for gradientGrid
  icon?: keyof typeof Ionicons.glyphMap; // leading icon for the list variant
}

interface SingleSelectScreenProps {
  question: string; // rich markup headline
  variant: 'imageGrid' | 'gradientGrid' | 'list';
  options: SelectOption[];
  value: string | null;
  onSelect: (label: string) => void;
}

// Drives the four single-select questionnaire screens (4 Why, 5 Biggest
// challenge, 6 Ideal day, 7 How heard). The three visual variants share one
// behavior: exactly one option may be selected, and "Continue" stays disabled
// until something is chosen — then it advances the flow. The chosen label is
// written to the app store by the parent via onSelect.
export function SingleSelectScreen({
  question,
  variant,
  options,
  value,
  onSelect,
}: SingleSelectScreenProps) {
  const { goNext } = useOnboardingNav();
  const canContinue = value != null;

  return (
    <OnboardingScreen
      scroll
      footer={<Button label="Continue" onPress={goNext} disabled={!canContinue} />}
    >
      <RichHeadline size={30} align="left" style={styles.question}>
        {question}
      </RichHeadline>

      {variant === 'list' ? (
        <View style={styles.list}>
          {options.map((opt) => (
            <RadioRow
              key={opt.label}
              label={opt.label}
              icon={opt.icon}
              selected={value === opt.label}
              onPress={() => onSelect(opt.label)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.grid}>
          {options.map((opt) =>
            variant === 'imageGrid' ? (
              <OptionCard
                key={opt.label}
                label={opt.label}
                imageKey={opt.imageKey}
                selected={value === opt.label}
                onPress={() => onSelect(opt.label)}
                style={styles.gridItem}
              />
            ) : (
              <GradientTile
                key={opt.label}
                label={opt.label}
                gradient={opt.gradient ?? 'sunrise'}
                icon={opt.icon}
                selected={value === opt.label}
                onPress={() => onSelect(opt.label)}
                style={styles.gridItem}
              />
            )
          )}
        </View>
      )}
    </OnboardingScreen>
  );
}

const GRID_GAP = spacing.md;

const styles = StyleSheet.create({
  question: {
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  list: { gap: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: GRID_GAP,
  },
  gridItem: {
    width: '48%',
  },
});

export default SingleSelectScreen;
