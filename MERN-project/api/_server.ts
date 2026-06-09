import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import register from './auth/register';
import login from './auth/login';
import itemsHandler from './items/index';
import itemHandler from './items/[id]';
import uploadHandler from './upload';
import productsHandler from './products/index';
import productHandler from './products/[id]';
import ordersHandler from './orders/index';
import orderHandler from './orders/[id]';
import customersHandler from './customers/index';
import customerHandler from './customers/[id]';
import statsHandler from './dashboard/stats';
import aiChatHandler from './ai/chat';
import checkoutHandler from './stripe/checkout';
import webhookHandler from './stripe/webhook';
import googleHandler from './auth/google';

const app = express();

app.use(cors());
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleHandler);

app.post('/api/upload', uploadHandler);

app.get('/api/items', itemsHandler);
app.post('/api/items', itemsHandler);
app.get('/api/items/:id', itemHandler);
app.put('/api/items/:id', itemHandler);
app.delete('/api/items/:id', itemHandler);

app.get('/api/products', productsHandler);
app.post('/api/products', productsHandler);
app.get('/api/products/:id', productHandler);
app.put('/api/products/:id', productHandler);
app.delete('/api/products/:id', productHandler);

app.get('/api/orders', ordersHandler);
app.post('/api/orders', ordersHandler);
app.get('/api/orders/:id', orderHandler);
app.put('/api/orders/:id', orderHandler);
app.delete('/api/orders/:id', orderHandler);

app.get('/api/customers', customersHandler);
app.post('/api/customers', customersHandler);
app.get('/api/customers/:id', customerHandler);
app.put('/api/customers/:id', customerHandler);
app.delete('/api/customers/:id', customerHandler);

app.get('/api/dashboard/stats', statsHandler);
app.post('/api/ai/chat', aiChatHandler);
app.post('/api/stripe/checkout', checkoutHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
