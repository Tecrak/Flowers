import "./cartPage.css"; 

export function CartPage(){
    return (
        <>
        <div className="container">
        <div className="cartPage">
            <form className="form">
                <input type="text" placeholder="Name"></input>
                <input type="text" placeholder="Surname"></input>
                <input type="text" placeholder="Address"></input>
                <input type="text" placeholder="Phone number"></input>
            </form>
            <div className="cartItems">
                <div className="cartOrder">
                    <div className="orderImg">
                        <img src="/public/flower.jpeg"></img>
                    </div>
                    <div className="orderInfo">
                        <p>Flower name</p>
                        
                    </div>
                </div>
                <div className="cartOrder">
                    <div className="orderImg">
                        <img src="/public/flower.jpeg"></img>
                    </div>
                    <div className="orderInfo">
                        
                    </div>
                </div>
            </div>
        </div>
        <div className="endOrder">
            <div className="price">

            </div>
            <div className="orderButton">
                <button>Order</button>
            </div>
        </div>
        </div>
        </>
    )
}