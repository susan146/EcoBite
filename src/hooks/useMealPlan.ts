import { useState, useEffect, useCallback } from 'react';
import type { MealType } from '../data/types';

/** 一日的餐食选择记录 */
export interface DayMealPlan {
  /** 格式: YYYY-MM-DD */
  date: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

/** 今日汇总 */
export interface TodaySummary {
  totalCO2: number;
  totalCalories: number;
  selectedCount: number;
  savings: number;
  selectedMeals: { mealType: MealType; recipeId: string }[];
}

const STORAGE_KEY = 'ecobite-meal-plan';

/** 获取今天的日期字符串 YYYY-MM-DD */
function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 读取所有历史餐食计划 */
function loadAllPlans(): Record<string, DayMealPlan> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, DayMealPlan>) : {};
  } catch {
    return {};
  }
}

/** 保存所有餐食计划 */
function saveAllPlans(plans: Record<string, DayMealPlan>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

/**
 * 每日餐食规划 Hook
 * 管理用户每天选择的食谱，持久化到 localStorage
 */
export function useMealPlan() {
  const [plans, setPlans] = useState<Record<string, DayMealPlan>>(() => loadAllPlans());

  useEffect(() => {
    saveAllPlans(plans);
  }, [plans]);

  const todayKey = getTodayKey();
  const todayPlan: DayMealPlan = plans[todayKey] || { date: todayKey };

  /** 选择某一餐的食谱 */
  const selectMeal = useCallback((mealType: MealType, recipeId: string) => {
    setPlans((prev) => {
      const today = getTodayKey();
      const existing = prev[today] || { date: today };
      return {
        ...prev,
        [today]: {
          ...existing,
          [mealType]: recipeId,
        },
      };
    });
  }, []);

  /** 取消选择某一餐 */
  const deselectMeal = useCallback((mealType: MealType) => {
    setPlans((prev) => {
      const today = getTodayKey();
      const existing = prev[today] || { date: today };
      const updated = { ...existing };
      delete updated[mealType];
      return {
        ...prev,
        [today]: updated,
      };
    });
  }, []);

  /** 切换选择状态 */
  const toggleMeal = useCallback((mealType: MealType, recipeId: string) => {
    setPlans((prev) => {
      const today = getTodayKey();
      const existing = prev[today] || { date: today };
      if (existing[mealType] === recipeId) {
        const updated = { ...existing };
        delete updated[mealType];
        return { ...prev, [today]: updated };
      }
      return {
        ...prev,
        [today]: { ...existing, [mealType]: recipeId },
      };
    });
  }, []);

  /** 获取某一天是否选了某个食谱 */
  const isSelected = useCallback(
    (mealType: MealType, recipeId: string): boolean => {
      return todayPlan[mealType] === recipeId;
    },
    [todayPlan]
  );

  /** 获取最近 N 天的餐食计划（用于仪表盘） */
  const getRecentPlans = useCallback((days: number): DayMealPlan[] => {
    const result: DayMealPlan[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      result.push(plans[key] || { date: key });
    }
    return result;
  }, [plans]);

  return {
    todayPlan,
    selectMeal,
    deselectMeal,
    toggleMeal,
    isSelected,
    getRecentPlans,
  };
}
