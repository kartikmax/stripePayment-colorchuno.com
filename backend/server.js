require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
app.use(cors()); // Allow CORS for all origins

// POST route to create a checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { lineItems } = req.body;

    // console.log(lineItems, "here is 1");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});

// GET route to print "Hello, World!"
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
