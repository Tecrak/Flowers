import { useEffect, useState } from "react";
import "./cartPage.css";

type CartItem = {
  flowerId: number;
  name: string;
  price: number;
  quantity: number;
};

export function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Завантажуємо корзину з localStorage
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

  // Зміна кількості у корзині
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

  // Форматування локального часу користувача
  const getLocalDateTimeString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  };

  // Створення замовлення
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
      date: getLocalDateTimeString(), // локальний час користувача
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
      alert("Order placed successfully! ✅ ID: " + data.id);

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

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="cartContainer">
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item.flowerId} className="cartItem">
          <p>{item.name}</p>
          <span>${item.price.toFixed(2)}</span>
          <div>
            <button onClick={() => updateQuantity(item.flowerId, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.flowerId, 1)}>+</button>
          </div>
        </div>
      ))}
      <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>

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
        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
