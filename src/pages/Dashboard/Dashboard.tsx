import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { mockRecipes } from '../../data/mockRecipes';
import { useMealPlan } from '../../hooks/useMealPlan';
import type { MealType } from '../../data/types';
import { getMealTypeLabel } from '../../data/recipes';
import styles from './Dashboard.module.css';

const mealOrder: MealType[] = ['breakfast', 'lunch', 'dinner'];
const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const PIE_COLORS = ['#FF9800', '#4CAF50', '#8BC34A', '#F44336', '#E9972E', '#9CA89E'];

/** 根据食材名称推断分类 */
function categorizeIngredient(name: string): string {
  const meatKeywords = ['牛肉', '猪肉', '羊肉', '红肉'];
  const poultryKeywords = ['鸡肉', '鸡胸', '鸡腿', '鸡翅', '禽肉'];
  const seafoodKeywords = ['鱼', '虾', '蟹', '贝'];
  const dairyKeywords = ['牛奶', '酸奶', '奶酪', '黄油', '乳'];
  const grainKeywords = ['米', '面', '燕麦', '面包', '吐司', '谷物', '意面', '米饭'];
  const vegetableKeywords = ['蔬菜', '菠菜', '西兰花', '番茄', '洋葱', '胡萝卜', '茄子', '蒜', '葱', '生菜', '黄瓜'];

  for (const kw of meatKeywords) if (name.includes(kw)) return '红肉';
  for (const kw of poultryKeywords) if (name.includes(kw)) return '禽肉';
  for (const kw of seafoodKeywords) if (name.includes(kw)) return '海鲜';
  for (const kw of dairyKeywords) if (name.includes(kw)) return '乳制品';
  for (const kw of grainKeywords) if (name.includes(kw)) return '谷物';
  for (const kw of vegetableKeywords) if (name.includes(kw)) return '蔬菜';
  return '其他';
}

export default function Dashboard() {
  const { getRecentPlans } = useMealPlan();

  // 基于用户真实选择生成 7 天数据
  const weeklyData = useMemo(() => {
    const recent = getRecentPlans(7);
    return recent.map((plan) => {
      let co2 = 0;
      let calories = 0;
      let meals = 0;

      for (const meal of mealOrder) {
        const recipeId = plan[meal];
        if (recipeId) {
          const recipe = mockRecipes.find((r) => r.id === recipeId);
          if (recipe) {
            co2 += recipe.co2;
            calories += recipe.calories;
            meals++;
          }
        }
      }

      const date = new Date(plan.date);
      const weekday = WEEKDAYS[date.getDay()];
      const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;

      return {
        day: weekday,
        date: monthDay,
        co2: parseFloat(co2.toFixed(2)),
        calories,
        meals,
      };
    });
  }, [getRecentPlans]);

  // 食材碳排放占比（基于今日选择的食谱）
  const ingredientData = useMemo(() => {
    const today = getRecentPlans(1)[0];
    const categoryMap: Record<string, number> = {};

    for (const meal of mealOrder) {
      const recipeId = today[meal];
      if (recipeId) {
        const recipe = mockRecipes.find((r) => r.id === recipeId);
        if (recipe) {
          for (const ing of recipe.ingredients) {
            const category = categorizeIngredient(ing.name);
            // co2 = carbonPerKg * (amount / 1000)
            const ingCO2 = ing.carbonPerKg * (ing.amount / 1000);
            categoryMap[category] = (categoryMap[category] || 0) + ingCO2;
          }
        }
      }
    }

    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: parseFloat(((value / total) * 100).toFixed(1)),
        color: PIE_COLORS[Object.keys(categoryMap).indexOf(name) % PIE_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [getRecentPlans]);

  // 餐次碳排放分布
  const mealTypeData = useMemo(() => {
    const today = getRecentPlans(1)[0];
    return mealOrder
      .map((meal) => {
        const recipeId = today[meal];
        const recipe = recipeId ? mockRecipes.find((r) => r.id === recipeId) : null;
        return {
          name: getMealTypeLabel(meal),
          co2: recipe ? parseFloat(recipe.co2.toFixed(2)) : 0,
          count: recipeId ? 1 : 0,
        };
      })
      .filter((item) => item.co2 > 0);
  }, [getRecentPlans]);

  // 汇总统计
  const summary = useMemo(() => {
    const totalCO2 = weeklyData.reduce((sum, d) => sum + d.co2, 0);
    const activeDays = weeklyData.filter((d) => d.meals > 0).length;
    const averageCO2 = activeDays > 0 ? totalCO2 / activeDays : 0;
    const totalMeals = weeklyData.reduce((sum, d) => sum + d.meals, 0);
    const targetCO2 = 21; // 每周目标 21kg
    const savings = Math.max(0, targetCO2 - totalCO2);

    return {
      totalCO2: parseFloat(totalCO2.toFixed(1)),
      averageCO2: parseFloat(averageCO2.toFixed(1)),
      totalMeals,
      savings: parseFloat(savings.toFixed(1)),
      targetCO2,
    };
  }, [weeklyData]);

  const progressPercent = summary.targetCO2 > 0
    ? Math.min((summary.totalCO2 / summary.targetCO2) * 100, 100)
    : 0;
  const isOverTarget = summary.totalCO2 > summary.targetCO2;
  const hasData = summary.totalMeals > 0;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { date: string; calories: number } }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipDay}>{data.name}</span>
            <span className={styles.tooltipDate}>{data.payload.date}</span>
          </div>
          <div className={styles.tooltipBody}>
            <span className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ backgroundColor: '#2D6A4F' }} />
              碳排放: {data.value} kg CO₂
            </span>
            {data.payload.calories > 0 && (
              <span className={styles.tooltipItem}>
                <span className={styles.tooltipDot} style={{ backgroundColor: '#E9972E' }} />
                卡路里: {data.payload.calories} kcal
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>周碳足迹仪表盘</h1>
          <p className={styles.subtitle}>追踪你本周的饮食碳排放趋势</p>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📊</span>
          <h2 className={styles.emptyTitle}>还没有数据</h2>
          <p className={styles.emptyText}>
            去<a href="/" className={styles.emptyLink}>首页</a>选择你的每日餐食，仪表盘会自动生成你的碳足迹报告
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>周碳足迹仪表盘</h1>
        <p className={styles.subtitle}>基于你的每日餐食选择生成</p>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>本周总碳排放</div>
          <div className={styles.statValueWrap}>
            <span className={styles.statValue} style={{ color: '#2D6A4F' }}>{summary.totalCO2.toFixed(1)}</span>
            <span className={styles.statUnit}>kg CO₂</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>日均碳排放</div>
          <div className={styles.statValueWrap}>
            <span className={styles.statValue} style={{ color: '#40916C' }}>{summary.averageCO2.toFixed(1)}</span>
            <span className={styles.statUnit}>kg CO₂</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>用餐次数</div>
          <div className={styles.statValueWrap}>
            <span className={styles.statValue} style={{ color: '#E9972E' }}>{summary.totalMeals}</span>
            <span className={styles.statUnit}>餐</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>节省碳排放</div>
          <div className={styles.statValueWrap}>
            <span className={styles.statValue} style={{ color: '#4CAF50' }}>{summary.savings.toFixed(1)}</span>
            <span className={styles.statUnit}>kg CO₂</span>
          </div>
        </div>
      </div>

      <div className={styles.targetProgress}>
        <div className={styles.targetHeader}>
          <span className={styles.targetLabel}>本周目标进度</span>
          <span className={styles.targetValue}>
            {summary.totalCO2.toFixed(1)} / {summary.targetCO2} kg
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%`, backgroundColor: isOverTarget ? '#F44336' : '#4CAF50' }}
          />
        </div>
        <div className={styles.progressHint}>
          {isOverTarget ? (
            <span className={styles.warning}>⚠️ 已超出目标，建议选择更多低碳食谱</span>
          ) : (
            <span className={styles.success}>✅ 保持良好，继续加油！</span>
          )}
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>碳排放趋势</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DC" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6B7C6E', fontSize: 13 }}
                axisLine={{ stroke: '#E8E5DC' }}
              />
              <YAxis
                domain={[0, 'auto']}
                tick={{ fill: '#6B7C6E', fontSize: 13 }}
                axisLine={{ stroke: '#E8E5DC' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="co2"
                name="碳排放 (kg CO₂)"
                stroke="#2D6A4F"
                strokeWidth={3}
                dot={{ fill: '#2D6A4F', stroke: '#fff', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {ingredientData.length > 0 && (
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>食材碳排放占比</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={ingredientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  animationDuration={1500}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#E8E5DC' }}
                >
                  {ingredientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, '占比']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E8E5DC',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {mealTypeData.length > 0 && (
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>今日餐次碳排放分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mealTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DC" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7C6E', fontSize: 14 }}
                axisLine={{ stroke: '#E8E5DC' }}
              />
              <YAxis
                tick={{ fill: '#6B7C6E', fontSize: 13 }}
                axisLine={{ stroke: '#E8E5DC' }}
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip
                formatter={(value: number) => [`${value} kg CO₂`, '碳排放']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E8E5DC',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              />
              <Bar
                dataKey="co2"
                name="碳排放"
                fill="#40916C"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}
