import { Route, Router } from "wouter-preact";
import { useHashLocation } from "wouter-preact/use-hash-location";
import { Homepage } from "./projects/homepage/homepage.tsx";
import { IntervalTimer } from "./projects/interval-timer/interval-timer.tsx";
import { Lamp } from "./projects/lamp/lamp.tsx";

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/" component={Homepage} />
      <Route path="/interval-timer" component={IntervalTimer} />
      <Route path="/lamp" component={Lamp} />
    </Router>
  );
}
