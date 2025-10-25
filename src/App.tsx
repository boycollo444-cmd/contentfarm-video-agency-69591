import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FontlabsHome from "./pages/FontlabsHome";
import Navigation from "./components/fontlabs/Navigation";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navigation />
        <Routes>
          <Route path="/" element={<FontlabsHome />} />
          {/* Placeholder routes - will be built in next iterations */}
          <Route path="/categories" element={<div className="p-8 text-center">Categories page coming soon</div>} />
          <Route path="/trending" element={<div className="p-8 text-center">Trending page coming soon</div>} />
          <Route path="/collections" element={<div className="p-8 text-center">Collections page coming soon</div>} />
          <Route path="/ai-tools" element={<div className="p-8 text-center">AI Tools page coming soon</div>} />
          <Route path="/community" element={<div className="p-8 text-center">Community page coming soon</div>} />
          <Route path="/premium" element={<div className="p-8 text-center">Premium page coming soon</div>} />
          <Route path="/profile" element={<div className="p-8 text-center">Profile page coming soon</div>} />
          <Route path="/favorites" element={<div className="p-8 text-center">Favorites page coming soon</div>} />
          <Route path="/font/:id" element={<div className="p-8 text-center">Font preview page coming soon</div>} />
          <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
