import type { Recipe } from '../../data/types';
import { getCarbonLevel, getCarbonLabel, getCarbonColor, calculateSavings } from '../../data/recipes';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  const level = getCarbonLevel(recipe.co2);
  const savings = calculateSavings(recipe);

  return (
    <div className={styles.card}>
      {/* Image area */}
      <div className={styles.imageWrap}>
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.emoji}>🍽️</span>
          </div>
        )}

        {/* Carbon badge */}
        <span
          className={styles.badge}
          style={{ backgroundColor: getCarbonColor(level) }}
        >
          {recipe.co2.toFixed(1)} kg CO₂
        </span>

        {/* Favorite button */}
        <button
          className={styles.favBtn}
          onClick={() => onToggleFavorite(recipe.id)}
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.name}>{recipe.name}</h3>
        <p className={styles.desc}>{recipe.description}</p>

        {/* Stats row */}
        <div className={styles.stats}>
          <span className={styles.stat}>
            🔥 {recipe.calories} kcal
          </span>
          <span
            className={styles.carbonTag}
            style={{ color: getCarbonColor(level) }}
          >
            🌱 {getCarbonLabel(level)}
          </span>
        </div>

        {/* Ingredients */}
        <div className={styles.ingredients}>
          {recipe.ingredients.map((ing) => (
            <span key={ing.name} className={styles.ingredient}>
              {ing.name}
            </span>
          ))}
        </div>

        {/* Low carbon alternative */}
        <div className={styles.altWrap}>
          <span className={styles.altLabel}>低碳替代</span>
          <span className={styles.altName}>{recipe.alternative.name}</span>
          <span className={styles.altSaving}>
            节省 {savings.toFixed(1)} kg CO₂
          </span>
        </div>
      </div>
    </div>
  );
}
