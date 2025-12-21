import "./App.css";
import { BrowserRouter  } from "react-router-dom";
import AnimatedRoutes from "./routes";

function App() {
  return (
    <BrowserRouter  basename="/mind-store">
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
