import React, { useState } from "react";
import Card from "./Card";
import "./styles.css";
import axios from "axios";
import products from "./Products.json";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [cartItems, setCartItems] = useState([]);
  const handleCheckout = async (items) => {
    console.log("Checkout clicked!");
    console.log("Items:", items);

    const lineItems = items.map((item) => {
      const { id, quantity } = item;
      const product = products.find((product) => product.id === id);

      if (!product) {
        console.log("Invalid item:", item);
        return null;
      }

      const { name, price, image } = product;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name,
            images: [image],
          },
          unit_amount: Math.round(price * 100), // Convert dollars to cents and round to nearest whole number
        },
        quantity,
      };
    });

    const validLineItems = lineItems.filter((item) => item !== null);

    if (validLineItems.length === 0) {
      console.log("No valid line items found.");
      return;
    }

    const total = validLineItems
      .reduce((acc, item) => {
        const price = item.price_data.unit_amount / 100;
        const quantity = item.quantity;
        return acc + price * quantity;
      }, 0)
      .toFixed(2);

    console.log("Total Price:", total, validLineItems); // It should be a number now

    try {
      // Make API request to create checkout session
      const response = await axios.post(
        `${backendUrl}/create-checkout-session`,
        { lineItems: validLineItems }
      );
      const { url } = response.data;
      // Redirect the user to the checkout URL
      window.location.href = url;
    } catch (error) {
      console.log("Error creating checkout session:", error);
    }
  };

  const addToCart = (product) => {
    const quantity = Number(product.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      // Quantity is not a valid number or is less than or equal to zero
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.id === existingItem.id ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const appStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  };

  return (
    <div>
      <div style={appStyle}>
        {products.map((product) => (
          <div key={product.id}>
            <Card
              product={product}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          </div>
        ))}
      </div>
      <div className="checkout">
        <h2>Checkout</h2>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity} - Subtotal: Rs
              {(item.price * item.quantity).toFixed(2)}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <p>
          Total: Rs
          {cartItems
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}
        </p>
        <button onClick={() => handleCheckout(cartItems)}>Checkout</button>
      </div>
    </div>
  );
};

export default Home;
