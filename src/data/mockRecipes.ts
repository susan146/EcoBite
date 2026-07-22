import type { Recipe } from './types';

/**
 * 模拟食谱数据
 * 碳排放因子参考:
 *   牛肉 27 | 猪肉 12 | 鸡肉 6 | 鱼 6 | 蛋 4.5
 *   奶制品 3.2 | 豆腐 2 | 蔬菜 2 | 谷物 1.5 | 水果 1.1
 * 单位: kg CO2e / kg 食材
 */
export const mockRecipes: Recipe[] = [
  // ========== 早餐 ==========
  {
    id: 'b1',
    name: '燕麦水果碗',
    mealType: 'breakfast',
    description: '燕麦搭配新鲜蓝莓和香蕉，淋上少许蜂蜜，元气满满的低碳早餐',
    ingredients: [
      { name: '燕麦', carbonPerKg: 1.5, amount: 80 },
      { name: '蓝莓', carbonPerKg: 1.1, amount: 50 },
      { name: '香蕉', carbonPerKg: 1.1, amount: 60 },
      { name: '蜂蜜', carbonPerKg: 0.5, amount: 15 },
    ],
    calories: 350,
    co2: 0.24,
    tags: ['谷物', '水果'],
    alternative: { name: '小米粥配红枣', co2: 0.15 },
    image: '/png/1.png',
  },
  {
    id: 'b2',
    name: '牛油果吐司',
    mealType: 'breakfast',
    description: '全麦吐司铺上牛油果泥，搭配水波蛋和黑胡椒，营养又满足',
    ingredients: [
      { name: '全麦吐司', carbonPerKg: 1.5, amount: 60 },
      { name: '牛油果', carbonPerKg: 2.0, amount: 80 },
      { name: '鸡蛋', carbonPerKg: 4.5, amount: 50 },
    ],
    calories: 420,
    co2: 0.59,
    tags: ['谷物', '果蔬'],
    alternative: { name: '花生酱香蕉吐司', co2: 0.25 },
    image: '/png/2.png',
  },
  {
    id: 'b3',
    name: '希腊酸奶莓果碗',
    mealType: 'breakfast',
    description: '浓稠希腊酸奶搭配混合莓果和格兰诺拉，蛋白质与纤维双补',
    ingredients: [
      { name: '希腊酸奶', carbonPerKg: 3.2, amount: 150 },
      { name: '混合莓果', carbonPerKg: 1.1, amount: 80 },
      { name: '格兰诺拉', carbonPerKg: 1.5, amount: 30 },
    ],
    calories: 320,
    co2: 0.57,
    tags: ['乳制品', '水果'],
    alternative: { name: '椰奶燕麦莓果碗', co2: 0.2 },
    image: '/png/3.png',
  },

  // ========== 午餐 ==========
  {
    id: 'l1',
    name: '鸡胸肉沙拉',
    mealType: 'lunch',
    description: '香煎鸡胸肉配混合生菜、番茄和橄榄油醋汁，清爽高蛋白',
    ingredients: [
      { name: '鸡胸肉', carbonPerKg: 6.0, amount: 150 },
      { name: '混合生菜', carbonPerKg: 2.0, amount: 100 },
      { name: '番茄', carbonPerKg: 2.0, amount: 80 },
      { name: '橄榄油', carbonPerKg: 3.0, amount: 15 },
    ],
    calories: 380,
    co2: 1.29,
    tags: ['禽肉', '蔬菜'],
    alternative: { name: '鹰嘴豆蔬菜沙拉', co2: 0.45 },
    image: '/png/4.png',
  },
  {
    id: 'l2',
    name: '牛肉意面',
    mealType: 'lunch',
    description: '经典意式肉酱面，番茄牛肉酱搭配弹牙意面，满足感满分',
    ingredients: [
      { name: '牛肉糜', carbonPerKg: 27.0, amount: 150 },
      { name: '意面', carbonPerKg: 1.5, amount: 120 },
      { name: '番茄酱', carbonPerKg: 2.0, amount: 100 },
      { name: '洋葱', carbonPerKg: 1.0, amount: 50 },
    ],
    calories: 620,
    co2: 4.43,
    tags: ['红肉', '谷物'],
    alternative: { name: '蘑菇番茄意面', co2: 0.72 },
    image: '/png/5.png',
  },
  {
    id: 'l3',
    name: '素食佛碗',
    mealType: 'lunch',
    description: '藜麦、烤红薯、鹰嘴豆和芝麻酱，一碗搞定全部营养',
    ingredients: [
      { name: '藜麦', carbonPerKg: 1.5, amount: 100 },
      { name: '红薯', carbonPerKg: 1.0, amount: 150 },
      { name: '鹰嘴豆', carbonPerKg: 1.2, amount: 100 },
      { name: '芝麻酱', carbonPerKg: 2.5, amount: 20 },
    ],
    calories: 480,
    co2: 0.52,
    tags: ['谷物', '豆类'],
    alternative: { name: '糙豆蔬菜佛碗', co2: 0.35 },
    image: '/png/6.png',
  },

  // ========== 晚餐 ==========
  {
    id: 'd1',
    name: '红烧牛腩',
    mealType: 'dinner',
    description: '慢炖牛腩配土豆胡萝卜，浓郁酱香，冬日治愈系晚餐',
    ingredients: [
      { name: '牛腩', carbonPerKg: 27.0, amount: 250 },
      { name: '土豆', carbonPerKg: 0.8, amount: 150 },
      { name: '胡萝卜', carbonPerKg: 1.0, amount: 100 },
      { name: '酱油', carbonPerKg: 2.0, amount: 30 },
    ],
    calories: 680,
    co2: 7.07,
    tags: ['红肉', '根茎蔬菜'],
    alternative: { name: '红烧豆腐煲', co2: 0.82 },
    image: '/png/7.png',
  },
  {
    id: 'd2',
    name: '宫保鸡丁',
    mealType: 'dinner',
    description: '经典川菜，鸡丁配花生米和干辣椒，下饭神器',
    ingredients: [
      { name: '鸡肉', carbonPerKg: 6.0, amount: 200 },
      { name: '花生米', carbonPerKg: 2.5, amount: 30 },
      { name: '青椒', carbonPerKg: 1.5, amount: 80 },
      { name: '干辣椒', carbonPerKg: 2.0, amount: 10 },
    ],
    calories: 520,
    co2: 1.52,
    tags: ['禽肉', '坚果'],
    alternative: { name: '宫保豆腐', co2: 0.46 },
    image: '/png/8.png',
  },
  {
    id: 'd3',
    name: '清蒸鲈鱼',
    mealType: 'dinner',
    description: '新鲜鲈鱼清蒸，姜丝葱丝提鲜，淋上蒸鱼豉油，鲜美低脂',
    ingredients: [
      { name: '鲈鱼', carbonPerKg: 6.0, amount: 300 },
      { name: '姜', carbonPerKg: 1.0, amount: 20 },
      { name: '葱', carbonPerKg: 1.0, amount: 30 },
      { name: '蒸鱼豉油', carbonPerKg: 2.0, amount: 20 },
    ],
    calories: 320,
    co2: 1.9,
    tags: ['水产', '低脂'],
    alternative: { name: '蒜蓉蒸茄子', co2: 0.35 },
    image: '/png/9.png',
  },
];
