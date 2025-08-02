export const PLATFORMS = {
  X: 'x',
  YOUTUBE: 'youtube',
} as const;

export const PLATFORM_LABELS = {
  [PLATFORMS.X]: 'X (Twitter)',
  [PLATFORMS.YOUTUBE]: 'YouTube',
} as const;

export const PLATFORM_ICONS = {
  [PLATFORMS.X]: '🐦',
  [PLATFORMS.YOUTUBE]: '📺',
} as const;

export const PLATFORM_COLORS = {
  [PLATFORMS.X]: '#1DA1F2',
  [PLATFORMS.YOUTUBE]: '#FF0000',
} as const;

export type PlatformType = typeof PLATFORMS[keyof typeof PLATFORMS]; 