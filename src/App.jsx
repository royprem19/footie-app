import { ProfilePage } from './pages/ProfilePage';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { MatchFeedPage } from './pages/MatchFeedPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { MatchDetailsPage } from './pages/MatchDetailsPage';
import { LoginPage } from './pages/LoginPage'; // 1. Import the new Login Page

const Navbar = () => {
  const { role, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // 2. Send them to the login page when they log out!
  };

  return (
    <nav className="p-4 bg-surface border-b border-gray-800 flex justify-center sticky top-0 z-40 backdrop-blur-md bg-surface/80">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <Link to="/" className="text-xl font-black tracking-wider text-white">
          FOOTIE<span className="text-primary">.</span>
        </Link>

        <div className="flex items-center gap-4">
          {role === 'player' && (
            <>
              <Link to="/matches" className="hover:text-primary transition-colors text-sm font-medium">Find Matches</Link>
              <Link to="/my-games" className="hover:text-primary transition-colors text-sm font-medium">My Bookings</Link>
            </>
          )}
          {role === 'admin' && (
            <Link to="/admin" className="hover:text-secondary transition-colors text-sm font-medium">Admin Area</Link>
          )}

          <div className="flex gap-2 ml-4 pl-4 border-l border-gray-700">
            {role === 'guest' ? (
              // 3. Replace the two buttons with ONE button that goes to the login route
              <button onClick={() => navigate('/login')} className="text-sm bg-primary hover:bg-[#2ce00f] text-black px-5 py-2 rounded-lg transition-colors font-bold whitespace-nowrap">
                Sign In
              </button>
            ) : (
              <div className="flex gap-2 ml-4 pl-4 border-l border-gray-700">
                {role === 'guest' ? (
                  <button onClick={() => navigate('/login')} className="text-sm bg-primary hover:bg-[#2ce00f] text-black px-5 py-2 rounded-lg transition-colors font-bold whitespace-nowrap">
                    Sign In
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* UPGRADED: The name is now a clickable link to the profile */}
                    <Link to="/profile" className="text-sm text-gray-300 hover:text-primary transition-colors whitespace-nowrap flex items-center gap-2 font-medium bg-gray-800/50 px-3 py-1.5 rounded-full">
                      <div className="w-5 h-5 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      {user?.name}
                    </Link>

                    <button onClick={handleLogout} className="text-xs font-bold text-danger hover:text-white transition-colors">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#171717', color: '#fff', border: '1px solid #333' },
      }} />
      <Navbar />

      <main className="max-w-4xl mx-auto">
        <Routes>
          {/* 4. Default route now redirects to login if they are a guest */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/matches" element={<MatchFeedPage />} />
          <Route path="/matches/:id" element={<MatchDetailsPage />} />
          <Route path="/my-games" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;