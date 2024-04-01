// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import path from 'path';
import sqlite3 from 'sqlite3';
var bodyParser = require('body-parser');
import { Image, CanvasRenderingContext2D } from 'canvas';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
let db: sqlite3.Database;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.get('/', function(_req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

function fingerprint_from_noised(noised: string, r: number, g: number, b: number, a: number) {
  var width = 200;
  var height = 50;
  var image = new Image();
  image.src = noised;
  var context = new CanvasRenderingContext2D();
  context.drawImage(image, 0, 0, width, height);
  var imageData = context.getImageData(0, 0, width, height);
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var index = ((i * (width * 4)) + (j * 4));
      imageData.data[index + 0] = imageData.data[index + 0] - r;
      imageData.data[index + 1] = imageData.data[index + 1] - g;
      imageData.data[index + 2] = imageData.data[index + 2] - b;
      imageData.data[index + 3] = imageData.data[index + 3] - a;
    }
  }
  context.putImageData(imageData, 0, 0);
  return context.canvas.toDataURL();
}

//Route to get post on uploads
app.post('/uploads', function(req, res) {
  //Get image attribute from request
  console.log(req.body)
  const image = req.body.image;
  const noise = req.body.noise[0].split(',');
  console.log(fingerprint_from_noised(image, Number(noise[0]), Number(noise[1]), Number(noise[2]), Number(noise[3])))
  //It is base64 encoded, so we need to decode it
  //Insert this base64 image into the database
  /* db.run(`INSERT INTO fingerprints(fingerprint) VALUES(?)`, [image], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Image inserted into the database.');
  }); */
  res.sendStatus(200);
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
