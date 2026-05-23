import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types';
import { ArrowRight, Save } from 'lucide-react';

const defaultForm: UserProfile = {
  name: '',
  age: 20,
  gender: 'male',
  height: 170,
  weight: 65,
  exerciseFrequency: 'light',
  dietaryGoals: [],
  allergies: [],
  recentStatus: [],
  dormitory: '',
};

const goalOptions = [
  { value: '健身增肌', icon: '💪', label: '健身增肌' },
  { value: '减脂控重', icon: '⚖️', label: '减脂控重' },
  { value: '熬夜恢复', icon: '🌙', label: '熬夜恢复' },
  { value: '压力较大', icon: '😰', label: '压力较大' },
  { value: '清淡饮食', icon: '🥬', label: '清淡饮食' },
  { value: '胃部不适', icon: '🫃', label: '胃部不适' },
  { value: '饮食规律改善', icon: '⏰', label: '饮食规律改善' },
];

const allergyOptions = ['花生', '鸡蛋', '牛奶', '海鲜', '大豆', '小麦', '坚果'];
const statusOptions = ['熬夜', '备考', '压力', '运动训练', '生理期', '睡眠不足', '消化不良'];
const frequencyOptions = [
  { value: 'sedentary', label: '久坐不动' },
  { value: 'light', label: '轻度运动（每周1-2次）' },
  { value: 'moderate', label: '中等运动（每周3-4次）' },
  { value: 'active', label: '积极运动（每周5-6次）' },
  { value: 'very_active', label: '高强度训练（每天）' },
];

const dormitoryOptions = [
  '南校区升华公寓',
  '校本部学生公寓',
  '铁道校区学生公寓',
  '湘雅校区学生公寓',
  '后湖小区',
];

export default function Profile() {
  const navigate = useNavigate();
  const saved = localStorage.getItem('smartcampusdiet-profile');
  const initial = saved ? JSON.parse(saved) as UserProfile : defaultForm;
  const [form, setForm] = useState<UserProfile>(initial);
  const [hasProfile, setHasProfile] = useState(!!saved);

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: 'dietaryGoals' | 'allergies' | 'recentStatus', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v: string) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('smartcampusdiet-profile', JSON.stringify(form));
    setHasProfile(true);
    navigate('/recommendation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人健康画像</h1>
          <p className="text-gray-500">
            填写以下信息，AI 将为你生成专属饮食建议。所有数据仅保存在本地浏览器。
          </p>
          {hasProfile && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
              <Save className="w-3.5 h-3.5" />
              已保存画像，修改后将自动更新
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary-500 rounded-full" />
              基本信息
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名/昵称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="你的名字（选填）"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => update('age', +e.target.value)}
                  min={15}
                  max={60}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <div className="flex gap-3">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => update('gender', g)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        form.gender === g
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {{ male: '男', female: '女', other: '其他' }[g]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">运动频率</label>
                <select
                  value={form.exerciseFrequency}
                  onChange={(e) => update('exerciseFrequency', e.target.value as UserProfile['exerciseFrequency'])}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
                >
                  {frequencyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => update('height', +e.target.value)}
                  min={140}
                  max={220}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => update('weight', +e.target.value)}
                  min={35}
                  max={200}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Dietary Goals */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-accent-500 rounded-full" />
              饮食目标（多选）
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {goalOptions.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => toggleArray('dietaryGoals', g.value)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.dietaryGoals.includes(g.value)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-red-500 rounded-full" />
              过敏/忌口（多选）
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {allergyOptions.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArray('allergies', a)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.allergies.includes(a)
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              如有其他过敏原暂未列出，请在推荐结果中手动避开对应菜品
            </p>
          </div>

          {/* Recent Status */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-yellow-500 rounded-full" />
              近期状态（多选）
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleArray('recentStatus', s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.recentStatus.includes(s)
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Dormitory */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-purple-500 rounded-full" />
              宿舍楼（用于配送推荐）
            </h2>
            <select
              value={form.dormitory}
              onChange={(e) => update('dormitory', e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
            >
              <option value="">选择宿舍楼</option>
              {dormitoryOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-center pb-8">
            <button type="submit" className="btn-primary text-lg py-3 px-12 flex items-center gap-2">
              生成 AI 饮食建议
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
