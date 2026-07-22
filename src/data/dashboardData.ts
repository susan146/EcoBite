export interface DailyCO2 {
  day: string;
  date: string;
  co2: number;
  calories: number;
  meals: number;
}

export interface IngredientBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface MealTypeStats {
  name: string;
  co2: number;
  count: number;
}

export interface WeeklySummary {
  totalCO2: number;
  averageCO2: number;
  totalMeals: number;
  savings: number;
  targetCO2: number;
}

export const weeklyCO2Data: DailyCO2[] = [
  { day: '周一', date: '7/14', co2: 3.2, calories: 1850, meals: 3 },
  { day: '周二', date: '7/15', co2: 4.1, calories: 2100, meals: 3 },
  { day: '周三', date: '7/16', co2: 2.8, calories: 1900, meals: 3 },
  { day: '周四', date: '7/17', co2: 5.3, calories: 2200, meals: 3 },
  { day: '周五', date: '7/18', co2: 3.5, calories: 2000, meals: 3 },
  { day: '周六', date: '7/19', co2: 4.8, calories: 2350, meals: 3 },
  { day: '周日', date: '7/20', co2: 2.9, calories: 1800, meals: 3 },
];

export const ingredientBreakdown: IngredientBreakdown[] = [
  { name: '禽肉', value: 35, color: '#FF9800' },
  { name: '谷物', value: 22, color: '#4CAF50' },
  { name: '蔬菜', value: 18, color: '#8BC34A' },
  { name: '红肉', value: 15, color: '#F44336' },
  { name: '乳制品', value: 6, color: '#E9972E' },
  { name: '其他', value: 4, color: '#9CA89E' },
];

export const mealTypeStats: MealTypeStats[] = [
  { name: '早餐', co2: 1.2, count: 7 },
  { name: '午餐', co2: 2.8, count: 7 },
  { name: '晚餐', co2: 2.6, count: 7 },
];

export const weeklySummary: WeeklySummary = {
  totalCO2: 26.6,
  averageCO2: 3.8,
  totalMeals: 21,
  savings: 8.2,
  targetCO2: 21,
};
