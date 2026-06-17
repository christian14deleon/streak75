import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from './Button';
import { AppPressable } from './AppPressable';
import { colors, radii, spacing, shadows } from '../theme';
import { fonts } from '../theme/typography';

interface EditTaskModalProps {
  visible: boolean;
  initialText?: string;
  // True when adding a brand-new task (hides the Delete action).
  isNew?: boolean;
  onSave: (text: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

// Bottom-sheet modal for creating or editing a daily task (screen 13). A single
// multiline text field (emoji are typed inline as part of the task text), a
// primary Save, and — when editing an existing task — a destructive Delete.
// Tapping the dimmed backdrop closes without saving. All edits are persisted by
// the caller into the challenge store.
export function EditTaskModal({
  visible,
  initialText = '',
  isNew = false,
  onSave,
  onDelete,
  onClose,
}: EditTaskModalProps) {
  const [text, setText] = useState(initialText);

  // Re-seed the field every time the modal is (re)opened for a given task.
  useEffect(() => {
    if (visible) setText(initialText);
  }, [visible, initialText]);

  const trimmed = text.trim();
  const canSave = trimmed.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop: tapping outside the sheet dismisses. */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}
        >
          {/* Stop propagation so taps inside the sheet don't close it. */}
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handleBar} />
            <Text style={styles.title}>{isNew ? 'New daily task' : 'Edit task'}</Text>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="e.g. Drink ONLY water 💧"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              multiline
              autoFocus
              maxLength={140}
              textAlignVertical="top"
            />

            <Button
              label="Save"
              onPress={() => {
                if (canSave) onSave(trimmed);
              }}
              disabled={!canSave}
            />

            {!isNew && onDelete ? (
              <AppPressable onPress={onDelete} style={styles.delete} hitSlop={6}>
                <Text style={styles.deleteText}>Delete task</Text>
              </AppPressable>
            ) : null}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  kav: { width: '100%' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    paddingBottom: spacing.huge,
    ...shadows.floating,
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.hairline,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.ink,
    marginBottom: 14,
  },
  input: {
    minHeight: 84,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    color: colors.text,
    marginBottom: 18,
  },
  delete: {
    alignSelf: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  deleteText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.blushInk,
  },
});

export default EditTaskModal;
