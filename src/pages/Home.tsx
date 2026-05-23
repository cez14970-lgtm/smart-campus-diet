import { Link } from 'react-router-dom';
import {
  Heart,
  UtensilsCrossed,
  ArrowRight,
  CheckCircle,
  Brain,
  Salad,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: '个性化健康画像',
    desc: '基于年龄、性别、BMI、运动频率、饮食目标等多维度数据，为你构建专属健康画像，精准匹配饮食方案。',
    color: 'bg-purple-500',
  },
  {
    icon: Salad,
    title: '食堂可落地餐食推荐',
    desc: '覆盖中南大学多个食堂的菜品库，根据你的健康画像从真实菜品中智能组合推荐套餐，可直接在食堂窗口买到。',
    color: 'bg-primary-500',
  },
  {
    icon: Users,
    title: '校园健康饮食社区',
    desc: '校园周边餐厅红黑榜、学生饮食经验分享论坛，连接中南学子的健康饮食社群，互相推荐、共同进步。',
    color: 'bg-accent-500',
  },
];

const highlights = [
  '覆盖4大食堂 · 30+ 菜品',
  'AI 规则引擎 · 秒级推荐',
  '过敏原自动过滤 · 安全第一',
  '套餐组合 · 营养均衡',
  '周边餐厅红黑榜 · 真实评测',
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                面向中南大学学生的 AI 饮食助手
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                膳识中南
                <span className="block text-primary-200 text-2xl md:text-3xl font-medium mt-2">
                  AI-powered personalized campus diet assistant for CSU students
                </span>
              </h1>
              <p className="text-lg text-primary-100 mb-8 max-w-xl">
                不再纠结"今天吃什么"——用 AI 了解你的身体需求，从食堂真实菜品中推荐最适合你的健康餐，让每一餐都吃得明白、吃得健康。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/profile" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-base py-3 px-8">
                  开始健康评估
                  <ArrowRight className="inline w-4 h-4 ml-1.5" />
                </Link>
                <Link to="/tech" className="btn-outline border-white/30 text-white hover:bg-white/10 text-base py-3 px-8">
                  了解技术方案
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                {highlights.map((h) => (
                  <span key={h} className="flex items-center gap-1.5 text-sm text-primary-100 bg-white/10 rounded-full px-3 py-1">
                    <CheckCircle className="w-3.5 h-3.5 text-primary-300" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <UtensilsCrossed className="w-20 h-20 mx-auto text-primary-200 mb-3" />
                    <p className="text-2xl font-bold">膳识中南</p>
                    <p className="text-primary-200 text-sm mt-1">SmartCampusDiet</p>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-3 py-2 text-gray-800 text-xs font-medium flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  健康评分 92
                </div>
                <div className="absolute -bottom-2 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 text-gray-800 text-xs font-medium flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-primary-500" />
                  30+ 食堂菜品
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="h-16 bg-gray-50" style={{
          clipPath: 'ellipse(55% 100% at 50% 100%)',
        }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              三大核心能力
            </h2>
            <p className="text-gray-500 text-lg">
              不只是推荐菜品，而是为你的健康画像找到最佳饮食方案
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card text-center group">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              三步开始健康饮食
            </h2>
            <p className="text-gray-500 text-lg">
              从填写画像到获取推荐，不到 2 分钟
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '填写健康画像', desc: '花1分钟填写你的基本信息、饮食目标和当前状态', icon: Brain },
              { step: '02', title: '获取 AI 饮食建议', desc: '系统分析你的画像，生成个性化饮食重点和营养建议', icon: Heart },
              { step: '03', title: '选择推荐套餐', desc: '从匹配的食堂套餐中选择喜欢的，一键模拟下单', icon: UtensilsCrossed },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                <div className="card text-center">
                  <span className="text-5xl font-bold text-primary-100">{s.step}</span>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto my-4">
                    <s.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-gray-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好了解最适合你的饮食方案了吗？
          </h2>
          <p className="text-primary-200 text-lg mb-8">
            基于你的个人健康数据，AI 为你精准推荐中南大学食堂里的最佳搭配
          </p>
          <Link to="/profile" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 text-lg py-3 px-10">
            免费开始评估
          </Link>
        </div>
      </section>
    </div>
  );
}
