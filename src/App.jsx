import { AuthPage } from './pages/AuthPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { useEffect } from 'react';
import { useMatchStore } from './store/matchStore';
import { Toaster } from 'react-hot-toast';
import { SquadsPage } from './pages/SquadsPage';
import { VenueDetailsPage } from './pages/VenueDetailsPage';
import { VenuesPage } from './pages/VenuesPage';
import { LandingPage } from './pages/LandingPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { MatchFeedPage } from './pages/MatchFeedPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import MyBookingsPage from './pages/MyBookingsPage';
import { MatchDetailsPage } from './pages/MatchDetailsPage';
import { LoginPage } from './pages/LoginPage'; // 1. Import the new Login Page
const Navbar = () => {
  // Use the REAL matchStore that contains our Django JWT token and currentUser
  const { currentUser, logout } = useMatchStore();
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
          <Link to="/community" className="hover:text-primary transition-colors text-sm font-medium">Leaderboard</Link>

          {/* 2. PRIVATE LINKS: Only show these if a user is securely logged in */}
          {currentUser && (
            <>
              <Link to="/squads" className="hover:text-primary transition-colors text-sm font-medium">Squads</Link>
              <Link to="/my-games" className="hover:text-primary transition-colors text-sm font-medium">My Bookings</Link>

              {/* SMART ADMIN ROUTER: Show the Admin tab ONLY if the Django is_admin flag is true */}
              {currentUser.isAdmin && (
                <Link to="/admin" className="text-secondary hover:text-white transition-colors text-sm font-black border border-secondary/30 px-2 py-1 rounded">Admin Panel</Link>
              )}
            </>
          )}

          <div className="flex gap-2 ml-4 pl-4 border-l border-gray-700">
            {!currentUser ? (
              // If NO user is logged in, show the Sign In button
              <button onClick={() => navigate('/login')} className="text-sm bg-primary hover:bg-[#2ce00f] text-black px-5 py-2 rounded-lg transition-colors font-bold whitespace-nowrap">
                Sign In
              </button>
            ) : (
              // If a user IS logged in, show their profile badge and logout button
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-sm text-gray-300 hover:text-primary transition-colors whitespace-nowrap flex items-center gap-2 font-medium bg-gray-800/50 px-3 py-1.5 rounded-full">
                  <div className="w-5 h-5 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black uppercase">
                    {currentUser.username?.charAt(0)}
                  </div>
                  {currentUser.username}
                </Link>

                <button onClick={handleLogout} className="text-xs font-bold text-danger hover:text-white transition-colors">Logout</button>
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
  // Pull the fetch function from your store
  const { fetchDatabase } = useMatchStore();

  // Run it exactly once when the app first loads
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

          <Route path="/login" element={<AuthPage />} />
          <Route path="/matches" element={<MatchFeedPage />} />
          <Route path="/matches/:id" element={<MatchDetailsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-games" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailsPage />} />
          <Route path="/squads" element={<SquadsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;