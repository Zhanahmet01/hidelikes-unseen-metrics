import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/feed" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
    <Route path="/post/:id" element={<ProtectedRoute><Post /></ProtectedRoute>} />
    <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
    <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
