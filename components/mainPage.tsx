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

export type CartItem = {
  flowerId: number;
  quantity: number;
};

export function MainPage() {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [displayedFlowers, setDisplayedFlowers] = useState<Flower[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [shops, setShops] = useState<FlowerShop[]>([]);

  // Завантаження квітів
  useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFlowers(data);
      })
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  // Завантаження магазинів
  useEffect(() => {
    if (flowers.length === 0) return;

    fetch("https://flowers-1-h1qt.onrender.com/api/flowershop")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShops(data);
          if (data.length > 0) handleShopClick(data[0]); // вибрати перший магазин
        }
      })
      .catch((err) => console.error("Error fetching shops:", err));
  }, [flowers]);

  // Вибір магазину
  const handleShopClick = (shop: FlowerShop) => {
    setSelectedShopId(shop.id);
    const shopFlowers = shop.flowers.split(",").map((f) => f.trim());
    const filtered = flowers.filter((flower) => shopFlowers.includes(flower.name));
    setDisplayedFlowers(filtered);
  };

  // Додати в корзину
  const addToCart = (flowerId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.flowerId === flowerId);
      if (existing) {
        return prev.map((item) =>
          item.flowerId === flowerId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { flowerId, quantity: 1 }];
      }
    });
  };

  // Прибрати з корзини
  const removeFromCart = (flowerId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.flowerId === flowerId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Оформлення замовлення
  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    const orderedFlowers = cart
      .map((item) => {
        const flower = flowers.find((f) => f.id === item.flowerId);
        return flower ? `${flower.name} x${item.quantity}` : "";
      })
      .join(", ");

    const totalAmount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
      const flower = flowers.find((f) => f.id === item.flowerId);
      return sum + (flower ? flower.price * item.quantity : 0);
    }, 0);

    try {
      const res = await fetch("https://flowers-1-h1qt.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowers: orderedFlowers,
          price: totalPrice,
          amount: totalAmount,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      alert("Order placed! ✅ ID: " + data.id);

      setCart([]);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order");
    }
  };

  // Підрахунок для відображення
  // const totalAmount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const flower = flowers.find((f) => f.id === item.flowerId);
    return sum + (flower ? flower.price * item.quantity : 0);
  }, 0);

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
        {displayedFlowers.map((flower) => {
          const cartItem = cart.find((c) => c.flowerId === flower.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          return (
            <div className="flowerItem" key={flower.id}>
              <img src={flower.imgPath} alt={flower.name} />
              <p>{flower.name}</p>
              <span>${Number(flower.price).toFixed(2)}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <button onClick={() => removeFromCart(flower.id)} disabled={quantity === 0}>
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => addToCart(flower.id)}>+</button>
                <p>Total price: ${totalPrice.toFixed(2)}</p>
                <button onClick={placeOrder} disabled={cart.length === 0}>
                  Place Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
