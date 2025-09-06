import { useEffect, useState } from "react";

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

export type CartItem = {
  flowerId: number;
  quantity: number;
};
export function dbConnector() {
    
    const [flowers, setFlowers] = useState<Flower[]>([]);
    const [shops, setShops] = useState<FlowerShop[]>([]);
    
    useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFlowers(data);
      });
  }, []);

  useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowershop")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setShops(data);
      });
  }, []);
    return {flowers, shops, setFlowers, setShops};
}