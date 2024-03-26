// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', function(_req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
