import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
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
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      setLocation("/login");
    }
  }, [session, loading, setLocation]);

  if (loading) return null;
  if (!session) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={PasswordPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/">
        <ProtectedRoute>
          <SidebarLayout>
            <DashboardPage />
          </SidebarLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/chatbot">
        <ProtectedRoute><SidebarLayout><ChatbotPage /></SidebarLayout></ProtectedRoute>
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
        <ProtectedRoute><SidebarLayout><AppointmentsPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/tagebuch">
        <ProtectedRoute><SidebarLayout><JournalPage /></SidebarLayout></ProtectedRoute>
      </Route>
      <Route path="/gewicht">
        <ProtectedRoute><SidebarLayout><WeightPage /></SidebarLayout></ProtectedRoute>
      </Route>
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
