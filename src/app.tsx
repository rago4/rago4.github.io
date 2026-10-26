import { Route, Router } from "wouter-preact";
import { useHashLocation } from "wouter-preact/use-hash-location";
import { Homepage } from "./projects/homepage/homepage.tsx";

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/" component={Homepage} />
    </Router>
  );
}
