import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import VideoLab from "./pages/VideoLab";
import AudioLab from "./pages/AudioLab";
import ImageLab from "./pages/ImageLab";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/video" component={VideoLab} />
        <Route path="/audio" component={AudioLab} />
        <Route path="/image" component={ImageLab} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
