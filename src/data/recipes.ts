import type { Recipe, CarbonLevel } from './types';

/**
 * 计算食谱总碳排放 (kg CO2e)
 * 基于各食材的碳排放因子 × 用量
 */
export function calculateCO2(
  ingredients: { carbonPerKg: number; amount: number }[]
): number {
  return ingredients.reduce(
    (sum, ing) => sum + (ing.carbonPerKg * ing.amount) / 1000,
    0
  );
}

/** 根据碳排放量判定等级 */
export function getCarbonLevel(co2: number): CarbonLevel {
  if (co2 <= 1) return 'low';
  if (co2 <= 3) return 'medium';
  if (co2 <= 6) return 'high';
  return 'very-high';
}

/** 碳等级对应的中文标签 */
export function getCarbonLabel(level: CarbonLevel): string {
  const labels: Record<CarbonLevel, string> = {
    low: '低碳',
    medium: '中碳',
    high: '高碳',
    'very-high': '极高碳',
  };
  return labels[level];
}

/** 碳等级对应的颜色 */
export function getCarbonColor(level: CarbonLevel): string {
  const colors: Record<CarbonLevel, string> = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#FF9800',
    'very-high': '#F44336',
  };
  return colors[level];
}

/** 计算替换为低碳版后节省的碳排放 (kg CO2e) */
export function calculateSavings(original: Recipe): number {
  return Math.round((original.co2 - original.alternative.co2) * 10) / 10;
}

/** 餐次中文标签 */
export function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
  };
  return labels[type] || type;
}
