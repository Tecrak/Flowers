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
      <Header onSortChange={setSortOption} />
      <Routes>
        <Route path='/' element={<MainPage sortOption={sortOption} />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/orders' element={<OrderStory />} />
      </Routes>
    </Router>
  );
}

export default App;