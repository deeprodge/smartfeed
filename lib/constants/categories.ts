export const CATEGORIES = {
  LEARN: 'learn',
  PLAN: 'plan',
  IDEATE: 'ideate',
  COOK: 'cook',
  SHOP: 'shop',
} as const;

export const CATEGORY_LABELS = {
  [CATEGORIES.LEARN]: 'Learn',
  [CATEGORIES.PLAN]: 'Plan',
  [CATEGORIES.IDEATE]: 'Ideate',
  [CATEGORIES.COOK]: 'Cook',
  [CATEGORIES.SHOP]: 'Shop',
} as const;

export const CATEGORY_COLORS = {
  [CATEGORIES.LEARN]: '#3B82F6', // blue
  [CATEGORIES.PLAN]: '#10B981', // green
  [CATEGORIES.IDEATE]: '#8B5CF6', // purple
  [CATEGORIES.COOK]: '#F59E0B', // amber
  [CATEGORIES.SHOP]: '#EF4444', // red
} as const;

export const CATEGORY_DESCRIPTIONS = {
  [CATEGORIES.LEARN]: 'Educational content, tutorials, and learning resources',
  [CATEGORIES.PLAN]: 'Planning guides, how-to content, and project resources',
  [CATEGORIES.IDEATE]: 'Creative inspiration, brainstorming, and idea generation',
  [CATEGORIES.COOK]: 'Recipes, cooking tips, and food-related content',
  [CATEGORIES.SHOP]: 'Product reviews, shopping guides, and recommendations',
} as const;

export type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES]; 