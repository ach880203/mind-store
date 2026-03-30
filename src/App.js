import "./App.css";
import { BrowserRouter  } from "react-router-dom";
import AnimatedRoutes from "./routes";

function App() {
  // CRA 개발 서버에서는 PUBLIC_URL이 비어 있으므로 basename을 비워 두어야
  // localhost 루트 경로(/)에서도 라우터가 정상적으로 화면을 그립니다.
  const routerBaseName = process.env.PUBLIC_URL || undefined;

  return (
    <BrowserRouter  basename={routerBaseName}>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
