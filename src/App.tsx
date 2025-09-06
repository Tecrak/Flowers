import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Header} from '../components/header'
import {MainPage} from '../components/mainPage'
import {CartPage} from '../components/cartPage'

export function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;