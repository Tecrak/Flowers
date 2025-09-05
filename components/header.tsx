import "./header.css"; 

export function Header() {
    return (
        <>
        <header>
            <div className="headerContent">
                <div className="leftPart"> {/*  I am creative in naming*/}
                    <a href="/">
                        Shop
                    </a>
                    <a href="/">
                        Shopping cart
                    </a>
                </div>
                <div className="logoImg">
                    <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="flower logo" />
                </div>
                <div className="rightPart">
                    <div className="sortingBox">
                        <span>Sort by:</span>
                        <select name="sorting" id="sorting">
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="nameAsc">Name: A-Z</option>
                            <option value="nameDesc">Name: Z-A</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
        </>
    )
}