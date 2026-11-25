import React, { useState } from 'react';
import { ShoppingBag, User, Shield, Menu, X, Gamepad2, Package, LogOut } from 'lucide-react';
import { useStoreState } from '../../services/store';

interface Props {
  currentRoute: string;
  navigate: (route: string, param?: string) => void;
}

export const Navbar: React.FC<Props> = ({ currentRoute, navigate }) => {
  const { cart, user, setUser } = useStoreState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartCount = cart.length;

  const handleNav = (route: string, param?: string) => {
    navigate(route, param);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setUserDropdownOpen(false);
    navigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-hsg-bg/90 backdrop-blur-md border-b border-hsg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/brand/hsgamelogopng.png"
            alt="HSGames"
            className="h-10 w-auto object-contain transition transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              HS<span className="text-hsg-purple">GAMES</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-hsg-muted font-medium">
              Social Gaming Solutions
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNav('home')}
            className={`text-sm font-semibold transition ${
              currentRoute === 'home' ? 'text-hsg-cyan font-bold' : 'text-hsg-muted hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('games')}
            className={`text-sm font-semibold transition ${
              currentRoute === 'games' ? 'text-hsg-cyan font-bold' : 'text-hsg-muted hover:text-white'
            }`}
          >
            Games
          </button>

          <button
            onClick={() => handleNav('bundles')}
            className={`text-sm font-semibold transition ${
              currentRoute === 'bundles' ? 'text-hsg-cyan font-bold' : 'text-hsg-muted hover:text-white'
            }`}
          >
            Game Packs
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`text-sm font-semibold transition ${
              currentRoute === 'about' ? 'text-hsg-cyan font-bold' : 'text-hsg-muted hover:text-white'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNav('contact')}
            className={`text-sm font-semibold transition ${
              currentRoute === 'contact' ? 'text-hsg-cyan font-bold' : 'text-hsg-muted hover:text-white'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Action Icons: Cart & Auth */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={() => handleNav('cart')}
            className="relative p-2.5 rounded-xl bg-hsg-card border border-hsg-border text-hsg-muted hover:text-white hover:border-hsg-purple transition"
            title="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-hsg-purple text-white text-[11px] font-bold flex items-center justify-center shadow-purple-glow animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-hsg-card border border-hsg-border hover:border-hsg-purple transition text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-hsg-purple to-hsg-purpleDark flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.fullName.substring(0, 1)}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <span className="block font-bold text-white leading-tight truncate max-w-[100px]">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-hsg-cyan uppercase font-semibold">
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-hsg-surface border border-hsg-border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-hsg-border/60">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-hsg-muted truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNav('customer-dashboard')}
                      className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-hsg-card flex items-center gap-2.5 transition"
                    >
                      <User className="w-4 h-4 text-hsg-cyan" />
                      <span>Customer Portal</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin-dashboard')}
                        className="w-full text-left px-4 py-2.5 text-xs text-hsg-purple hover:bg-hsg-card flex items-center gap-2.5 font-bold transition border-t border-hsg-border/40"
                      >
                        <Shield className="w-4 h-4 text-hsg-purple" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition border-t border-hsg-border/40 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="text-xs font-bold text-hsg-muted hover:text-white px-3 py-2 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="text-xs font-bold bg-hsg-purple hover:bg-hsg-purpleDark text-white px-4 py-2 rounded-xl shadow-purple-glow transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-hsg-muted hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-hsg-surface border-b border-hsg-border px-6 py-4 space-y-3">
          <button
            onClick={() => handleNav('home')}
            className="block w-full text-left text-sm font-semibold text-white py-1.5"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('games')}
            className="block w-full text-left text-sm font-semibold text-white py-1.5"
          >
            Games Marketplace
          </button>
          <button
            onClick={() => handleNav('bundles')}
            className="block w-full text-left text-sm font-semibold text-white py-1.5"
          >
            Game Packs
          </button>
          <button
            onClick={() => handleNav('about')}
            className="block w-full text-left text-sm font-semibold text-white py-1.5"
          >
            About HSGames
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="block w-full text-left text-sm font-semibold text-white py-1.5"
          >
            Contact
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin-dashboard')}
              className="block w-full text-left text-sm font-bold text-hsg-purple py-1.5 border-t border-hsg-border/60 pt-2"
            >
              🛡️ Admin Dashboard
            </button>
          )}
        </div>
      )}
    </header>
  );
};
