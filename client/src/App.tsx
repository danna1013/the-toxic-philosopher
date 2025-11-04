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
import DebateEntry from "./pages/debate/DebateEntry";
import DebateOngoing from "./pages/debate/DebateOngoing";
import DebateResult from "./pages/debate/DebateResult";

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
      <Route path="/debate" component={DebateEntry} />
      <Route path="/debate/ongoing/:id" component={DebateOngoing} />
      <Route path="/debate/result/:id" component={DebateResult} />
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
