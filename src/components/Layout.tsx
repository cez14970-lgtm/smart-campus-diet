import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">膳</span>
              </div>
              <span className="text-white font-semibold">膳识中南 · SmartCampusDiet</span>
            </div>
            <p className="text-sm text-center md:text-right">
              AI 个性化校园健康饮食服务平台 | 中南大学创新创业项目<br />
              <span className="text-gray-500">
                温馨提示：本平台提供的是饮食建议，不构成医疗诊断。如有特殊健康状况请咨询专业医生。
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
