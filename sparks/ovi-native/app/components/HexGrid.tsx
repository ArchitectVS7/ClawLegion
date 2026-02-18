/**
 * HexGrid.tsx — Cyberscape hex visualization for OVI
 *
 * Synthwave/cyberpunk RTS-style hexagonal terrain.
 * Each hex = a module/directory. Agent activity = animated pulse.
 *
 * Proto v1: React Native View + Animated, zero external deps.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { HexCell } from '../types/hex';

// ─── Layout constants ────────────────────────────────────────────────────────

const HEX_SIZE = 48;          // "radius" — center to vertex
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const COLS = 4;

// Flat-top hex offset layout
// col offset: HEX_WIDTH * 0.75 per column
// row offset: HEX_HEIGHT per row, shifted by HEX_HEIGHT/2 on odd cols
function hexPosition(index: number): { x: number; y: number } {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const x = col * HEX_WIDTH * 0.75;
  const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
  return { x, y };
}

// ─── Color palette ───────────────────────────────────────────────────────────

const COLORS = {
  idle:        '#1a1a28',
  idleBorder:  '#2e2e4a',
  active:      '#7c5cfc',
  activeBorder:'#a88eff',
  error:       '#fc5c5c',
  errorBorder: '#ff8e8e',
  text:        '#e0d8ff',
  textDim:     '#7a7aaa',
  badge:       '#0d0d1a',
  bg:          '#0a0a14',
} as const;

// ─── Hex clip-path via borderRadius trick ────────────────────────────────────
// True CSS clip-path hexagons aren't available in RN.
// We approximate with heavily rounded rectangles + a rotated diamond overlay,
// but the cleanest approach for proto is a rotated square (diamond) which reads
// as a hex tile in the synthwave aesthetic. We use borderRadius for the pill.

const HEX_CLIP_RADIUS = HEX_SIZE * 0.3;

// ─── Animated single hex cell ────────────────────────────────────────────────

interface HexTileProps {
  hex: HexCell;
  index: number;
  onSelect: (hex: HexCell) => void;
}

const HexTile: React.FC<HexTileProps> = ({ hex, index, onSelect }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hex.status === 'active') {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.08,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 900,
              useNativeDriver: false,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 900,
              useNativeDriver: false,
            }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [hex.status, pulseAnim, glowAnim]);

  const pos = hexPosition(index);

  const baseColor   = COLORS[hex.status];
  const borderColor = hex.status === 'active'
    ? COLORS.activeBorder
    : hex.status === 'error'
    ? COLORS.errorBorder
    : COLORS.idleBorder;

  // Interpolate border glow for active state
  const animatedBorderColor = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [COLORS.activeBorder, '#c4b0ff'],
  });

  const handlePress = useCallback(() => {
    onSelect(hex);
  }, [hex, onSelect]);

  return (
    <Animated.View
      style={[
        styles.hexOuter,
        {
          left: pos.x,
          top:  pos.y,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.75}
        style={[
          styles.hexInner,
          { backgroundColor: baseColor },
          hex.status !== 'active' && { borderColor },
        ]}
      >
        {/* Active glow border via animated overlay */}
        {hex.status === 'active' && (
          <Animated.View
            style={[
              styles.glowBorder,
              { borderColor: animatedBorderColor },
            ]}
          />
        )}

        {/* Hex label */}
        <Text style={styles.hexLabel} numberOfLines={1}>
          {hex.label}
        </Text>

        {/* Agent count badge */}
        {hex.agentCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{hex.agentCount}</Text>
          </View>
        )}

        {/* Status dot */}
        <View style={[styles.statusDot, { backgroundColor: baseColor === COLORS.idle ? COLORS.idleBorder : baseColor }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── HexGrid ─────────────────────────────────────────────────────────────────

export interface HexGridProps {
  hexes: HexCell[];
  onSelect: (hex: HexCell) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HexGrid: React.FC<HexGridProps> = ({ hexes, onSelect }) => {
  const rows = Math.ceil(hexes.length / COLS);
  const gridWidth  = COLS * HEX_WIDTH * 0.75 + HEX_WIDTH * 0.25;
  const gridHeight = rows * HEX_HEIGHT + HEX_HEIGHT / 2;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.grid, { width: gridWidth, height: gridHeight }]}>
        {hexes.map((hex, i) => (
          <HexTile
            key={hex.id}
            hex={hex}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  grid: {
    position: 'relative',
  },
  hexOuter: {
    position: 'absolute',
    width:  HEX_WIDTH,
    height: HEX_HEIGHT,
  },
  hexInner: {
    flex: 1,
    borderRadius: HEX_CLIP_RADIUS,
    borderWidth: 1.5,
    borderColor: COLORS.idleBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: HEX_CLIP_RADIUS,
    borderWidth: 1.5,
  },
  hexLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: COLORS.badge,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: COLORS.activeBorder,
  },
  badgeText: {
    color: COLORS.activeBorder,
    fontSize: 9,
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 8,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});

export default HexGrid;
