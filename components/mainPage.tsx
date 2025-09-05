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
  flowers: string; 
};

export function MainPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [shops, setShops] = useState<FlowerShop[]>([]);

    useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowers")
        .then((res) => res.json())
        .then((data) => {
        if (Array.isArray(data)) {
            setFlowers(data);
        } else {
            console.error("Flowers data is not an array:", data);
        }
        })
        .catch((err) => console.error("Error fetching flowers:", err));
    }, []);

    useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowershop")
        .then((res) => res.json())
        .then((data) => {
        if (Array.isArray(data)) {
            setShops(data);
        } else {
            console.error("Flowers data is not an array:", data);
        }
        })
        .catch((err) => console.error("Error fetching flowers:", err));
    }, []);


  return (
    <div className="container">
      <div className="shopList">
        <p>Shops</p>
          <ul>
              {shops.map(shop => (
                <li key={shop.id}>
                  {shop.name}
                </li>
              ))}
            </ul>
      </div>

      <div className="flowerList">
        {flowers.map((flower) => (
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
