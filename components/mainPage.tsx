import { useEffect, useState } from "react";
import "./mainPage.css";

type Flower = {
  id: number;
  name: string;
  price: number;
  imgPath: string;
};

type FlowerShop = {
  id: number;
  name: string;
  flowers: string; // наприклад: "Lilly, Rose"
};

export function MainPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [shops, setShops] = useState<FlowerShop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [displayedFlowers, setDisplayedFlowers] = useState<Flower[]>([]);

  // Завантажуємо всі квіти
  useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFlowers(data);
        else console.error("Flowers data is not an array:", data);
      })
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  // Завантажуємо всі магазини і вибираємо перший після того, як flowers вже є
  useEffect(() => {
    if (flowers.length === 0) return; // чекаємо поки квіти завантажаться

    fetch("https://flowers-1-h1qt.onrender.com/api/flowershops")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShops(data);
          if (data.length > 0) handleShopClick(data[0]);
        } else {
          console.error("Shops data is not an array:", data);
        }
      })
      .catch((err) => console.error("Error fetching shops:", err));
  }, [flowers]); // залежність від flowers

  // Обробка вибору магазину
  const handleShopClick = (shop: FlowerShop) => {
    setSelectedShopId(shop.id);
    const shopFlowers = shop.flowers.split(",").map((f) => f.trim());
    const filtered = flowers.filter((flower) => shopFlowers.includes(flower.name));
    setDisplayedFlowers(filtered);
  };

  return (
    <div className="container">
      <div className="shopList">
        <p>Shops</p>
        <ul>
          {shops.map((shop) => (
            <li
              key={shop.id}
              style={{
                cursor: "pointer",
                fontWeight: selectedShopId === shop.id ? "bold" : "normal",
              }}
              onClick={() => handleShopClick(shop)}
            >
              {shop.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flowerList">
        {displayedFlowers.map((flower) => (
          <div className="flowerItem" key={flower.id}>
            <img src={flower.imgPath} alt={flower.name} />
            <p>{flower.name}</p>
            <span>${Number(flower.price).toFixed(2)}</span>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
