import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';

const stripe = new Stripe(env.stripe.secretKey, { apiVersion: '2024-06-20' as any });

const checkoutSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).default(1),
  shippingAddress: z.string().optional(),
});

export async function getProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json({ products: products.map((p) => ({ id: p.id, name: p.name, description: p.description, price: p.price, stock: p.stock, imageUrl: p.imageUrl })) });
  } catch (err) {
    next(err);
  }
}

export async function createCheckout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { productId, quantity, shippingAddress } = checkoutSchema.parse(req.body);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) throw new AppError('Product not found', 404);
    if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

    const totalAmount = product.price * quantity;

    // Create Stripe payment intent
    let stripePaymentIntentId: string | undefined;
    if (env.stripe.secretKey) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: 'usd',
        metadata: { userId: req.user!.id, productId },
      });
      stripePaymentIntentId = paymentIntent.id;
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        productId,
        quantity,
        totalAmount,
        stripePaymentIntentId,
        shippingAddress,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      orderId: order.id,
      clientSecret: stripePaymentIntentId ? (await stripe.paymentIntents.retrieve(stripePaymentIntentId)).client_secret : null,
      totalAmount,
    });
  } catch (err) {
    next(err);
  }
}

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig || !env.stripe.webhookSecret) {
    res.status(400).send('Webhook signature missing');
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.stripe.webhookSecret);
  } catch {
    res.status(400).send('Webhook signature verification failed');
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'PAID' },
    });
  }

  res.json({ received: true });
}
