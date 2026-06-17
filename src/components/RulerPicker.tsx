import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme';
import { useSound } from '../sound/SoundProvider';

const ITEM_WIDTH = 14; // horizontal px per tick/step
const TRACK_HEIGHT = 88;

interface RulerPickerProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  // Optional renderers for the value pill (above) and derived line (below).
  renderValuePill?: (value: number) => React.ReactNode;
  renderDerived?: (value: number) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// A horizontally draggable ruler. The content is padded on both sides by half
// the visible width so the first and last ticks can scroll under the fixed
// center indicator. Scrolling snaps to ticks (snapToInterval) and each time the
// centered index changes we emit onChange + a selection haptic. Selection ticks
// give the scrub the tactile feel from the spec.
export function RulerPicker({
  min,
  max,
  step = 1,
  value,
  onChange,
  renderValuePill,
  renderDerived,
  style,
}: RulerPickerProps) {
  const { selectionTick } = useSound();
  const scrollRef = useRef<ScrollView>(null);
  const draggingRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const count = Math.max(1, Math.floor((max - min) / step) + 1);
  const ticks = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(count - 1, i)),
    [count]
  );

  const indexFromValue = clampIndex(Math.round((value - min) / step));
  const [index, setIndex] = useState(indexFromValue);
  const [trackWidth, setTrackWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const sidePad = trackWidth > 0 ? trackWidth / 2 - ITEM_WIDTH / 2 : 0;

  const scrollToIndex = useCallback(
    (i: number, animated: boolean) => {
      scrollRef.current?.scrollTo({ x: i * ITEM_WIDTH, animated });
    },
    []
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      setTrackWidth(w);
    },
    []
  );

  // Once we know the width, jump (no animation) to the current value's tick.
  useEffect(() => {
    if (trackWidth > 0 && !ready) {
      // Defer to next frame so contentContainer padding is applied first.
      const id = requestAnimationFrame(() => {
        scrollToIndex(indexFromValue, false);
        setReady(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [trackWidth, ready, indexFromValue, scrollToIndex]);

  // Sync to an EXTERNAL value change (rare — e.g. programmatic reset). Skipped
  // while the user is dragging, and a no-op when the value already matches the
  // centered index (which is the case for scroll-originated changes), so there
  // is no scroll/update feedback loop.
  useEffect(() => {
    if (ready && !draggingRef.current && indexFromValue !== index) {
      setIndex(indexFromValue);
      scrollToIndex(indexFromValue, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexFromValue]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = clampIndex(Math.round(x / ITEM_WIDTH));
      if (idx !== index) {
        setIndex(idx);
        selectionTick();
        onChangeRef.current(min + idx * step);
      }
    },
    [clampIndex, index, min, step, selectionTick]
  );

  const currentValue = min + index * step;

  return (
    <View style={style}>
      {renderValuePill ? (
        <View style={styles.pillWrap}>{renderValuePill(currentValue)}</View>
      ) : null}

      <View style={styles.trackWrap} onLayout={onLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onScrollBeginDrag={() => {
            draggingRef.current = true;
          }}
          onScrollEndDrag={() => {
            draggingRef.current = false;
          }}
          onMomentumScrollEnd={() => {
            draggingRef.current = false;
          }}
          contentContainerStyle={{ paddingHorizontal: sidePad }}
        >
          {ticks.map((i) => {
            const major = i % 5 === 0;
            return (
              <View key={i} style={styles.tickSlot}>
                <View
                  style={[
                    styles.tick,
                    major ? styles.tickMajor : styles.tickMinor,
                  ]}
                />
              </View>
            );
          })}
        </ScrollView>

        {/* Fixed center indicator. */}
        <View pointerEvents="none" style={styles.centerWrap}>
          <View style={styles.centerTriangle} />
          <View style={styles.centerLine} />
        </View>
      </View>

      {renderDerived ? (
        <View style={styles.derivedWrap}>{renderDerived(currentValue)}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pillWrap: { alignItems: 'center', marginBottom: 18 },
  trackWrap: {
    height: TRACK_HEIGHT,
    justifyContent: 'center',
  },
  tickSlot: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: TRACK_HEIGHT,
  },
  tick: {
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.hairline,
  },
  tickMinor: { height: 22 },
  tickMajor: { height: 40, backgroundColor: colors.textMuted },
  centerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.ink,
    marginBottom: 2,
  },
  centerLine: {
    width: 3,
    height: 52,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
  derivedWrap: { alignItems: 'center', marginTop: 18 },
});

export default RulerPicker;
