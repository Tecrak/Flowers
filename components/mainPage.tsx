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
  lat: number;
  lng: number;
};

export type CartItem = {
  flowerId: number;
  name: string;
  price: number;
  quantity: number;
  imgPath: string;
};

type MainPageProps = {
  sortOption: string;
};

export function MainPage({ sortOption }: MainPageProps) {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null); 
  const [selectedShopIdsInCart, setSelectedShopIdsInCart] = useState<number[]>([]);
  const [displayedFlowers, setDisplayedFlowers] = useState<Flower[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [shops, setShops] = useState<FlowerShop[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const FLOWERS_PER_PAGE = 6;
  
  useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/flowers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFlowers(data);
      })
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  useEffect(() => {
    if (flowers.length === 0) return;

    fetch("https://flowers-1-h1qt.onrender.com/api/flowershop")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShops(data);
          if (data.length > 0) handleShopClick(data[0]);
        }
      })
      .catch((err) => console.error("Error fetching shops:", err));
  }, [flowers]);

  const handleShopClick = (shop: FlowerShop) => {
    setSelectedShopId(shop.id);
    const shopFlowers = shop.flowers.split(",").map((f) => f.trim());
    const filtered = flowers.filter((flower) => shopFlowers.includes(flower.name));
    setDisplayedFlowers(filtered);
    setCurrentPage(0);
  };

  const toggleFavorite = (flowerId: number) => {
    setFavorites((prev) =>
      prev.includes(flowerId) ? prev.filter((id) => id !== flowerId) : [...prev, flowerId]
    );
  };

  const addToCart = (flower: Flower) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.flowerId === flower.id);
      const newCart = existing
        ? prev.map((item) =>
            item.flowerId === flower.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [
            ...prev,
            {
              flowerId: flower.id,
              name: flower.name,
              price: flower.price,
              quantity: 1,
              imgPath: flower.imgPath,
            },
          ];

      if (selectedShopId && !selectedShopIdsInCart.includes(selectedShopId)) {
        setSelectedShopIdsInCart((prevIds) => [...prevIds, selectedShopId]);
      }

      return newCart;
    });
  };

  const removeFromCart = (flowerId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.flowerId === flowerId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const saveCartToLocalStorage = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (selectedShopIdsInCart.length === 0) return alert("No shops selected in cart!");

    const shopsInCart = shops
      .filter((s) => selectedShopIdsInCart.includes(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        lat: Number(s.lat),
        lng: Number(s.lng),
      }));

    localStorage.setItem(
      "cartData",
      JSON.stringify({
        items: cart,
        shops: shopsInCart,
      })
    );

    alert("Items added to cart! Go to Cart page to place the order.");
  };

  const sortedFlowers = [...displayedFlowers].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;

    if (bFav - aFav !== 0) return bFav - aFav;

    if (sortOption === "priceLow") return a.price - b.price;
    if (sortOption === "priceHigh") return b.price - a.price;

    return 0;
  });

  const paginatedFlowers = sortedFlowers.slice(
    currentPage * FLOWERS_PER_PAGE,
    (currentPage + 1) * FLOWERS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedFlowers.length / FLOWERS_PER_PAGE);

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
        {cart.length > 0 && (
          <div className="cartSummary">
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button onClick={saveCartToLocalStorage}>Add all to Cart</button>
          </div>
        )}
      </div>

      <div className="flowerList">
        {paginatedFlowers.map((flower) => {
          const cartItem = cart.find((c) => c.flowerId === flower.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          const isFavorite = favorites.includes(flower.id);

          return (
            <div className="flowerItem" key={flower.id}>
              <div style={{ position: "relative" }}>
                <img src={flower.imgPath} alt={flower.name} />
                <button
                  className="likeButton"
                  style={{ color: isFavorite ? "red" : "#ccc" }}
                  onClick={() => toggleFavorite(flower.id)}
                >
                  ♥
                </button>
              </div>
              <p>{flower.name}</p>
              <span>${Number(flower.price).toFixed(2)}</span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => removeFromCart(flower.id)} disabled={quantity === 0}>
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => addToCart(flower)}>+</button>
              </div>
            </div>
          );
        })}

        {totalPages > 1 && (
          <div style={{ width: "100%", textAlign: "center", marginTop: "15px" }}>
            {currentPage > 0 && (
              <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            )}

            <span style={{ margin: "0 10px" }}>
              Page {currentPage + 1} of {totalPages}
            </span>

            {currentPage + 1 < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

