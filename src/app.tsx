import { Route, Router, Switch } from "wouter-preact";
import { useHashLocation } from "wouter-preact/use-hash-location";
import { Homepage } from "@/projects/homepage/homepage.tsx";
import { IntervalTimer } from "@/projects/interval-timer/interval-timer.tsx";
import { PizzaDoughCalculator } from "@/projects/pizza-dough/pizza-dough-calculator.tsx";
import { Lamp } from "@/projects/lamp/lamp.tsx";
import { NotFound } from "@/projects/not-found/not-found.tsx";
import { WorkoutTracker } from "@/projects/workout-tracker/workout-tracker.tsx";

export function App() {
  if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
    return <NotFound />;
  }

  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Homepage} />
        <Route path="/interval-timer" component={IntervalTimer} />
        <Route path="/pizza-dough" component={PizzaDoughCalculator} />
        <Route path="/lamp" component={Lamp} />
        <Route path="/workout-tracker" component={WorkoutTracker} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
