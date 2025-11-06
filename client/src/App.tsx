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
import ArenaMode from "./pages/ArenaMode";
import ArenaTopicSelect from "./pages/ArenaTopicSelect";
import ArenaRoleSelect from "./pages/ArenaRoleSelect";
import ArenaCampSetup from "./pages/ArenaCampSetup";
import ArenaAudienceSelect from "./pages/ArenaAudienceSelect";
import ArenaDebate from "./pages/ArenaDebate";
import ArenaResult from "./pages/ArenaResult";
import ApplyCode from "./pages/access-code/ApplyCode";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCodes from "./pages/admin/AdminCodes";
import AdminGenerate from "./pages/admin/AdminGenerate";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminGenerateCode from "./pages/admin/AdminGenerateCode";
import { useEffect } from "react";
import { useAccessControl } from "./hooks/access-control/useAccessControl";

function Router() {
  const { activateByToken } = useAccessControl();

  useEffect(() => {
    // 检测 URL 中的 token 参数（专属链接）
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // 自动激活体验码
      activateByToken(token).then(result => {
        if (result.success) {
          // 显示成功提示
          alert(result.message);
          // 清除 URL 中的 token
          window.history.replaceState({}, document.title, window.location.pathname);
          // 刷新页面
          window.location.reload();
        } else {
          alert(result.message);
        }
      });
    }
  }, []);

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
      <Route path="/arena/mode" component={ArenaMode} />
      <Route path="/arena/topic" component={ArenaTopicSelect} />
      <Route path="/arena/role" component={ArenaRoleSelect} />
      <Route path="/arena/camp" component={ArenaCampSetup} />
      <Route path="/arena/audience" component={ArenaAudienceSelect} />
      <Route path="/arena/debate/:id" component={ArenaDebate} />
      <Route path="/arena/result/:id" component={ArenaResult} />
      <Route path="/apply-code" component={ApplyCode} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/codes" component={AdminCodes} />
      <Route path="/admin/generate" component={AdminGenerate} />
      <Route path="/admin/generate-code" component={AdminGenerateCode} />
      <Route path="/admin/applications" component={AdminApplications} />
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
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
