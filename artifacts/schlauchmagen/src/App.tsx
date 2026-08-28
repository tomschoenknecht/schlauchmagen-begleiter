import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import OnboardingPage from "@/pages/onboarding";
import SchlauchmagenOderBypass from "@/pages/info/schlauchmagen-oder-bypass";
import KlinikterminFragen from "@/pages/info/kliniktermin-fragen";
import WasDanachPassiert from "@/pages/info/was-danach-passiert";
import BinIchGeeignet from "@/pages/info/bin-ich-geeignet";
import RisikenBetroffene from "@/pages/info/risiken-betroffene";
import WegZurOp from "@/pages/info/weg-zur-op";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import PasswordPage from "@/pages/password";
import AuthCallbackPage from "@/pages/auth-callback";
import DashboardPage from "@/pages/dashboard";
import RequirementsPage from "@/pages/requirements";
import AppointmentsPage from "@/pages/appointments";
import JournalPage from "@/pages/journal";
import WeightPage from "@/pages/weight";
import EingangstestPage from "@/pages/eingangstest";
import BeratungPage from "@/pages/beratung";
import BeratungSchlauchmagenPage from "@/pages/beratung-schlauchmagen";
import BeratungBypassPage from "@/pages/beratung-bypass";
import BeratungRisikenPage from "@/pages/beratung-risiken";
import BeratungSubstitutionPage from "@/pages/beratung-substitution";
import ChatbotPage from "@/pages/chatbot";
import UpgradePage from "@/pages/upgrade";
import KontoPage from "@/pages/konto";
import ImpressumPage from "@/pages/impressum";
import DatenschutzPage from "@/pages/datenschutz";
import { TierGate } from "@/components/feature-gate";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      setLocation("/");
    }
  }, [session, loading, setLocation]);

  if (loading) return null;
  if (!session) return null;
  return <>{children}</>;
}

// Startseite: anonyme Besucher sehen die Landing (indexierbar), eingeloggte das Dashboard.
function HomeRoute() {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (session) {
    return (
      <SidebarLayout>
        <DashboardPage />
      </SidebarLayout>
    );
  }
  return <PasswordPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login"><Redirect to="/" /></Route>
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/onboarding">
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      </Route>
      <Route path="/">
        <HomeRoute />
      </Route>
      <Route path="/chatbot">
        <ProtectedRoute><SidebarLayout><TierGate need="deluxe" feature="KI-Begleiter" mode="lock"><ChatbotPage /></TierGate></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/upgrade">
        <ProtectedRoute><SidebarLayout><UpgradePage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/konto">
        <ProtectedRoute><SidebarLayout><KontoPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/eingangstest">
        <ProtectedRoute><SidebarLayout><EingangstestPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/beratung">
        <ProtectedRoute><SidebarLayout><BeratungPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/beratung/schlauchmagen">
        <ProtectedRoute><SidebarLayout><BeratungSchlauchmagenPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/beratung/bypass">
        <ProtectedRoute><SidebarLayout><BeratungBypassPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/beratung/risiken">
        <ProtectedRoute><SidebarLayout><BeratungRisikenPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/beratung/substitution">
        <ProtectedRoute><SidebarLayout><BeratungSubstitutionPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/voraussetzungen">
        <ProtectedRoute><SidebarLayout><RequirementsPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/termine">
        <ProtectedRoute><SidebarLayout><TierGate need="basis" feature="Termine" mode="preview"><AppointmentsPage /></TierGate></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/tagebuch">
        <ProtectedRoute><SidebarLayout><TierGate need="basis" feature="Tagebuch" mode="preview"><JournalPage /></TierGate></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/gewicht">
        <ProtectedRoute><SidebarLayout><TierGate need="basis" feature="Gewichtsprotokoll" mode="preview"><WeightPage /></TierGate></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/impressum" component={ImpressumPage} />
      <Route path="/datenschutz" component={DatenschutzPage} />
      <Route path="/info/schlauchmagen-oder-bypass" component={SchlauchmagenOderBypass} />
      <Route path="/info/kliniktermin-fragen" component={KlinikterminFragen} />
      <Route path="/info/was-danach-passiert" component={WasDanachPassiert} />
      <Route path="/info/bin-ich-geeignet" component={BinIchGeeignet} />
      <Route path="/info/risiken-betroffene" component={RisikenBetroffene} />
      <Route path="/info/weg-zur-op" component={WegZurOp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
