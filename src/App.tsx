import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Header} from '../components/header'
import {MainPage} from '../components/mainPage'
import {CartPage} from '../components/cartPage'
import { useState } from "react";
import {OrderStory} from '../components/orderStory';


export function App() {
  const [sortOption, setSortOption] = useState<string>("");

  return (
    <Router>
      {/* Header тепер має доступ до сортування */}
      <Header onSortChange={setSortOption} />
      <Routes>
        {/* Передаємо sortOption у MainPage */}
        <Route path="/" element={<MainPage sortOption={sortOption} />} />
        <Route path="/components/cartPage.tsx" element={<CartPage />} />
        <Route path="/components/orderStory.tsx" element={<OrderStory />} />
      </Routes>
    </Router>
  );
}

export default App;
