import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import DragList, { type DragListRenderItemInfo } from 'react-native-draglist';
import {
  Button,
  BackButton,
  Badge,
  StickyTaskRow,
  EditTaskModal,
  ReviewCard,
  AppPressable,
} from '../components';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore, useChallengeStore } from '../store';
import { CHALLENGE_TEMPLATES } from '../data/challenges';
import { REVIEWS, formatJoined } from '../data/seed';
import { colors, radii, spacing } from '../theme';
import { fonts } from '../theme/typography';
import type { Task } from '../types';
import type { OnboardingStackParamList } from '../navigation/types';

type EditState =
  | { mode: 'closed' }
  | { mode: 'new' }
  | { mode: 'edit'; id: string; text: string };

// Screen 13 — the task editor. A drag-to-reorder list of sticky task rows backed
// by the challenge store (so every edit, add, delete, and reorder persists and
// is reflected in the DayOneCard and the Today screen). Tapping a row's pencil
// opens the edit modal; the dashed "Create Daily Task" button opens it in
// add mode. Below the list is a horizontal rail of reviews.
//
// This screen is mounted in BOTH navigators. In onboarding, "Validate" advances
// the flow; when opened from the main app (route param `fromMain`), it instead
// pops back. The back button always dismisses the current screen, which is the
// correct behavior in both contexts.
export function TaskEditorScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<OnboardingStackParamList, 'TaskEditor'>>();
  const fromMain = route.params?.fromMain === true;
  const onboardingNav = useOnboardingNav();

  const tasks = useChallengeStore((s) => s.tasks);
  const selectedChallengeName = useChallengeStore((s) => s.selectedChallengeName);
  const addTask = useChallengeStore((s) => s.addTask);
  const updateTask = useChallengeStore((s) => s.updateTask);
  const removeTask = useChallengeStore((s) => s.removeTask);
  const reorderTasks = useChallengeStore((s) => s.reorderTasks);

  const [edit, setEdit] = useState<EditState>({ mode: 'closed' });

  // Look up the "+N joined" count from the matching template (custom challenges
  // won't match and simply show no pill).
  const joined = CHALLENGE_TEMPLATES.find((t) => t.name === selectedChallengeName)?.joined;

  // We are in the main app whenever onboarding is already complete — the root
  // navigator only mounts the main stack in that case, and that stack has no
  // onboarding screens to advance to. Reading the persisted flag is reliable
  // across nested navigators (the route param can be missing). So Validate
  // closes the editor in the main app, and only advances the flow during
  // onboarding. fromMain is kept as an extra safety signal.
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  // Close the editor safely. If there's a screen to return to, pop it; if not
  // (e.g. after a reset left the editor as the only screen), go to the Today tab
  // instead of firing a no-op GO_BACK that React Navigation would warn about.
  const closeEditor = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (onboardingComplete || fromMain) {
      // Main app with nothing to pop — land on the Today tab.
      navigation.navigate('Tabs');
    }
    // Onboarding with nothing behind (shouldn't happen): do nothing, no crash.
  };

  const onValidate = () => {
    if (onboardingComplete || fromMain) closeEditor();
    else onboardingNav.goNext();
  };

  const renderItem = useCallback(
    (info: DragListRenderItemInfo<Task>) => {
      const { item, index, onDragStart, onDragEnd, isActive } = info;
      return (
        <StickyTaskRow
          task={item}
          number={index + 1}
          isActive={isActive}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onEditPress={() => setEdit({ mode: 'edit', id: item.id, text: item.text })}
        />
      );
    },
    []
  );

  const Header = (
    <View style={styles.header}>
      <Text style={styles.title}>{selectedChallengeName}</Text>
      {typeof joined === 'number' ? (
        <Badge label={`${formatJoined(joined)} joined`} tone="white" small style={styles.joinedPill} />
      ) : null}

      <AppPressable
        onPress={() => setEdit({ mode: 'new' })}
        style={styles.ghostAdd}
      >
        <Text style={styles.ghostAddText}>Create Daily Task</Text>
        <Text style={styles.ghostPlus}>+</Text>
      </AppPressable>
    </View>
  );

  const Footer = (
    <View style={styles.reviewsBlock}>
      <Text style={styles.reviewsTitle}>What people say</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewsRow}
      >
        {REVIEWS.map((r) => (
          <ReviewCard key={r.id} review={r} style={styles.reviewCard} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topBar}>
        <BackButton onPress={closeEditor} />
      </View>

      <DragList
        data={tasks}
        keyExtractor={(t: Task) => t.id}
        onReordered={(from: number, to: number) => reorderTasks(from, to)}
        renderItem={renderItem}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        ListEmptyComponent={
          <Text style={styles.emptyHint}>
            No tasks yet — tap “Create Daily Task” to add your first one.
          </Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footerBar, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Validate" onPress={onValidate} />
      </View>

      <EditTaskModal
        visible={edit.mode !== 'closed'}
        isNew={edit.mode === 'new'}
        initialText={edit.mode === 'edit' ? edit.text : ''}
        onSave={(text) => {
          if (edit.mode === 'new') addTask(text);
          else if (edit.mode === 'edit') updateTask(edit.id, { text });
          setEdit({ mode: 'closed' });
        }}
        onDelete={
          edit.mode === 'edit'
            ? () => {
                removeTask(edit.id);
                setEdit({ mode: 'closed' });
              }
            : undefined
        }
        onClose={() => setEdit({ mode: 'closed' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: 120, // room above the pinned Validate bar
  },
  header: { marginBottom: spacing.md },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.ink,
  },
  joinedPill: { marginTop: spacing.sm },
  ghostAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: 16,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  ghostAddText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.textMuted,
  },
  ghostPlus: {
    fontFamily: fonts.sansMedium,
    fontSize: 20,
    color: colors.textMuted,
    marginLeft: 8,
  },
  emptyHint: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  reviewsBlock: { marginTop: spacing.lg },
  reviewsTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  reviewsRow: { paddingRight: spacing.screenH, gap: spacing.md },
  reviewCard: { marginRight: 0 },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});

export default TaskEditorScreen;
