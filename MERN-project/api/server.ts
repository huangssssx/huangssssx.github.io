import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import register from './auth/register';
import login from './auth/login';
import itemsHandler from './items/index';
import itemHandler from './items/[id]';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/items', itemsHandler);
app.post('/api/items', itemsHandler);
app.get('/api/items/:id', itemHandler);
app.put('/api/items/:id', itemHandler);
app.delete('/api/items/:id', itemHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
