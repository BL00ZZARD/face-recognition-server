const express = import('express');
const bodyParser = import('body-parser');
const bcrypt = import('bcrypt-nodejs');
const cors = import('cors');
const knex = import('knex')({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});

// Import controllers
// const register = require('./controllers/register');
import registerHandler from "./controllers/register.js";
const signin = import('./controllers/signin');
const profile = import('./controllers/profile');
const image = import('./controllers/image');

// Create a knex database connection


// Create an Express app
const app = express();

// Set the port
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors())
app.use(express.json());

// Endpoints
app.get('/', (req, res) => { res.json({ message: "API CONNECTED" }) })

app.post('/signin', signin.handleSignin)

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});