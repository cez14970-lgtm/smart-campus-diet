import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UserProfile, DietaryAdvice, Dish } from '../types';
import { generateDietaryAdvice } from '../lib/recommendation';
import { canteenDishes } from '../data/mockCanteen';
import {
  Tag,
  AlertTriangle,
  ShoppingCart,
} from 'lucide-react';

const categoryLabels: Record<string, string> = {
  protein: '蛋白质',
  vegetable: '蔬菜',
  staple: '主食',
  soup_drink: '汤/饮品',
};

const categoryColors: Record<string, string> = {
  protein: 'bg-red-100 text-red-700',
  vegetable: 'bg-green-100 text-green-700',
  staple: 'bg-yellow-100 text-yellow-700',
  soup_drink: 'bg-blue-100 text-blue-700',
};

export default function Canteen() {
  const navigate = useNavigate();
  const [advice, setAdvice] = useState<DietaryAdvice | null>(null);
  const [viewMode, setViewMode] = useState<'plans' | 'all'>('plans');
  const [filterCanteen, setFilterCanteen] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('smartcampusdiet-profile');
    if (!saved) {
      navigate('/profile');
      return;
    }
    setAdvice(generateDietaryAdvice(JSON.parse(saved) as UserProfile));
  }, [navigate]);

  if (!advice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const canteens = ['all', ...new Set(canteenDishes.map((d) => d.canteen))];
  const filteredDishes = filterCanteen === 'all'
    ? canteenDishes
    : canteenDishes.filter((d) => d.canteen === filterCanteen);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">食堂菜品推荐</h1>
          <p className="text-gray-500">基于你的健康画像，从真实食堂菜品中为你推荐最佳搭配</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <button
            onClick={() => setViewMode('plans')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'plans'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            推荐套餐
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            全部菜品
          </button>
        </div>

        {viewMode === 'plans' && (
          <>
            {/* Meal Plans */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {advice.recommendedMealPlans.map((plan, idx) => (
                <div key={plan.id} className="card relative overflow-hidden group">
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      最佳匹配
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {plan.suitableFor.map((s) => (
                      <span key={s} className="tag-green text-xs">{s}</span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.dishes.map((dish) => (
                      <div key={dish.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[dish.category]}`}>
                            {categoryLabels[dish.category]}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{dish.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{dish.window}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{plan.reason}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-lg text-primary-600">¥{plan.totalPrice.toFixed(1)}</span>
                    <Link
                      to={`/order?plan=${plan.id}`}
                      className="btn-primary text-sm py-1.5 px-4 flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      立即预订
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {viewMode === 'all' && (
          <>
            {/* Canteen Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {canteens.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCanteen(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterCanteen === c
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {c === 'all' ? '全部食堂' : c.replace('中南大学', '')}
                </button>
              ))}
            </div>

            {/* All Dishes Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </>
        )}

        {/* Allergy Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>过敏原提示：</strong>每位同学的过敏原不同，点餐时请留意菜品配料表。
            已根据你的健康画像自动过滤过敏原相关菜品。如有不确定，请向食堂工作人员确认。
          </div>
        </div>
      </div>
    </div>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{dish.name}</h4>
          <p className="text-xs text-gray-400">{dish.canteen.replace('中南大学', '')} · {dish.window}</p>
        </div>
        <span className="font-bold text-primary-600 text-sm">¥{dish.price.toFixed(1)}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[dish.category]}`}>
          {categoryLabels[dish.category]}
        </span>
        {dish.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag-green">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Tag className="w-3 h-3" />
        {dish.mainIngredients.join('、')}
      </div>

      {dish.allergens.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertTriangle className="w-3 h-3" />
          过敏原: {dish.allergens.join('、')}
        </div>
      )}
    </div>
  );
}
