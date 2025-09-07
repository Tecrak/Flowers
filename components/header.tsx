import { Link } from "react-router-dom";
import "./header.css";

type HeaderProps = {
  onSortChange: (option: string) => void;
};

export function Header({ onSortChange }: HeaderProps) {
  return (
    <header>
      <div className="headerContent">
        <div className="leftPart">
          <Link to='/'>Shop</Link>
          <Link to='/cart'>Shopping cart</Link>
          <Link to='/orders'>Order history</Link>
        </div>
        <div className="logoImg">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="flower logo" />
        </div>
        <div className="rightPart">
          <div className="sortingBox">
            <span>Sort by:</span>
            <select name="sorting" id="sorting" onChange={(e) => onSortChange(e.target.value)}>
              <option value="">Choose</option>
              <option value="priceLow">Low to High</option>
              <option value="priceHigh">High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}