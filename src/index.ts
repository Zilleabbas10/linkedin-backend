import dotenv from 'dotenv';
dotenv.config({ override: true, quiet: true });

import express, { Request, Response } from 'express';
import { connectDB } from './connection';

connectDB();

const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!! Welcome to the LinkedIn Backend');
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
