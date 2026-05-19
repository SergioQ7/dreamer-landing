/**
 * DREAMER Wholesale Portal — App Root
 * Design: Colombian Noir Editorial (dark theme)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import Catalog from "./pages/Catalog";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/admin"} component={AdminPage} />
      <Route path={"/admin/settings"} component={Admin} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/catalogo"} component={Catalog} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#1a1a2e",
                  color: "white",
                  border: "1px solid rgba(161,193,216,0.2)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                },
              }}
            />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
