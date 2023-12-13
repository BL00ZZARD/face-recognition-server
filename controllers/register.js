const handleRegister = (req, res, db, bcrypt) => {
    const { email,name,password} = req.body;

    // Check for missing form fields
    if(!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    // Hash the password using bcrypt
    const hash = bcrypt.hashSync(password);

    // Use a transaction to ensure data consistency in the database
    db.transaction(trx => {
        // Insert hashed password and email into the 'login' table
        trx.insert({
          hash: hash,
          email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      // Insert user details into the 'usersname' table
      return trx('usersname')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          console.log("Registration successful");
          res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(trx.rollback);
    })
    .catch(err => {
        console.log(err); 
        res.status(400).json('Unable to register');
    });
};

export default handleRegister;

// module.exports = {
//     handleRegister: handleRegister
// };