import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "../components/MainPage";
import { CartPage } from "../components/cartPage.tsx";
import { Header } from "../components/header";

export function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/components/cartPage.tsx" element={<CartPage />} />
      </Routes>
    </Router>
  );
}
export default App