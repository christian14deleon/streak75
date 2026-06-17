import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button, FriendCard } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { FRIENDS } from '../data/seed';
import { colors, spacing } from '../theme';

// Screen 8 — social proof. A fanned deck of friends' progress cards under the
// headline. Purely display: it just previews what friends' checklists look
// like. "Continue" advances.
export function FriendsTasksScreen() {
  const { goNext } = useOnboardingNav();

  // Fan transforms for the (up to) three seeded friend cards.
  const fan = [
    { rotate: '-6deg', translateX: -14, top: 0, zIndex: 1 },
    { rotate: '4deg', translateX: 16, top: 96, zIndex: 2 },
    { rotate: '-2deg', translateX: -6, top: 196, zIndex: 3 },
  ];

  return (
    <OnboardingScreen
      scroll
      footer={<Button label="Continue" onPress={goNext} />}
    >
      <RichHeadline size={30} align="left" style={styles.headline}>
        {"**See** your friends' tasks and *aesthetic*."}
      </RichHeadline>

      <View style={styles.deck}>
        {FRIENDS.slice(0, 3).map((friend, i) => (
          <View
            key={friend.id}
            style={[
              styles.cardSlot,
              {
                top: fan[i].top,
                zIndex: fan[i].zIndex,
                transform: [{ translateX: fan[i].translateX }, { rotate: fan[i].rotate }],
              },
            ]}
          >
            <FriendCard friend={friend} />
          </View>
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  headline: {
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  // Fixed-height stage for the absolutely-fanned cards.
  deck: {
    height: 420,
    alignItems: 'center',
  },
  cardSlot: {
    position: 'absolute',
  },
});

export default FriendsTasksScreen;
