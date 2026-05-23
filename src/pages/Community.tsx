import { useState } from 'react';
import { restaurants, forumPosts } from '../data/mockCommunity';
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Heart,
  DollarSign,
  Award,
} from 'lucide-react';

export default function Community() {
  const [tab, setTab] = useState<'restaurants' | 'forum'>('restaurants');

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">校园饮食社区</h1>
          <p className="text-gray-500">周边餐厅红黑榜 & 中南学子真实饮食分享</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <button
            onClick={() => setTab('restaurants')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'restaurants'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            周边红黑榜
          </button>
          <button
            onClick={() => setTab('forum')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'forum'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            饮食论坛
          </button>
        </div>

        {tab === 'restaurants' && <RestaurantList />}
        {tab === 'forum' && <ForumList />}
      </div>
    </div>
  );
}

function RestaurantList() {
  const redList = restaurants.filter((r) => r.isRedList);
  const blackList = restaurants.filter((r) => !r.isRedList);

  return (
    <div className="space-y-10">
      {/* Red List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            红榜 <span className="text-sm font-normal text-green-600 ml-1">推荐好店</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {redList.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>

      {/* Black List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            黑榜 <span className="text-sm font-normal text-red-600 ml-1">谨慎选择</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blackList.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant: r }: { restaurant: typeof restaurants[number] }) {
  return (
    <div className={`card relative ${r.isRedList ? '' : 'border-red-100'}`}>
      {r.isRedList ? (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          红榜
        </div>
      ) : (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          黑榜
        </div>
      )}

      <h3 className="font-bold text-gray-900 mb-2">{r.name}</h3>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {r.distance}m
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          人均 ¥{r.avgPrice}
        </span>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-green-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-lg">
            <Heart className="w-3.5 h-3.5" />
            {r.healthScore}
          </div>
          <p className="text-xs text-green-700">健康评分</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-600 font-bold text-lg">
            <Star className="w-3.5 h-3.5" />
            {r.tasteScore}
          </div>
          <p className="text-xs text-orange-700">口味评分</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {r.tags.map((t) => (
          <span key={t} className={
            r.isRedList ? 'tag-green' : 'tag-red'
          }>{t}</span>
        ))}
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-500 leading-relaxed">{r.reason}</p>
    </div>
  );
}

function ForumList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">最新讨论</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {forumPosts.map((post) => (
          <div key={post.id} className="card hover:border-primary-200 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{post.title}</h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.map((t) => (
                    <span key={t} className="tag-purple">{t}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{post.author}</span>
                    <span>{post.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.replies}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800 mt-6 flex items-start gap-2">
        <Award className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>MVP 说明：</strong>当前论坛帖子为 Mock 数据，展示产品功能形态。
          后期可接入真实学生论坛系统，支持发帖、评论、点赞、收藏、按标签检索等功能。
        </div>
      </div>
    </div>
  );
}
