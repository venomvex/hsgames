import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { BundlesPage } from './pages/BundlesPage';
import { CartPage } from './pages/CartPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { DemoLaunchModal } from './components/demos/DemoLaunchModal';
import { GameItem } from './types';
import { useStoreState } from './services/store';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [selectedDemoGame, setSelectedDemoGame] = useState<GameItem | null>(null);

  const { games } = useStoreState();

  // Handle browser popstate & scroll to top on navigation
  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDemo = (game: GameItem) => {
    setSelectedDemoGame(game);
    setDemoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-white flex flex-col font-sans selection:bg-hsg-purple selection:text-white">
      {/* Navigation Bar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage navigate={navigate} onOpenDemo={handleOpenDemo} />
        )}

        {currentRoute === 'games' && (
          <GamesPage
            initialCategory={routeParam || 'All Games'}
            navigate={navigate}
            onOpenDemo={handleOpenDemo}
          />
        )}

        {currentRoute === 'game-details' && (
          <GameDetailPage
            slug={routeParam || games[0]?.slug || 'greedy-markhor'}
            navigate={navigate}
            onOpenDemo={handleOpenDemo}
          />
        )}

        {currentRoute === 'bundles' && (
          <BundlesPage navigate={navigate} />
        )}

        {currentRoute === 'cart' && (
          <CartPage navigate={navigate} />
        )}

        {currentRoute === 'customer-dashboard' && (
          <CustomerDashboard navigate={navigate} />
        )}

        {currentRoute === 'admin-dashboard' && (
          <AdminDashboard navigate={navigate} />
        )}

        {currentRoute === 'about' && (
          <AboutPage navigate={navigate} />
        )}

        {currentRoute === 'contact' && (
          <ContactPage />
        )}

        {currentRoute === 'login' && (
          <AuthPage initialMode="login" navigate={navigate} />
        )}

        {currentRoute === 'register' && (
          <AuthPage initialMode="register" navigate={navigate} />
        )}
      </main>

      {/* Live Interactive Demo Modal */}
      {selectedDemoGame && (
        <DemoLaunchModal
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
          gameTitle={selectedDemoGame.title}
          apkDownloadUrl={selectedDemoGame.demoApkUrl || 'https://pivrxmedemxuqbwryutw.supabase.co/storage/v1/object/public/public-demos/GreedyMarkhor-v1.0-demo.apk'}
        />
      )}

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
