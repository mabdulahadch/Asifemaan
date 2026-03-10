import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PoetProfile from "./pages/user/poetdetail/PoetProfile";
import Home from "./pages/user/Home";
import UserPanel from "./pages/user/poetdetail/UserPanel";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPoets from "./pages/admin/AdminPoets";
import AdminContent from "./pages/admin/AdminContent";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";
import PoetAllView from "./pages/user/poetdetail/PoetAllView";
import GhazalSection from "./pages/user/sections/GhazalSection";
import SherSection from "./pages/user/sections/SherSection";
import NazmSection from "./pages/user/sections/NazmSection";
import EBookSection from "./pages/user/sections/EBookSection";
import AudioSection from "./pages/user/sections/AudioSection";
import VideoSection from "./pages/user/sections/VideoSection";
import GhazalDetailView from "./pages/user/sections/GhazalDetailView";
import SherDetailView from "./pages/user/sections/SherDetailView";
import NazmDetailView from "./pages/user/sections/NazmDetailView";
import EBookDetailView from "./pages/user/sections/EBookDetailView";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>

              {/* <Route path="/" element={<Navigate to="/poet" replace />} /> */}
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/poet/:id" element={<PoetProfile />}>
                <Route index element={<PoetAllView />} />
                <Route path="profile" element={<PoetAllView />} />
                <Route path="ghazal" element={<GhazalSection />} />
                <Route path="ghazal/:contentId" element={<GhazalDetailView />} />
                <Route path="nazm" element={<NazmSection />} />
                <Route path="nazm/:contentId" element={<NazmDetailView />} />
                <Route path="sher" element={<SherSection />} />
                <Route path="sher/:contentId" element={<SherDetailView />} />
                <Route path="ebook" element={<EBookSection />} />
                <Route path="ebook/:contentId" element={<EBookDetailView />} />
                <Route path="audio" element={<AudioSection />} />
                <Route path="video" element={<VideoSection />} />
              </Route>

              {/* Protected User routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-profile" element={<UserPanel />} />
              </Route>

              {/* Protected Admin routes */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/profile" replace />} />
                  <Route path="profile" element={<AdminPoets />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="settings" element={<AdminSiteSettings />} />
                </Route>
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer/>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
