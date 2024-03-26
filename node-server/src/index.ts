// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import path from 'path';
import sqlite3 from 'sqlite3';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
let db: sqlite3.Database;

app.get('/', function(_req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

//Route to get post on uploads
app.post('/uploads', function(_req, res) {
  //Get image attribute from request
  const image = _req.body.image;
  //It is base64 encoded, so we need to decode it
  //Insert this base64 image into the database
  db.run(`INSERT INTO fingerprints(fingerprint) VALUES(?)`, [image], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Image inserted into the database.');
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  //Init sqlite db from file database.db
  db = new sqlite3.Database('database.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  //Create table fingerprints
  db.run(`CREATE TABLE IF NOT EXISTS fingerprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fingerprint TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Table fingerprints created.');
  });
  //Clear table fingerprints
  db.run(`DELETE FROM fingerprints`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Table fingerprints cleared.');
  });
});
