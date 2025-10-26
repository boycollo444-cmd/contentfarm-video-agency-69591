import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import FontlabsHome from "./pages/FontlabsHome";
import Navigation from "./components/fontlabs/Navigation";
import ScrollToTop from "./components/ScrollToTop";
import Categories from "./pages/Categories";
import Trending from "./pages/Trending";
import Collections from "./pages/Collections";
import Premium from "./pages/Premium";
import AITools from "./pages/AITools";
import Profile from "./pages/Profile";
import FontDetail from "./pages/FontDetail";
import Auth from "./pages/Auth";
import PopulateFonts from "./pages/PopulateFonts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <Routes>
            <Route path="/" element={<FontlabsHome />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:category" element={<Categories />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/font/:id" element={<FontDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/populate" element={<PopulateFonts />} />
            <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
