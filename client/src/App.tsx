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
      <Route path="/arena/mode" component={ArenaMode} />
      <Route path="/arena/topic" component={ArenaTopicSelect} />
      <Route path="/arena/role" component={ArenaRoleSelect} />
      <Route path="/arena/camp" component={ArenaCampSetup} />
      <Route path="/arena/audience" component={ArenaAudienceSelect} />
      <Route path="/arena/debate/:id" component={ArenaDebate} />
      <Route path="/arena/result/:id" component={ArenaResult} />
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
