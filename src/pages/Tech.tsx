import {
  Cpu,
  Layers,
  Database,
  Brain,
  Server,
  Shield,
  ArrowRight,
  Box,
  GitBranch,
  Palette,
  Search,
  type LucideIcon,
} from 'lucide-react';

interface TechCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  items?: string[];
}

function TechCard({ icon: Icon, title, desc, color, items }: TechCardProps) {
  return (
    <div className="card group">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
      {items && (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1 h-1 rounded-full bg-primary-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Tech() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm px-4 py-1.5 rounded-full mb-4">
            <Cpu className="w-4 h-4" />
            Technical Architecture
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">技术架构说明</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            当前 MVP 版本采用 "规则引擎 + RAG 预留 + 大模型解释" 的混合方案，
            在保证推荐准确性的同时，无需真实训练大模型，即可快速验证产品核心逻辑。
          </p>
        </div>

        {/* Architecture Overview - Flow Diagram */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-500" />
            系统架构总览
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: '用户画像层', desc: '健康信息采集', color: 'bg-violet-500' },
              { label: '规则引擎层', desc: '禁忌过滤 + 评分排序', color: 'bg-primary-500' },
              { label: '菜品匹配层', desc: '食堂菜品库匹配', color: 'bg-accent-500' },
              { label: '输出展示层', desc: '套餐推荐 + AI解释', color: 'bg-orange-500' },
            ].map((step) => (
              <div key={step.label} className="flex flex-col items-center text-center">
                <div className={`w-full ${step.color} text-white rounded-xl p-3 text-sm font-medium mb-2`}>
                  {step.label}
                </div>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed flow */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">推荐引擎详细流程</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                '用户画像输入',
                'BMI/代谢计算',
                '饮食目标解析',
                '过敏原过滤',
                '菜品标签匹配',
                '权重评分排序',
                '套餐智能组合',
                '自然语言解释生成',
                '推荐结果输出',
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700">
                    {i + 1}. {step}
                  </span>
                  {i < 8 && <ArrowRight className="w-3 h-3 text-gray-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack Cards */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Box className="w-5 h-5 text-primary-500" />
          技术栈
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <TechCard
            icon={Palette}
            title="前端框架"
            desc="采用 Vite + React 18 + TypeScript 构建，使用 Tailwind CSS 实现原子化样式，配合 lucide-react 图标库和 recharts 数据可视化。"
            color="bg-blue-500"
            items={['Vite 构建工具', 'React 18 + TypeScript', 'Tailwind CSS v4', 'React Router v7', 'lucide-react 图标', 'recharts 图表']}
          />
          <TechCard
            icon={Database}
            title="数据层"
            desc="MVP 阶段使用本地 Mock JSON 数据 + localStorage 持久化，无需后端服务器即可运行完整功能流程。"
            color="bg-green-500"
            items={['Mock JSON 菜品库 (30+)', 'Mock 社区数据', 'localStorage 画像存储', 'localStorage 订单记录', 'TypeScript 类型定义']}
          />
          <TechCard
            icon={Brain}
            title="AI 模块"
            desc="核心推荐采用规则引擎实现，为 RAG 知识库和大模型解释预留标准接口，可在不改变前端架构的情况下接入真实 AI 服务。"
            color="bg-purple-500"
            items={['规则引擎推荐', 'BMI/代谢计算', '标签权重评分', '过敏原过滤', 'RAG 接口预留', 'LLM 解释接口预留']}
          />
          <TechCard
            icon={Shield}
            title="安全与隐私"
            desc="所有用户数据仅存储在浏览器 localStorage 中，不上传至任何服务器。健康画像为本地计算，保护学生个人隐私。"
            color="bg-red-500"
            items={['数据仅本地存储', '不上传敏感信息', '无第三方追踪', '明确医疗免责声明']}
          />
          <TechCard
            icon={Server}
            title="部署与交付"
            desc="项目可直接构建为静态文件，部署至 GitHub Pages、Vercel 或 Netlify 等平台。也支持容器化部署和内网访问。"
            color="bg-orange-500"
            items={['npm run build 静态导出', 'GitHub Pages 部署', 'Vercel / Netlify 一键部署', 'Docker 容器化可选']}
          />
          <TechCard
            icon={Search}
            title="数据结构"
            desc="菜品、用户画像、套餐推荐均使用完整的 TypeScript 类型定义，保证数据一致性和代码可维护性。"
            color="bg-teal-500"
            items={['UserProfile 用户画像', 'Dish 菜品模型', 'MealPlan 套餐模型', 'Order 订单模型', 'Restaurant / ForumPost']}
          />
        </div>

        {/* Why Not Train a Model */}
        <div className="card gradient-card border-0 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            为什么 MVP 不从零训练大模型？
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: '成本与可行性',
                desc: '训练一个能理解营养学和个性化饮食需求的模型需要大量高质量标注数据，标注明细到食堂菜品的营养数据成本极高。MVP 阶段采用规则引擎可快速验证产品逻辑。',
              },
              {
                title: '准确性与可控性',
                desc: '规则引擎的输出100%可预测、可审计。对于涉及健康建议的场景，可控性比创造性更重要。LLM 可能产生不可控的推荐，在健康领域存在风险。',
              },
              {
                title: '渐进式架构',
                desc: '当前架构为 LLM 预留了标准接口。当积累足够用户反馈和真实菜品数据后，可平滑接入 RAG 营养知识库 + LLM 生成解释，形成"规则过滤 + AI 解释"的混合方案。',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/70 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Roadmap */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary-500" />
            后期扩展计划
          </h2>

          <div className="space-y-5">
            {[
              {
                phase: 'Phase 2',
                title: '数据层升级',
                color: 'bg-blue-500',
                items: [
                  '接入中南大学各食堂真实菜单数据（API/爬虫）',
                  '构建菜品营养数据库（热量、蛋白质、脂肪、碳水、维生素）',
                  '菜品标签自动化（基于食材和烹饪方式自动打标）',
                ],
              },
              {
                phase: 'Phase 3',
                title: 'AI 能力升级',
                color: 'bg-purple-500',
                items: [
                  '接入向量数据库（如 Milvus/Pinecone），实现 RAG 营养知识检索',
                  '接入 LLM API（如 Claude/GPT）生成个性化自然语言饮食解释',
                  '开发 LoRA 微调模型，识别中南大学学生特有的饮食意图和偏好',
                  '基于用户反馈的推荐效果持续优化',
                ],
              },
              {
                phase: 'Phase 4',
                title: '产品化升级',
                color: 'bg-green-500',
                items: [
                  '真实用户系统（注册/登录/个人中心）',
                  '真实订单系统（对接食堂点餐系统或自建订餐流程）',
                  '真实社区论坛（发帖/评论/点赞/收藏）',
                  '健康数据跟踪（体重/BMI 历史变化曲线）',
                  '小程序版本（微信小程序适配）',
                ],
              },
            ].map((phase) => (
              <div key={phase.phase} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 ${phase.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {phase.phase.split(' ')[1]}
                  </div>
                  <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    <span className={`${phase.color} text-white text-xs px-2 py-0.5 rounded-full mr-2`}>
                      {phase.phase}
                    </span>
                    {phase.title}
                  </h3>
                  <ul className="space-y-1 mt-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-3.5 h-3.5 text-primary-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Interface Reservations */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary-500" />
            预留接口说明
          </h2>
          <div className="bg-gray-900 rounded-2xl p-5 text-sm font-mono text-green-300 overflow-x-auto">
            <pre className="whitespace-pre-wrap leading-relaxed">{`
// ---- 接入真实大模型 API 的预留接口 ----
// 位置: src/lib/recommendation.ts

// 当前: 规则引擎生成推荐
function generateDietaryAdvice(profile: UserProfile): DietaryAdvice { ... }

// 后期: 混合方案
interface LLMExplanationInput {
  profile: UserProfile;
  ruleBasedAdvice: DietaryAdvice;
  ragContext: NutritionKnowledge[];
}

interface LLMExplanationOutput {
  personalExplanation: string;    // 个性化自然语言解释
  additionalTips: string[];       // 额外建议
  confidence: number;             // 置信度 (0-1)
}

// 预留调用位置
async function enrichWithLLM(
  input: LLMExplanationInput
): Promise<LLMExplanationOutput> {
  // TODO: 接入 Claude API / GPT API
  // const response = await fetch('/api/ai/explain', { ... });
  // return response.json();
  return { personalExplanation: '', additionalTips: [], confidence: 0 };
}

// RAG 知识库预留
interface NutritionKnowledge {
  id: string;
  topic: string;
  content: string;
  embedding: number[];          // 向量 embedding
  tags: string[];
}

// 后续可替换 src/data/ 中的 mock 数据为 API 调用
async function fetchRealMenu(): Promise<Dish[]> { ... }
          `.trim()}</pre>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            以上接口定义展示了从规则引擎平滑过渡到 AI 增强方案的技术路径。
            接口设计与现有类型系统完全兼容，不需要改动前端组件。
          </p>
        </div>
      </div>
    </div>
  );
}
