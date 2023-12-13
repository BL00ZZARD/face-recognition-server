const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Import controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Create a knex database connection
const db = knex({
  client: 'pg',
  connection: {
    host: '192.168.1.156',
    port: 5432,
    user: 'postgres',
    password: 'lizandro',
    database: 'smart_brain'
  }
});

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