/** 食材信息 */
export interface Ingredient {
  name: string;
  /** 每 kg 碳排放量 (kg CO2e/kg) */
  carbonPerKg: number;
  /** 用量 (克) */
  amount: number;
}

/** 低碳替代方案 */
export interface LowCarbonAlternative {
  name: string;
  co2: number;
}

/** 食谱 */
export interface Recipe {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  description: string;
  ingredients: Ingredient[];
  calories: number;
  /** 总碳排放 (kg CO2e) */
  co2: number;
  /** 食材分类标签 */
  tags: string[];
  /** 低碳替代方案 */
  alternative: LowCarbonAlternative;
  /** 图片路径  */
  image?: string;
}

/** 餐次类型 */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/** 碳足迹等级 */
export type CarbonLevel = 'low' | 'medium' | 'high' | 'very-high';

/** 收藏记录 */
export interface FavoriteRecord {
  recipeId: string;
  addedAt: number;
}
