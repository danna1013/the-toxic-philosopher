import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SelectPhilosopher from "./pages/SelectPhilosopher";
import SocratesIntro from "./pages/SocratesIntro";
import WittgensteinIntro from "./pages/WittgensteinIntro";
import NietzscheIntro from "./pages/NietzscheIntro";
import KantIntro from "./pages/KantIntro";
import FreudIntro from "./pages/FreudIntro";
import Chat from "./pages/Chat";
import Design from "./pages/Design";
import MobileGuide from "./pages/MobileGuide";
import { useState, useEffect } from "react";
import { isMobileDevice } from "./lib/device-detect";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/select" component={SelectPhilosopher} />
      <Route path="/intro/socrates" component={SocratesIntro} />
      <Route path="/intro/wittgenstein" component={WittgensteinIntro} />
      <Route path="/intro/nietzsche" component={NietzscheIntro} />
      <Route path="/intro/kant" component={KantIntro} />
      <Route path="/intro/freud" component={FreudIntro} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/design" component={Design} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [isMobile, setIsMobile] = useState(() => {
    // 初始化时就检测，避免白屏
    try {
      return typeof window !== 'undefined' && window.innerWidth < 768;
    } catch {
      return false; // 错误时默认为PC端
    }
  });

  useEffect(() => {
    // 检测设备类型
    const checkDevice = () => {
      try {
        setIsMobile(isMobileDevice());
      } catch (error) {
        console.error('Device detection error:', error);
        setIsMobile(false);
      }
    };
    
    checkDevice();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 移动设备显示引导页
  if (isMobile) {
    return (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <MobileGuide />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  // PC端显示完整应用
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
