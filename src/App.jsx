import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// ... (imports remain same)
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SelectionPage from './pages/SelectionPage';
import JackpotPage from './pages/JackpotPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserSettings from './pages/UserSettings';
import PersonalInfoPage from './pages/PersonalInfoPage';
import NotificationsPage from './pages/NotificationsPage';
import PrivacySecurityPage from './pages/PrivacySecurityPage';
import HelpSupportPage from './pages/HelpSupportPage';
import RulesPage from './pages/RulesPage';
import ResultsPage from './pages/ResultsPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import MyTickets from './pages/MyTickets';
import TopUpPage from './pages/TopUpPage';
import WithdrawPage from './pages/WithdrawPage';
import UserTransactions from './pages/UserTransactions';

import PageWrapper from './components/PageWrapper';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminControl from './pages/admin/AdminControl';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';

const FullPageLoader = () => (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-8">
     <div className="relative">
        <div className="w-20 h-20 border-[3px] border-gray-100 border-t-red-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 bg-red-600 rounded-full"></div>
           </div>
        </div>
     </div>
     <div className="mt-8 text-center">
        <h2 className="text-xl font-black italic uppercase tracking-[0.2em] text-gray-900">Authenticating</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 italic">Securing SMS Lottery Connection...</p>
     </div>
  </div>
);

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/home" replace />;
  
  return children;
};

// --- Unified Landing Logic ---
const LandingPage = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  // Redirect based on database role from a single port
  return user.role === 'admin' 
    ? <Navigate to="/admin" replace /> 
    : <Navigate to="/home" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/home" element={
            <ProtectedRoute role="user">
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/rules" element={<ProtectedRoute><RulesPage /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute role="user"><CartPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute role="user"><UserSettings /></ProtectedRoute>} />
          <Route path="/settings/personal-info" element={<ProtectedRoute role="user"><PersonalInfoPage /></ProtectedRoute>} />
          <Route path="/settings/notifications" element={<ProtectedRoute role="user"><NotificationsPage /></ProtectedRoute>} />
          <Route path="/settings/privacy" element={<ProtectedRoute role="user"><PrivacySecurityPage /></ProtectedRoute>} />
          <Route path="/settings/help" element={<ProtectedRoute role="user"><HelpSupportPage /></ProtectedRoute>} />

          <Route path="/select/:gameId" element={<ProtectedRoute role="user"><SelectionPage /></ProtectedRoute>} />
          <Route path="/jackpot" element={<ProtectedRoute role="user"><JackpotPage /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute role="user"><MyTickets /></ProtectedRoute>} />
          <Route path="/topup" element={<ProtectedRoute role="user"><TopUpPage /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute role="user"><WithdrawPage /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute role="user"><UserTransactions /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><AdminLayout><AdminAnnouncements /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/control" element={<ProtectedRoute role="admin"><AdminLayout><AdminControl /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users/:userId" element={<ProtectedRoute role="admin"><AdminLayout><AdminUserDetails /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/approvals" element={<ProtectedRoute role="admin"><AdminLayout><AdminApprovals /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/withdrawals" element={<ProtectedRoute role="admin"><AdminLayout><AdminWithdrawals /></AdminLayout></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
