import { useEffect, useState, useRef } from "react";
import "./cartPage.css";

type CartItem = {
  flowerId: number;
  name: string;
  price: number;
  quantity: number;
  imgPath: string;
};

type OrderInfo = {
  id: number;
  flowers: CartItem[];
  totalPrice: number;
  address: string;
  date: string;
};

type Shop = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopIds, setSelectedShopIds] = useState<number[]>([]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);

  // ----------------------
  // Load cart and shops
  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      setCart(parsed.items);
      if (parsed.shops) {
        setSelectedShopIds(parsed.shops.map((s: any) => s.id));
      }
    }

    fetch("https://flowers-1-h1qt.onrender.com/api/flowershop")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const parsedShops = data.map((s) => ({
            ...s,
            lat: Number(s.lat),
            lng: Number(s.lng),
          }));
          setShops(parsedShops);
        }
      })
      .catch((err) => console.error("Error loading shops:", err));
  }, []);

  // ----------------------
  // Load Google Maps
  useEffect(() => {
    if (!mapRef.current || !shops.length) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyADShnyF6KSrbAmaGreeu-xep64qhnj7pE&callback=initMap`;
    script.async = true;
    window.initMap = initMap;
    document.body.appendChild(script);
  }, [shops]);

  const initMap = () => {
    if (!mapRef.current) return;

    const gMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 50.4501, lng: 30.5234 },
      zoom: 12,
    });
    setMap(gMap);

    // Створюємо маркери для всіх магазинів у кошику
    markersRef.current = shops
      .filter((shop) => selectedShopIds.includes(shop.id))
      .map((shop) =>
        new window.google.maps.Marker({
          position: { lat: shop.lat, lng: shop.lng },
          map: gMap,
          title: shop.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        })
      );

    centerMapOnSelected();
  };

  const centerMapOnSelected = () => {
    if (selectedShopIds.length === 0 || !map) return;

    const selectedShops = shops.filter((s) => selectedShopIds.includes(s.id));
    const avgLat =
      selectedShops.reduce((sum, s) => sum + s.lat, 0) / selectedShops.length;
    const avgLng =
      selectedShops.reduce((sum, s) => sum + s.lng, 0) / selectedShops.length;
    map.setCenter({ lat: avgLat, lng: avgLng });
  };

  // ----------------------
  // Update marker colors при зміні selectedShopIds
  useEffect(() => {
    if (!map || !markersRef.current.length) return;

    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = shops
      .filter((shop) => selectedShopIds.includes(shop.id))
      .map((shop) =>
        new window.google.maps.Marker({
          position: { lat: shop.lat, lng: shop.lng },
          map: map,
          title: shop.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        })
      );

    centerMapOnSelected();
  }, [selectedShopIds, map]);

  // ----------------------
  const updateQuantity = (flowerId: number, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.flowerId === flowerId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);

      // Перевіряємо, чи залишилися магазини у кошику
      let shopsInCart = selectedShopIds;
      if (updated.length === 0) shopsInCart = [];

      localStorage.setItem(
        "cartData",
        JSON.stringify({
          items: updated,
          shops: shopsInCart.map((id) => shops.find((s) => s.id === id)),
        })
      );
      setSelectedShopIds(shopsInCart);
      return updated;
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getLocalDateTimeString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(
      2,
      "0"
    )}`;
  };

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!customerName || !email || !phone || !address) {
      return alert("Please fill in all fields!");
    }
    if (selectedShopIds.length === 0) return alert("Please select at least one shop!");

    const flowersString = cart.map((item) => `${item.name} x${item.quantity}`).join(", ");

    const payload = {
      flowers: flowersString,
      price: totalPrice,
      customername: customerName,
      email,
      phone,
      address,
      shopIds: selectedShopIds,
      date: getLocalDateTimeString(),
    };

    try {
      setLoading(true);
      const res = await fetch("https://flowers-1-h1qt.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      setOrderInfo({
        id: data.id,
        flowers: cart,
        totalPrice,
        address,
        date: payload.date,
      });

      setCart([]);
      setSelectedShopIds([]);
      localStorage.removeItem("cartData");
      setCustomerName("");
      setEmail("");
      setPhone("");
      setAddress("");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  return (
    <>
      <div className="cartContainer">
        <div className="customerInfo">
          <h3>Customer Information</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              placeOrder();
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </form>
          <div
            ref={mapRef}
            style={{ width: "100%", height: "300px", marginTop: "10px", border: "1px solid #ccc" }}
          ></div>
        </div>

        <div className="orderInfo">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p className="emptyCart">Your cart is empty.</p>
          ) : (
            <>
              <div className="orderItems">
                {cart.map((item) => (
                  <div key={item.flowerId} className="cartItem">
                    <p className="cartFlowerName">{item.name}</p>
                    <img src={item.imgPath} alt={item.name} />
                    <div className="amountButtons">
                      <button onClick={() => updateQuantity(item.flowerId, -1)}>-</button>
                      <span className="cartQuantity">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.flowerId, 1)}>+</button>
                    </div>
                    <span className="cartFlowerPrice">{item.price}</span>
                  </div>
                ))}
              </div>
              <p className="total">
                <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
              </p>
              <button className="submitOrder" disabled={loading} onClick={placeOrder}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </>
          )}
        </div>
      </div>

      {orderInfo && (
        <div className="orderStoryBlock">
          <h1>Order Details</h1>
          <h2>Order #{orderInfo.id}</h2>
          <div className="storyItems">
            {orderInfo.flowers.map((f) => (
              <div key={f.flowerId} className="storyItem">
                <img src={f.imgPath} alt={f.name} />
                <p className="storyFlower">{f.name}</p>
                <p>{f.quantity}x</p>
              </div>
            ))}
          </div>
          <div className="addStoryInfo">
            <div>
              <p>Total:</p>
              <p>Delivery Address:</p>
              <p>Date:</p>
            </div>
            <div>
              <p>${orderInfo.totalPrice.toFixed(2)}</p>
              <p>{orderInfo.address}</p>
              <p>{orderInfo.date}</p>
            </div>
          </div>
          <button onClick={() => setOrderInfo(null)}>Close</button>
        </div>
      )}
    </>
  );
}
