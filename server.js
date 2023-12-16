// Import dependencies using ESM syntax
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

// Import controllers
import registerHandler from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';

// Create a knex database connection
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});

// Create an Express app
const app = express();

// Set the port
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints
app.get('/', (req, res) => {
  res.json({ message: 'API CONNECTED' });
});

app.post('/signin', signin.handleSignin);

app.post('/register', (req, res) => {
  registerHandler.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});

