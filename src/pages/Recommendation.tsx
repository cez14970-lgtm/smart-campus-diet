import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UserProfile, DietaryAdvice } from '../types';
import { generateDietaryAdvice, calculateBMR } from '../lib/recommendation';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AlertTriangle, ThumbsUp, Lightbulb, ArrowRight } from 'lucide-react';

export default function Recommendation() {
  const navigate = useNavigate();
  const [advice, setAdvice] = useState<DietaryAdvice | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('smartcampusdiet-profile');
    if (!saved) {
      navigate('/profile');
      return;
    }
    const p = JSON.parse(saved) as UserProfile;
    setProfile(p);
    setAdvice(generateDietaryAdvice(p));
  }, [navigate]);

  if (!advice || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const radarData = [
    { subject: '蛋白质', value: advice.recommendedIngredients.filter((i) =>
      ['鸡胸肉','鸡蛋','牛肉','鱼','豆腐','牛奶','虾仁','猪肉'].some((p) => i.includes(p) || p.includes(i))
    ).length * 12, fullMark: 100 },
    { subject: '蔬菜纤维', value: advice.recommendedIngredients.filter((i) =>
      ['西兰花','黄瓜','南瓜','生菜','番茄','蔬菜','菠菜','青菜'].some((v) => i.includes(v) || v.includes(i))
    ).length * 12, fullMark: 100 },
    { subject: '低GI主食', value: advice.recommendedIngredients.filter((i) =>
      ['糙米','燕麦','玉米','小米','全麦','粗粮','杂粮'].some((w) => i.includes(w) || w.includes(i))
    ).length * 12, fullMark: 100 },
    { subject: '温热养胃', value: advice.recommendedIngredients.filter((i) =>
      ['银耳','小米','南瓜','山药','鱼肉','鸡蛋羹'].some((g) => i.includes(g) || g.includes(i))
    ).length * 12, fullMark: 100 },
    { subject: '维生素', value: advice.recommendedIngredients.filter((i) =>
      ['菠菜','胡萝卜','番茄','枸杞','水果','牛奶','坚果'].some((v) => i.includes(v) || v.includes(i))
    ).length * 12, fullMark: 100 },
  ];

  const macroData = [
    { name: '推荐食材', value: advice.recommendedIngredients.length },
    { name: '避免类别', value: advice.avoidFoods.length },
    { name: '今日重点', value: advice.dietFocus.length },
    { name: '风险提醒', value: advice.riskWarnings.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 饮食建议报告</h1>
          <p className="text-gray-500">基于你的健康画像智能生成的个性化饮食方案</p>
        </div>

        {/* BMI & BMR Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'BMI', value: `${advice.bmi}`, sub: advice.bmiCategory, color: 'bg-blue-50 text-blue-700' },
            { label: '基础代谢', value: `${calculateBMR(profile)}`, sub: 'kcal/天', color: 'bg-green-50 text-green-700' },
            { label: '饮食目标', value: `${profile.dietaryGoals.length || 1}`, sub: '个目标', color: 'bg-purple-50 text-purple-700' },
            { label: '过滤过敏原', value: `${profile.allergies.length || 0}`, sub: '项', color: 'bg-red-50 text-red-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
              <p className="text-xs opacity-70">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-70">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Radar & bar charts */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">营养关注雷达图</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#059669" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">建议概览</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: AI Summary Card */}
          <div className="lg:col-span-2 card gradient-card border-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <ThumbsUp className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900">AI 个性化饮食建议</h3>
            </div>
            <div className="bg-white/70 rounded-xl p-5 whitespace-pre-line text-sm text-gray-700 leading-relaxed">
              {advice.aiSummary}
            </div>
          </div>
        </div>

        {/* Diet Focus & Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Diet Focus */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              今日饮食重点
            </h3>
            <ul className="space-y-2">
              {advice.dietFocus.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Ingredients */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-500 text-lg">🥗</span>
              推荐多摄入
            </h3>
            <div className="flex flex-wrap gap-2">
              {advice.recommendedIngredients.map((i) => (
                <span key={i} className="tag-green">{i}</span>
              ))}
            </div>
          </div>

          {/* Avoid Foods */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠️</span>
              建议减少
            </h3>
            <div className="flex flex-wrap gap-2">
              {advice.avoidFoods.map((a) => (
                <span key={a} className="tag-red">{a}</span>
              ))}
            </div>
          </div>

          {/* Risk Warnings */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              风险提醒
            </h3>
            {advice.riskWarnings.length === 0 ? (
              <p className="text-sm text-gray-500">暂无明显风险项，请保持良好饮食和运动习惯。</p>
            ) : (
              <ul className="space-y-2">
                {advice.riskWarnings.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recommended Meal Plans Preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">为你推荐的食堂套餐</h2>
            <Link to="/canteen" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              查看全部 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {advice.recommendedMealPlans.map((plan) => (
              <div key={plan.id} className="card">
                <h4 className="font-bold text-gray-900 mb-1">{plan.name}</h4>
                <p className="text-xs text-gray-400 mb-3">
                  {plan.suitableFor.join(' · ')}
                </p>
                <ul className="space-y-1.5 mb-3">
                  {plan.dishes.map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{d.name}</span>
                      <span className="text-gray-400 text-xs">{d.window}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-primary-600">¥{plan.totalPrice.toFixed(1)}</span>
                  <Link to={`/order?plan=${plan.id}`} className="text-xs btn-primary py-1.5 px-3">
                    立即预订
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
          <strong>免责声明：</strong>以上建议由规则引擎基于你填写的健康画像自动生成，旨在辅助日常饮食决策。
          BMI 值为生活参考指标，不构成医疗诊断。如有特殊健康状况、过敏史或慢性疾病，请务必咨询专业医生或注册营养师。
        </div>
      </div>
    </div>
  );
}
