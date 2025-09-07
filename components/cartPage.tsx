import { useEffect, useState } from "react";
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

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Стейт для фінального блоку
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    const parsedCart: CartItem[] = storedCart
      ? JSON.parse(storedCart).map((item: any) => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }))
      : [];
    setCart(parsedCart);
  }, []);

  const updateQuantity = (flowerId: number, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.flowerId === flowerId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getLocalDateTimeString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  };

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!customerName || !email || !phone || !address) {
      return alert("Please fill in all fields!");
    }

    const flowersString = cart.map((item) => `${item.name} x${item.quantity}`).join(", ");

    const payload = {
      flowers: flowersString,
      price: totalPrice,
      customername: customerName,
      email,
      phone,
      address,
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

      // ✅ Зберігаємо дані замовлення
      setOrderInfo({
        id: data.id,
        flowers: cart,
        totalPrice,
        address,
        date: payload.date,
      });

      setCart([]);
      localStorage.removeItem("cartItems");
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
                    <span className="cartFlowerPrice">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p className="total">
                <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
              </p>
              <button
                className="submitOrder"
                type="submit"
                disabled={loading}
                onClick={placeOrder}
              >
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
