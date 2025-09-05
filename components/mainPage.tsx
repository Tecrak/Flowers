import "./mainPage.css";

export function MainPage() {
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
                    <div className="flowerItem">
                        <img src="../public/flower.jpeg" alt="Red Rose" />
                        <p>Red Rose</p>
                        <span>$10.00</span>
                        <button>Add to Cart</button>
                    </div>
                    <div className="flowerItem">
                        <img src="./public/flower.jpeg" alt="Red Rose" />
                        <p>Red Rose</p>
                        <span>$10.00</span>
                        <button>Add to Cart</button>
                    </div>
                    <div className="flowerItem">
                        <img src="./public/flower.jpeg" alt="Red Rose" />
                        <p>Red Rose</p>
                        <span>$10.00</span>
                        <button>Add to Cart</button>
                    </div>
                    <div className="flowerItem">
                        <img src="./public/flower.jpeg" alt="Red Rose" />
                        <p>Red Rose</p>
                        <span>$10.00</span>
                        <button>Add to Cart</button>
                    </div>
                    <div className="flowerItem">
                        <img src="./public/flower.jpeg" alt="Red Rose" />
                        <p>Red Rose</p>
                        <span>$10.00</span>
                        <button>Add to Cart</button>
                    </div>
                    <div className="flowerItem">
                        <img src="./public/flower.jpeg" alt="Red Rose" />
                        <p>Red Rose </p>
                        <span>$10.00</span>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        </>
    );
}