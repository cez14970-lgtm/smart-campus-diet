export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  exerciseFrequency: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryGoals: string[];
  allergies: string[];
  recentStatus: string[];
  dormitory: string;
}

export interface Dish {
  id: string;
  name: string;
  canteen: string;
  window: string;
  price: number;
  category: 'protein' | 'vegetable' | 'staple' | 'soup_drink';
  mainIngredients: string[];
  tags: string[];
  allergens: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  suitableFor: string[];
  dishes: Dish[];
  totalPrice: number;
  reason: string;
}

export interface DietaryAdvice {
  bmi: number;
  bmiCategory: string;
  dietFocus: string[];
  recommendedIngredients: string[];
  avoidFoods: string[];
  riskWarnings: string[];
  aiSummary: string;
  recommendedMealPlans: MealPlan[];
}

export interface Restaurant {
  id: string;
  name: string;
  distance: number; // meters
  avgPrice: number;
  healthScore: number;
  tasteScore: number;
  tags: string[];
  isRedList: boolean;
  reason: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
}

export interface Order {
  id: string;
  mealPlan: MealPlan;
  canteen: string;
  pickupTime: string;
  delivery: boolean;
  dormitory: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}
