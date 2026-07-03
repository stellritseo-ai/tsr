import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { FloatingChat } from "@/components/site/FloatingChat";
import { incrementVisitors } from "@/lib/serverFunctions";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const isAdmin = routerState.location.pathname.startsWith("/admin");

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("tsr_visitor_session");
    if (!hasVisited) {
      sessionStorage.setItem("tsr_visitor_session", "active");
      incrementVisitors().catch(err => console.error("Failed to track visitor session:", err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {!isAdmin && <FloatingChat />}
    </QueryClientProvider>
  );
}
