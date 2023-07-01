import React, { useState } from "react";
import "./styles.css";

const Card = ({ product, addToCart }) => {
  const { color, name, price } = product;
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const subtotal = (price * quantity).toFixed(2);

  const cardStyle = {
    backgroundColor: color,
    height: "200px",
    borderRadius: "10px",
    width: "100%",
  };

  const handleShowDetails = () => {
    const item = {
      ...product,
      quantity: quantity,
    };
    addToCart(item);
    // console.log(item);
  };

  return (
    <div className="card">
      <div style={cardStyle} className="card_image" />
      <div className="card_content">
        <h2 className="card_name">{name}</h2>
        <p className="card_price">Rs {price}</p>
        <div className="card_quantity">
          <button onClick={handleDecrement}>-</button>
          <span>Quantity : {quantity}</span>
          <button onClick={handleIncrement}>+</button>
        </div>
        <p className="card_subtotal">Subtotal: Rs {subtotal}</p>
        <button className="card_button" onClick={handleShowDetails}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
