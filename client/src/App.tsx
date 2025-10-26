import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import AddTitles from "./pages/AddTitles";
import Websites from "./pages/Websites";
import Pinterest from "./pages/Pinterest";
import Settings from "./pages/Settings";
import Logs from "./pages/Logs";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/add-titles">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <AddTitles />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/websites">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <Websites />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/pinterest">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <Pinterest />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/logs">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <Logs />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route path="/" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

