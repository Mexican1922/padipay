import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import Home from "./pages/Home";
import Send from "./pages/Send";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import AddMoney from "./pages/AddMoney";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import TransactionDetail from "./pages/TransactionDetail";
import Notifications from "./pages/Notifications";
import Airtime from "./pages/Airtime";
import Data from "./pages/Data";
import Bills from "./pages/Bills";
import Betting from "./pages/Betting";

// Utility component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main window
    window.scrollTo(0, 0);

    // Also scroll any element with .hide-scroll if it's the scroll container
    const scrollContainers = document.querySelectorAll(".hide-scroll");
    scrollContainers.forEach((container) => {
      container.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}

// Redirect authenticated users away from login/register
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (session) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              style: { 
                background: '#1A1625', 
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid #362A43'
              } 
            }} 
          />
          <Routes>
            {/* Public routes — redirect to home if already logged in */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/send"
              element={
                <ProtectedRoute>
                  <Send />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-money"
              element={
                <ProtectedRoute>
                  <AddMoney />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction/:id"
              element={
                <ProtectedRoute>
                  <TransactionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/airtime"
              element={
                <ProtectedRoute>
                  <Airtime />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data"
              element={
                <ProtectedRoute>
                  <Data />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bills"
              element={
                <ProtectedRoute>
                  <Bills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/betting"
              element={
                <ProtectedRoute>
                  <Betting />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
