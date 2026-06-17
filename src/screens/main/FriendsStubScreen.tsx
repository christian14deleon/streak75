import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FriendCard } from '../../components';
import { FRIENDS } from '../../data/seed';
import { colors, spacing } from '../../theme';
import { fonts } from '../../theme/typography';

// Friends tab — a friendly placeholder. The social graph is out of scope for
// this front-end clone (no backend), so this previews the "circle" concept with
// the same seeded friend cards used during onboarding.
export function FriendsStubScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxxl }]}
      >
        <View style={styles.titleRow}>
          <Ionicons name="people" size={26} color={colors.ink} />
          <Text style={styles.title}>Your circle</Text>
        </View>
        <Text style={styles.sub}>
          See how everyone’s challenge is going. (Social features are a preview in
          this build.)
        </Text>

        <View style={styles.list}>
          {FRIENDS.map((friend) => (
            <FriendCard key={friend.id} friend={friend} style={styles.card} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  scroll: { paddingHorizontal: spacing.screenH, alignItems: 'center' },
  titleRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.sm,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.ink,
  },
  sub: {
    alignSelf: 'flex-start',
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  list: { alignSelf: 'stretch', gap: spacing.lg, alignItems: 'center' },
  card: { width: '100%', maxWidth: 360 },
});

export default FriendsStubScreen;
