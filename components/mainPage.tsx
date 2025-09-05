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

  return (
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
  );
}
