import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { UserProfile, MealPlan, Order as OrderType } from '../types';
import { generateDietaryAdvice } from '../lib/recommendation';
import {
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  UtensilsCrossed,
} from 'lucide-react';

const canteens = ['中南大学二食堂', '中南大学三食堂', '南校区食堂', '铁道校区食堂'];
const timeSlots = [
  '11:00 - 11:30',
  '11:30 - 12:00',
  '12:00 - 12:30',
  '12:30 - 13:00',
  '17:00 - 17:30',
  '17:30 - 18:00',
  '18:00 - 18:30',
];

export default function Order() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan');
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [canteen, setCanteen] = useState(canteens[0]);
  const [pickupTime, setPickupTime] = useState(timeSlots[1]);
  const [delivery, setDelivery] = useState(false);
  const [dormitory, setDormitory] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('smartcampusdiet-profile');
    if (!saved) {
      navigate('/profile');
      return;
    }
    const profile = JSON.parse(saved) as UserProfile;
    setDormitory(profile.dormitory || '');

    const advice = generateDietaryAdvice(profile);
    const foundPlan = advice.recommendedMealPlans.find((p) => p.id === planId) || advice.recommendedMealPlans[0];
    setPlan(foundPlan || null);
    if (foundPlan) setCanteen(foundPlan.dishes[0]?.canteen || canteens[0]);
  }, [navigate, planId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    const newOrder: OrderType = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      mealPlan: plan,
      canteen,
      pickupTime,
      delivery,
      dormitory: delivery ? dormitory : '',
      totalPrice: delivery ? plan.totalPrice + 3 : plan.totalPrice,
      status: 'confirmed',
      createdAt: new Date().toLocaleString('zh-CN'),
    };

    setOrder(newOrder);
    setSubmitted(true);

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('smartcampusdiet-orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('smartcampusdiet-orders', JSON.stringify(orders));
  };

  if (submitted && order) {
    return <OrderSuccess order={order} />;
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">未找到套餐信息</p>
          <Link to="/canteen" className="text-primary-600 text-sm mt-2 inline-block">返回食堂推荐</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">确认订单</h1>
          <p className="text-gray-500">确认套餐选择和取餐信息后提交订单</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meal Plan Summary */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-primary-500" />
              套餐详情 — {plan.name}
            </h2>
            <div className="space-y-2">
              {plan.dishes.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-800">{d.name}</span>
                  <span className="text-xs text-gray-400">{d.window}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{plan.reason}</p>
          </div>

          {/* Pickup Info */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">取餐信息</h2>

            <div className="space-y-4">
              {/* Canteen */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  取餐食堂
                </label>
                <select
                  value={canteen}
                  onChange={(e) => setCanteen(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
                >
                  {canteens.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Pickup Time */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  取餐时间
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Truck className="w-3.5 h-3.5 text-primary-500" />
                    配送到宿舍楼下（+¥3.00）
                  </div>
                  <button
                    type="button"
                    onClick={() => setDelivery(!delivery)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      delivery ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        delivery ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
                {delivery && (
                  <input
                    type="text"
                    value={dormitory}
                    onChange={(e) => setDormitory(e.target.value)}
                    placeholder="输入宿舍楼号，如：升华公寓12栋"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-3">费用明细</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">套餐价格</span>
                <span className="font-medium">¥{plan.totalPrice.toFixed(1)}</span>
              </div>
              {delivery && (
                <div className="flex justify-between">
                  <span className="text-gray-500">配送费</span>
                  <span className="font-medium">¥3.00</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">预计总价</span>
                <span className="font-bold text-lg text-primary-600">
                  ¥{(delivery ? plan.totalPrice + 3 : plan.totalPrice).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pb-8">
            <button type="submit" className="btn-primary text-lg py-3 px-12 flex items-center gap-2">
              确认下单
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderSuccess({ order }: { order: OrderType }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="card text-center border-2 border-primary-100">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">下单成功！</h2>
          <p className="text-gray-500 text-sm mb-6">你的健康餐已预订，请按时前往食堂取餐</p>

          {/* Order Card */}
          <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">订单编号</span>
              <span className="text-sm font-mono font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">套餐名称</span>
              <span className="text-sm font-medium">{order.mealPlan.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">取餐食堂</span>
              <span className="text-sm">{order.canteen}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">取餐时间</span>
              <span className="text-sm">{order.pickupTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">配送</span>
              <span className="text-sm">{order.delivery ? `是 — ${order.dormitory}` : '否'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-400">实付金额</span>
              <span className="text-lg font-bold text-primary-600">¥{order.totalPrice.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">订单状态</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                已确认
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">下单时间</span>
              <span className="text-sm text-gray-500">{order.createdAt}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/canteen" className="btn-outline text-sm">
              返回食堂推荐
            </Link>
            <Link to="/" className="btn-primary text-sm">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
