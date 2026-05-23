import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  UtensilsCrossed,
  User,
  Heart,
  ShoppingCart,
  MessageCircle,
  Cpu,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: '首页', icon: UtensilsCrossed },
  { to: '/profile', label: '健康画像', icon: User },
  { to: '/recommendation', label: 'AI 建议', icon: Heart },
  { to: '/canteen', label: '食堂推荐', icon: UtensilsCrossed },
  { to: '/community', label: '饮食社区', icon: MessageCircle },
  { to: '/tech', label: '技术架构', icon: Cpu },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-primary-800">膳识中南</span>
              <span className="text-xs text-gray-400 ml-1.5">SmartCampusDiet</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link to="/canteen" className="ml-2 btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4" />
              立即订餐
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/canteen"
                onClick={() => setOpen(false)}
                className="btn-primary text-center text-sm mt-2 flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                立即订餐
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
