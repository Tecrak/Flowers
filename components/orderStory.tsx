import "./cartPage.css";
import "./orderStory.css";
import { useEffect, useState } from "react";

type FlowerDB = {
  id: number;
  name: string;
  imgPath: string;
};

type FlowerItem = {
  id: number;
  name: string;
  quantity: number;
  imgPath: string;
};

type Order = {
  id: number;
  name: string;
  phone: string;
  email: string;
  price: number | string;
  flowers: FlowerItem[] | string;
  address: string;
  date: string;
};

export function OrderStory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [flowersDB, setFlowersDB] = useState<FlowerDB[]>([]);
  const [orderInfo, setOrderInfo] = useState<Order & { flowersWithImg: FlowerItem[] } | null>(null);
  const [filterId, setFilterId] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPhone, setFilterPhone] = useState("");

  useEffect(() => {
    fetch("https://flowers-1-h1qt.onrender.com/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));

    fetch("https://flowers-1-h1qt.onrender.com/api/flowers")
      .then((res) => res.json())
      .then((data) => setFlowersDB(data))
      .catch((err) => console.error("Error fetching flowers:", err));
  }, []);

  const openOrder = (order: Order) => {
    const flowersArray: FlowerItem[] = Array.isArray(order.flowers)
      ? order.flowers
      : order.flowers.split(",").map((f) => {
          const [name, qty] = f.split(" x");
          return {
            id: 0,
            name: name.trim(),
            quantity: Number(qty),
            imgPath: "",
          };
        });

    const flowersWithImg = flowersArray.map((f) => {
      const flowerDB = flowersDB.find((db) => db.name === f.name);
      return {
        ...f,
        id: flowerDB ? flowerDB.id : f.id,
        imgPath: flowerDB ? flowerDB.imgPath : "",
      };
    });

    setOrderInfo({ ...order, flowersWithImg });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesId = filterId ? order.id.toString().includes(filterId) : true;
    const matchesEmail = filterEmail ? order.email.toLowerCase().includes(filterEmail.toLowerCase()) : true;
    const matchesPhone = filterPhone ? order.phone.includes(filterPhone) : true;
    return matchesId && matchesEmail && matchesPhone;
  });

  return (
    <>
      <div className="orderStoryContainer">
        <div className="storyFilter">
          <input
            type="text"
            placeholder="Order ID"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone number"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
          />
        </div>

        <div className="orderStory">
        {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="storyOrderInfo"
              style={{ cursor: "pointer" }}
              onClick={() => openOrder(order)}
            >
            <h3>Order</h3>
            <h2>{order.name}</h2>
            <p>Id: {order.id}</p>
            <p>Phone Number: {order.phone}</p>
            <p>Email: {order.email}</p>
            <p>Money spent: {order.price}$</p>
            </div>
          ))}
        {filteredOrders.length === 0 && <p>No orders found.</p>}
        </div>
      </div>

      {orderInfo && (
        <div className="orderStoryBlock">
          <h1>Order Details</h1>
          <h2>Order #{orderInfo.id}</h2>
          <div className="storyItems">
            {orderInfo.flowersWithImg.map((f) => (
              <div key={f.id} className="storyItem">
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
              <p>{orderInfo.price}</p>
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

