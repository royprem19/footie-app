import { useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Stores
import { useMatchStore } from './store/matchStore';
import { useAuthStore } from './store/authStore';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage'; // THE FIX: Using our upgraded Login Page!
import { MatchFeedPage } from './pages/MatchFeedPage';
import { MatchDetailsPage } from './pages/MatchDetailsPage';
import { CommunityPage } from './pages/CommunityPage';
import MyBookingsPage from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { VenuesPage } from './pages/VenuesPage';
import { VenueDetailsPage } from './pages/VenueDetailsPage';
import { SquadsPage } from './pages/SquadsPage';
import LeaderboardPage from './pages/LeaderboardPage';

const Navbar = () => {
  // THE FIX: Pull the REAL JWT user data from useAuthStore!
  const { user, profile, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="p-4 bg-surface border-b border-gray-800 flex justify-center sticky top-0 z-40 backdrop-blur-md bg-surface/80">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <Link to="/" className="text-xl font-black tracking-wider text-white">
          FOOTIE<span className="text-primary">.</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* 1. PUBLIC LINKS: Always visible to everyone so they can browse */}
          <Link to="/matches" className="hover:text-primary transition-colors text-sm font-medium">Find Matches</Link>
          <Link to="/venues" className="hover:text-primary transition-colors text-sm font-medium">Venues</Link>
          <Link to="/leaderboard" className="hover:text-primary transition-colors text-sm font-medium">Leaderboard</Link>

          {/* 2. PRIVATE LINKS: Only show these if a user is securely logged in */}
          {user && (
            <>
              <Link to="/squads" className="hover:text-primary transition-colors text-sm font-medium">Squads</Link>
              <Link to="/my-games" className="hover:text-primary transition-colors text-sm font-medium">My Bookings</Link>

              {/* SMART ADMIN ROUTER: Show the Admin tab ONLY if they have the admin role */}
              {role === 'admin' && (
                <Link to="/admin" className="text-secondary hover:text-white transition-colors text-sm font-black border border-secondary/30 px-2 py-1 rounded">Admin Panel</Link>
              )}
            </>
          )}

          <div className="flex gap-2 ml-4 pl-4 border-l border-gray-700">
            {!user ? (
              // If NO user is logged in, show the Sign In button
              <button onClick={() => navigate('/login')} className="text-sm bg-primary hover:bg-[#2ce00f] text-black px-5 py-2 rounded-lg transition-colors font-bold whitespace-nowrap">
                Sign In
              </button>
            ) : (
              // If a user IS logged in, show their profile badge and logout button
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-sm text-gray-300 hover:text-primary transition-colors whitespace-nowrap flex items-center gap-2 font-medium bg-gray-800/50 px-3 py-1.5 rounded-full">
                  {/* Bonus feature: Show the real avatar in the navbar! */}
                  <div className="w-5 h-5 bg-background border border-gray-700 rounded-full flex items-center justify-center text-xs shadow-sm">
                    {profile?.avatar || '⚽'}
                  </div>
                  {user.username}
                </Link>

                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-white transition-colors">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const { role } = useAuthStore();
  const { fetchDatabase } = useMatchStore();

  useEffect(() => {
    fetchDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1f2937', color: '#fff', borderRadius: '12px' } }} />
      <Navbar />

      <main className="max-w-4xl mx-auto">
        <Routes>
          {/* Smart Landing Route */}
          <Route path="/" element={
            role === 'guest' ? <LandingPage /> :
              role === 'admin' ? <Navigate to="/admin" replace /> :
                <Navigate to="/matches" replace />
          } />

          {/* THE FIX: Pointed the login routes to the correct LoginPage component */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth" element={<LoginPage />} />

          <Route path="/matches" element={<MatchFeedPage />} />
          <Route path="/matches/:id" element={<MatchDetailsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-games" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailsPage />} />
          <Route path="/squads" element={<SquadsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;