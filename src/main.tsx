import { render } from "preact";
import { Homepage } from "./projects/homepage/homepage.tsx";
import "./styles.css";

render(<Homepage />, document.getElementById("app")!);
