import { useMemo } from 'react';
import { mockRecipes } from '../../data/mockRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import styles from './Favorites.module.css';

export default function Favorites() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const favoriteRecipes = useMemo(
    () => mockRecipes.filter((r) => favorites.includes(r.id)),
    [favorites]
  );

  const totalCO2 = useMemo(
    () => favoriteRecipes.reduce((sum, r) => sum + r.co2, 0),
    [favoriteRecipes]
  );

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>我的收藏</h1>
        <p className={styles.subtitle}>
          {favorites.length > 0
            ? `已收藏 ${favorites.length} 道食谱，累计碳足迹 ${totalCO2.toFixed(1)} kg CO₂`
            : '收藏你喜欢的食谱，这里会显示你的收藏列表'}
        </p>
      </div>

      {favoriteRecipes.length > 0 ? (
        <div className={styles.grid}>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>💚</span>
          <p>还没有收藏任何食谱</p>
          <p className={styles.emptyHint}>
            去食谱页面点击 🤍 即可收藏
          </p>
        </div>
      )}
    </main>
  );
}
