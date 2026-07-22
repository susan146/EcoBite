import { useState, useMemo } from 'react';
import { mockRecipes } from '../../data/mockRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import { useMealPlan } from '../../hooks/useMealPlan';
import type { MealType } from '../../data/types';
import { getMealTypeLabel } from '../../data/recipes';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './HomePage.module.css';

const mealOrder: MealType[] = ['breakfast', 'lunch', 'dinner'];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { todayPlan, toggleMeal, isSelected } = useMealPlan();

  const filtered = useMemo(() => {
    if (!search.trim()) return mockRecipes;
    const q = search.trim().toLowerCase();
    return mockRecipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.name.toLowerCase().includes(q)) ||
        r.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<MealType, typeof filtered> = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };
    for (const recipe of filtered) {
      map[recipe.mealType].push(recipe);
    }
    return map;
  }, [filtered]);

  // 今日选择汇总
  const todaySummary = useMemo(() => {
    const selectedMeals: { mealType: MealType; recipeId: string }[] = [];
    let totalCO2 = 0;
    let totalCalories = 0;
    let savings = 0;

    for (const meal of mealOrder) {
      const recipeId = todayPlan[meal];
      if (recipeId) {
        const recipe = mockRecipes.find((r) => r.id === recipeId);
        if (recipe) {
          selectedMeals.push({ mealType: meal, recipeId });
          totalCO2 += recipe.co2;
          totalCalories += recipe.calories;
          savings += recipe.co2 - recipe.alternative.co2;
        }
      }
    }

    return { totalCO2, totalCalories, selectedCount: selectedMeals.length, savings, selectedMeals };
  }, [todayPlan]);

  const handleCardClick = (mealType: MealType, recipeId: string) => {
    toggleMeal(mealType, recipeId);
  };

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          低碳饮食，从每一餐开始
        </h1>
        <p className={styles.subtitle}>
          选择一道食谱，查看它的碳足迹，发现更低碳的美味搭配
        </p>
        <div className={styles.searchWrap}>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </section>

      {/* 为什么选择低碳饮食 */}
      <section className={styles.whySection}>
        <h2 className={styles.whyTitle}>为什么选择低碳饮食？</h2>
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>🌍</span>
            <h3>减缓气候变化</h3>
            <p>食物系统贡献了全球约 <strong>26%</strong> 的温室气体排放。选择低碳食谱是个人应对气候变化最直接的方式之一。</p>
          </div>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>🥦</span>
            <h3>更健康的身体</h3>
            <p>低碳食谱通常以植物性食物为主，富含膳食纤维和维生素，有助于降低心血管疾病风险。</p>
          </div>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>💧</span>
            <h3>节约水资源</h3>
            <p>生产 1kg 牛肉需消耗约 <strong>15,000</strong> 升水，而蔬菜仅需 <strong>300</strong> 升。低碳饮食也在节约水。</p>
          </div>
          <div className={styles.whyCard}>
            <span className={styles.whyIcon}>🌱</span>
            <h3>保护生物多样性</h3>
            <p>减少肉类消费可降低对牧场的土地需求，减缓森林砍伐，保护野生动物栖息地。</p>
          </div>
        </div>
      </section>

      {/* 今日餐食汇总栏 */}
      {todaySummary.selectedCount > 0 && (
        <section className={styles.summaryBar}>
          <div className={styles.summaryLeft}>
            <span className={styles.summaryIcon}>🍽️</span>
            <div>
              <div className={styles.summaryTitle}>今日已选 {todaySummary.selectedCount} 餐</div>
              <div className={styles.summaryDetail}>
                {todaySummary.selectedMeals.map((m) => {
                  const recipe = mockRecipes.find((r) => r.id === m.recipeId);
                  return recipe ? (
                    <span key={m.mealType} className={styles.summaryTag}>
                      {getMealTypeLabel(m.mealType)}: {recipe.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
          <div className={styles.summaryRight}>
            <div className={styles.summaryStat}>
              <span className={styles.summaryStatValue}>{todaySummary.totalCO2.toFixed(2)}</span>
              <span className={styles.summaryStatUnit}>kg CO₂</span>
            </div>
            <div className={styles.summaryStat}>
              <span className={styles.summaryStatValue}>{todaySummary.totalCalories}</span>
              <span className={styles.summaryStatUnit}>kcal</span>
            </div>
            <div className={styles.summaryStat}>
              <span className={styles.summaryStatLabel}>可节省</span>
              <span className={styles.summaryStatValue} style={{ color: '#4CAF50' }}>
                {todaySummary.savings.toFixed(2)}
              </span>
              <span className={styles.summaryStatUnit}>kg CO₂</span>
            </div>
          </div>
        </section>
      )}

      {/* Meal sections */}
      {mealOrder.map((meal) => {
        const recipes = grouped[meal];
        if (recipes.length === 0) return null;
        const selectedId = todayPlan[meal];
        const selectedRecipe = selectedId ? mockRecipes.find((r) => r.id === selectedId) : null;
        return (
          <section key={meal} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionDot} />
              {getMealTypeLabel(meal)}
              {selectedRecipe && (
                <span className={styles.selectedHint}>
                  ✓ 已选: {selectedRecipe.name}
                </span>
              )}
              {!selectedRecipe && (
                <span className={styles.selectHint}>
                  点击食谱卡片选择今日{getMealTypeLabel(meal)}
                </span>
              )}
            </h2>
            <div className={styles.grid}>
              {recipes.map((recipe) => {
                const selected = isSelected(meal, recipe.id);
                return (
                  <div
                    key={recipe.id}
                    className={`${styles.cardWrapper} ${selected ? styles.cardSelected : ''}`}
                    onClick={() => handleCardClick(meal, recipe.id)}
                  >
                    {selected && (
                      <div className={styles.selectedBadge}>
                        ✓ 今日{getMealTypeLabel(meal)}
                      </div>
                    )}
                    <RecipeCard
                      recipe={recipe}
                      isFavorite={isFavorite(recipe.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <p>没有找到匹配的食谱，换个关键词试试？</p>
        </div>
      )}
    </main>
  );
}
