import { useEffect, useState } from "react";
import "./mainPage.css";

type Flower = {
  id: number;
  name: string;
  price: number;
  imgPath: string;
};

export function MainPage() {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    // Підключення до твого Render вебсервісу
    fetch("postgresql://dbflower_user:n7XnpUufCGUHQCHngxQdT6h20Jh8gIuz@dpg-d2tfjeur433s73dcfok0-a/dbflower") // заміни на свій Render URL
      .then((res) => res.json())
      .then((data) => setFlowers(data))
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  return (
    <>
      <div className="container">
        <div className="shopList">
          <p>Shops</p>
          <ul>
            <li>Flowery Fragrant</li>
            <li>Bloomwell</li>
            <li>Petal Pushers</li>
            <li>Floral Fantasies</li>
            <li>Garden Grace</li>
          </ul>
        </div>

        <div className="flowerList">
          {flowers.map((flower) => (
            <div className="flowerItem" key={flower.id}>
              <img src={flower.imgPath} alt={flower.name} />
              <p>{flower.name}</p>
              <span>${flower.price.toFixed(2)}</span>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
