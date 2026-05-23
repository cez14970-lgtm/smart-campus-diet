import type { UserProfile, Dish, MealPlan, DietaryAdvice } from '../types';
import { canteenDishes } from '../data/mockCanteen';

function calcBMI(weight: number, heightCm: number): number {
  const h = heightCm / 100;
  return +(weight / (h * h)).toFixed(1);
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常范围';
  if (bmi < 28) return '偏胖';
  return '肥胖范围';
}

const ingredientMap: Record<string, string[]> = {
  '健身增肌': ['鸡胸肉', '鸡蛋', '牛肉', '鱼', '豆腐', '牛奶', '虾仁', '瘦猪肉'],
  '减脂控重': ['西兰花', '鸡胸肉', '黄瓜', '南瓜', '糙米', '燕麦', '生菜', '番茄'],
  '熬夜恢复': ['菠菜', '鸡蛋', '银耳', '小米', '牛奶', '鱼肉', '胡萝卜', '枸杞'],
  '压力较大': ['香蕉', '牛奶', '燕麦', '坚果', '深海鱼', '菠菜', '鸡蛋', '小米'],
  '清淡饮食': ['青菜', '豆腐', '小米', '南瓜', '银耳', '冬瓜', '山药', '玉米'],
  '胃部不适': ['小米', '南瓜', '鸡蛋羹', '银耳', '山药', '鱼肉', '牛奶', '豆腐'],
  '饮食规律改善': ['粗粮', '燕麦', '鸡蛋', '牛奶', '全麦', '蔬菜', '水果', '杂粮'],
};

const avoidMap: Record<string, string[]> = {
  '健身增肌': ['油炸食品', '高糖饮料', '精制碳水', '酒精类'],
  '减脂控重': ['油炸食品', '含糖饮料', '肥肉', '高GI主食', '甜点'],
  '熬夜恢复': ['油炸食品', '高糖饮料', '辛辣食物', '咖啡因过量', '泡面'],
  '压力较大': ['辛辣食物', '高糖甜点', '油炸食品', '过量咖啡', '酒精'],
  '清淡饮食': ['麻辣', '油炸', '烧烤', '过咸腌制', '高油炒菜'],
  '胃部不适': ['辛辣', '油炸', '过酸', '生冷', '腌制', '高纤维粗粮'],
  '饮食规律改善': ['高糖零食', '油炸快餐', '含糖饮料', '夜宵', '不规律进餐'],
};

const dietFocusMap: Record<string, string[]> = {
  '健身增肌': ['保证每餐蛋白质摄入', '适量增加碳水补充', '运动后30分钟内补充营养'],
  '减脂控重': ['控制总热量摄入', '低GI主食替代精米白面', '增加蔬菜纤维摄入'],
  '熬夜恢复': ['补充B族维生素', '优质蛋白修复身体', '温润养胃饮食'],
  '压力较大': ['补充镁、锌元素', '均衡营养稳定血糖', '避免靠吃发泄情绪'],
  '清淡饮食': ['少油少盐烹饪', '蒸煮优先于煎炸', '天然食材原味为主'],
  '胃部不适': ['少食多餐', '温热软烂为主', '避免刺激性食物'],
  '饮食规律改善': ['定时定量进餐', '均衡搭配营养', '避免暴饮暴食'],
};

const statusKeywords: Record<string, string[]> = {
  '熬夜': ['护肝', '抗氧化', 'B族维生素', '温补', '清淡蛋白'],
  '压力': ['镁', '维生素C', '抗氧化', '稳定血糖', 'Omega-3'],
  '运动': ['优质蛋白', '碳水补充', '电解质', '抗氧化'],
  '备考': ['DHA', 'B族维生素', '稳定血糖', '适量咖啡因'],
  '生理期': ['铁', '温补', '易消化', '避免生冷'],
};

function filterDishes(dishes: Dish[], profile: UserProfile): Dish[] {
  let filtered = [...dishes];

  // Filter by allergies
  if (profile.allergies.length > 0) {
    filtered = filtered.filter(
      (d) => !d.allergens.some((a) => profile.allergies.includes(a))
    );
  }

  return filtered;
}

function scoreDish(dish: Dish, profile: UserProfile): number {
  let score = 0;
  const allGoals = [...profile.dietaryGoals, ...profile.recentStatus];

  for (const goal of allGoals) {
    const recommended = ingredientMap[goal] || [];
    for (const ingredient of recommended) {
      if (dish.mainIngredients.some((i) => i.includes(ingredient))) {
        score += 3;
      }
    }
    if (dish.tags.some((t) => recommended.some((r) => t.includes(r)))) {
      score += 2;
    }
  }

  // Penalize avoid foods
  for (const goal of allGoals) {
    const avoids = avoidMap[goal] || [];
    for (const avoid of avoids) {
      if (dish.tags.some((t) => avoid.includes(t) || t.includes(avoid))) {
        score -= 4;
      }
    }
  }

  // Give negative scores to dishes with avoid-style tags when goals suggest avoiding them
  const shouldAvoidSpicy = allGoals.some((g) =>
    ['胃部不适', '清淡饮食', '压力较大', '熬夜恢复'].includes(g)
  );
  if (shouldAvoidSpicy && dish.tags.includes('辛辣')) score -= 5;

  const shouldAvoidFried = allGoals.some(
    (g) => g !== '健身增肌'
  );
  if (shouldAvoidFried && dish.tags.includes('油炸')) score -= 5;

  return score;
}

function generateMealPlans(dishes: Dish[], profile: UserProfile): MealPlan[] {
  const scored = dishes.map((d) => ({ dish: d, score: scoreDish(d, profile) }));
  scored.sort((a, b) => b.score - a.score);

  const proteinDishes = scored.filter((s) => s.dish.category === 'protein');
  const vegetableDishes = scored.filter((s) => s.dish.category === 'vegetable');
  const stapleDishes = scored.filter((s) => s.dish.category === 'staple');
  const soupDishes = scored.filter((s) => s.dish.category === 'soup_drink');

  const plans: MealPlan[] = [];

  // Plan 1: Best overall
  const bestProtein = proteinDishes[0]?.dish;
  const bestVeg = vegetableDishes[0]?.dish;
  const bestStaple = stapleDishes[0]?.dish;
  const bestSoup = soupDishes[0]?.dish;

  if (bestProtein && bestVeg && bestStaple) {
    const plan1Dishes = [bestStaple, bestProtein, bestVeg];
    if (bestSoup) plan1Dishes.push(bestSoup);

    plans.push({
      id: 'plan-1',
      name: '最优推荐套餐',
      suitableFor: profile.dietaryGoals,
      dishes: plan1Dishes,
      totalPrice: plan1Dishes.reduce((sum, d) => sum + d.price, 0),
      reason: generatePlanReason(plan1Dishes, profile, 'optimal'),
    });
  }

  // Plan 2: Budget-friendly
  const budgetProtein = [...proteinDishes].sort((a, b) => a.dish.price - b.dish.price).find((s) => s.score > 0)?.dish;
  const budgetVeg = [...vegetableDishes].sort((a, b) => a.dish.price - b.dish.price).find((s) => s.score > 0)?.dish;
  const budgetStaple = [...stapleDishes].sort((a, b) => a.dish.price - b.dish.price).find((s) => s.score > 0)?.dish;
  const budgetSoup = [...soupDishes].sort((a, b) => a.dish.price - b.dish.price).find((s) => s.score > 0)?.dish;

  if (budgetProtein && budgetVeg && budgetStaple) {
    const plan2Dishes = [budgetStaple, budgetProtein, budgetVeg];
    if (budgetSoup && budgetSoup.id !== budgetProtein.id) plan2Dishes.push(budgetSoup);

    // Make sure plan2 is different from plan1
    const plan2Ids = plan2Dishes.map((d) => d.id).sort().join(',');
    const plan1Ids = plans[0]?.dishes.map((d) => d.id).sort().join(',');
    if (plan2Ids !== plan1Ids) {
      plans.push({
        id: 'plan-2',
        name: '经济实惠套餐',
        suitableFor: profile.dietaryGoals,
        dishes: plan2Dishes,
        totalPrice: plan2Dishes.reduce((sum, d) => sum + d.price, 0),
        reason: generatePlanReason(plan2Dishes, profile, 'budget'),
      });
    }
  }

  // Plan 3: Alternative variety
  const altProtein = proteinDishes.find(
    (s) => s.score > 0 && !plans.some((p) => p.dishes.some((d) => d.id === s.dish.id))
  )?.dish;
  const altVeg = vegetableDishes.find(
    (s) => s.score > 0 && !plans.some((p) => p.dishes.some((d) => d.id === s.dish.id))
  )?.dish;
  const altStaple = stapleDishes.find(
    (s) => s.score > 0 && !plans.some((p) => p.dishes.some((d) => d.id === s.dish.id))
  )?.dish;
  const altSoup = soupDishes.find(
    (s) => s.score > 0 && !plans.some((p) => p.dishes.some((d) => d.id === s.dish.id))
  )?.dish;

  if (altProtein && altVeg && altStaple) {
    const plan3Dishes = [altStaple, altProtein, altVeg];
    if (altSoup) plan3Dishes.push(altSoup);

    plans.push({
      id: 'plan-3',
      name: '多样选择套餐',
      suitableFor: profile.dietaryGoals,
      dishes: plan3Dishes,
      totalPrice: plan3Dishes.reduce((sum, d) => sum + d.price, 0),
      reason: generatePlanReason(plan3Dishes, profile, 'variety'),
    });
  }

  return plans;
}

function generatePlanReason(
  dishes: Dish[],
  profile: UserProfile,
  strategy: 'optimal' | 'budget' | 'variety'
): string {
  const names = dishes.map((d) => d.name).join('、');
  const strategyText: Record<string, string> = {
    optimal: '基于你的健康画像，这套搭配在营养均衡和口味方面达到了最佳平衡',
    budget: '在满足你营养需求的前提下，选择了性价比最高的菜品组合',
    variety: '为你提供与前两套不同的菜品选择，丰富日常饮食多样性',
  };

  const goalText =
    profile.dietaryGoals.length > 0 ? `，特别适合${profile.dietaryGoals.join('、')}期间食用` : '';

  return `${strategyText[strategy]}：${names}${goalText}。${
    profile.allergies.length > 0
      ? `已为你排除包含${profile.allergies.join('、')}的菜品。`
      : ''
  }`;
}

function generateAISummary(profile: UserProfile, advice: Partial<DietaryAdvice>): string {
  const bmi = calcBMI(profile.weight, profile.height);
  const cat = bmiCategory(bmi);
  const goalText = profile.dietaryGoals.length > 0 ? profile.dietaryGoals.join('、') : '保持健康';
  const statusText =
    profile.recentStatus.length > 0 ? `你目前的${profile.recentStatus.join('、')}状态` : '';

  const summaries: string[] = [
    `你好！根据你填写的健康画像，你的 BMI 为 ${bmi}（${cat}），当前饮食目标为「${goalText}」。`,
    statusText
      ? `${statusText}，建议在饮食上做以下调整：`
      : '以下是为你定制的饮食建议：',
  ];

  if (advice.dietFocus && advice.dietFocus.length > 0) {
    summaries.push(`今日饮食重点：${advice.dietFocus.join('；')}。`);
  }

  if (advice.recommendedIngredients && advice.recommendedIngredients.length > 0) {
    summaries.push(
      `推荐多摄入${advice.recommendedIngredients.slice(0, 5).join('、')}等食材。`
    );
  }

  if (advice.avoidFoods && advice.avoidFoods.length > 0) {
    summaries.push(
      `建议减少${advice.avoidFoods.slice(0, 4).join('、')}的摄入。`
    );
  }

  if (advice.riskWarnings && advice.riskWarnings.length > 0) {
    summaries.push(
      `💡 温馨提示：${advice.riskWarnings.join('；')}`
    );
  }

  summaries.push(
    '以上建议基于你填写的个人健康画像生成，旨在帮助你在校园食堂中做出更明智的饮食选择。如有特殊健康状况，建议咨询专业营养师或医生。'
  );

  return summaries.join('\n\n');
}

export function generateDietaryAdvice(profile: UserProfile): DietaryAdvice {
  const bmi = calcBMI(profile.weight, profile.height);
  const cat = bmiCategory(bmi);

  // Gather diet focus
  const dietFocus: string[] = [];
  const recommendedIngredients: Set<string> = new Set();
  const avoidFoods: Set<string> = new Set();
  const riskWarnings: string[] = [];

  for (const goal of profile.dietaryGoals) {
    const focuses = dietFocusMap[goal] || [];
    focuses.forEach((f) => dietFocus.push(f));
    (ingredientMap[goal] || []).forEach((i) => recommendedIngredients.add(i));
    (avoidMap[goal] || []).forEach((a) => avoidFoods.add(a));
  }

  for (const status of profile.recentStatus) {
    for (const [key, vals] of Object.entries(statusKeywords)) {
      if (status.includes(key) || key.includes(status)) {
        vals.forEach((v) => recommendedIngredients.add(v));
      }
    }
  }

  // Risk warnings
  if (bmi < 18.5) {
    riskWarnings.push('你的体重偏轻，建议适当增加蛋白质和健康碳水的摄入');
  } else if (bmi >= 28) {
    riskWarnings.push('你的体重处于肥胖范围，建议控制总热量并增加运动量，具体可咨询医生');
  }

  if (profile.allergies.includes('花生')) {
    riskWarnings.push('你有花生过敏史，点餐时请注意查看菜品配料');
  }
  if (profile.allergies.includes('海鲜')) {
    riskWarnings.push('你有海鲜过敏史，已为你过滤含海鲜菜品');
  }

  if (profile.dietaryGoals.includes('胃部不适')) {
    riskWarnings.push('胃部不适期间建议少食多餐，避免过冷过热食物');
  }

  if (profile.exerciseFrequency === 'sedentary' && profile.dietaryGoals.includes('减脂控重')) {
    riskWarnings.push('目前运动量偏少，建议配合适量运动以达到更好的减脂效果');
  }

  // Deduplicate
  const uniqueFocus = [...new Set(dietFocus)];
  const uniqueIngredients = [...recommendedIngredients];
  const uniqueAvoid = [...avoidFoods];

  // Build partial advice for summary
  const partialAdvice: Partial<DietaryAdvice> = {
    dietFocus: uniqueFocus.slice(0, 6),
    recommendedIngredients: uniqueIngredients.slice(0, 8),
    avoidFoods: uniqueAvoid.slice(0, 5),
    riskWarnings,
  };

  // Filter & score dishes
  const eligibleDishes = filterDishes(canteenDishes, profile);
  const mealPlans = generateMealPlans(eligibleDishes, profile);

  const aiSummary = generateAISummary(profile, partialAdvice);

  return {
    bmi,
    bmiCategory: cat,
    dietFocus: uniqueFocus.slice(0, 6),
    recommendedIngredients: uniqueIngredients.slice(0, 8),
    avoidFoods: uniqueAvoid.slice(0, 5),
    riskWarnings,
    aiSummary,
    recommendedMealPlans: mealPlans,
  };
}

export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return +(10 * weight + 6.25 * height - 5 * age + 5).toFixed(0);
  }
  return +(10 * weight + 6.25 * height - 5 * age - 161).toFixed(0);
}
