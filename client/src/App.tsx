import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AnimalHospital from "./pages/AnimalHospital";
import { useState } from "react";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dandy-world"} component={Home} />
      <Route path={"/animal-hospital"} component={AnimalHospital} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeSwitcher() {
  const [location] = useLocation();
  const isAnimalHospital = location === "/animal-hospital";
  
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <a
        href="/dandy-world"
        className={`px-4 py-2 rounded-lg font-bold transition-all ${
          !isAnimalHospital
            ? "bg-[#FF1493] text-white shadow-lg shadow-[#FF1493]/50"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        Dandy's World
      </a>
      <a
        href="/animal-hospital"
        className={`px-4 py-2 rounded-lg font-bold transition-all ${
          isAnimalHospital
            ? "bg-[#4ECDC4] text-[#0f2818] shadow-lg shadow-[#4ECDC4]/50"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        Animal Hospital
      </a>
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <ThemeSwitcher />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
