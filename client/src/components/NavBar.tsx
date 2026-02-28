import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: '首页', path: '/' },
  { label: '一对一开怼', path: '/select' },
  { label: '哲学奇葩说', path: '/arena/mode' },
];

export default function NavBar() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'nav-glass shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <button
              onClick={() => setLocation('/')}
              className="flex flex-col gap-0 group cursor-pointer"
            >
              <span className="text-lg md:text-xl font-bold tracking-wide text-white/95 group-hover:text-white transition-colors">
                毒舌哲学家
              </span>
              <span className="text-[10px] md:text-xs font-medium tracking-[0.25em] text-white/40 group-hover:text-white/60 transition-colors uppercase">
                The Toxic Philosopher
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.external) {
                      window.open(item.path, '_blank');
                    } else {
                      setLocation(item.path);
                    }
                  }}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    location === item.path
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.external && (
                    <span className="ml-1 text-[10px] opacity-50">↗</span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-[72px] left-0 right-0 p-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.external) {
                    window.open(item.path, '_blank');
                  } else {
                    setLocation(item.path);
                  }
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-6 py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                  location === item.path
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
