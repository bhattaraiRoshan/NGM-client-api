import express from 'express';
import Stripe from 'stripe';

const paymentRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

paymentRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    const lineItems = products?.map((product) => {
      const priceToShow = product.salesPrice > 0 ? product.salesPrice : product.price;

      return {
        price_data: {
          currency: "aud",
          product_data: {
            name: product.name
          },
          unit_amount: priceToShow * 100 
        },
        quantity: product.quantityNeed
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], 
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_ROOT_URL}/success`,
      cancel_url: `${process.env.CLIENT_ROOT_URL}/error`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default paymentRouter;
