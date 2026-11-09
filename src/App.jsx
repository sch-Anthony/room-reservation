import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import Admin from "./pages/Admin";

import "./style.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
