// signin.mjs

import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PW || 'lizandro',
        database: process.env.DATABASE_DB || 'face_recognition_server',
    }
});

const handleSignin = (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check for missing form fields
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    // Query the 'login' table to get email and hash
    db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            // Compare the provided password with the stored hash
            const isValid = bcrypt.compareSync(password, data[0].hash);

            if (isValid) {
                // If password is valid, fetch user details from the 'usersname' table
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        console.log(user[0]);
                        res.json(user[0]);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json('Unable to get user');
                    });
            } else {
                // If password is invalid, return an error
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => {
          console.error(err);
          res.status(400).json('Wrong credentials');
        });
};

export default {
  handleSignin,
};
