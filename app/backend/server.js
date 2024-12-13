// import modules
import jwt from 'jsonwebtoken';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

// constant and middleware
const app = express();
env.config();
const port = process.env.PORTNUMBER;
const saltRounds = 10;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// CONECTION TO DATABASE
const db = new pg.Client({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.PASSWORD,
  port: process.env.PORT_NAME,
});
db.connect();


// SEND Conformation mail
const sendConfirmationEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS,
    }
  });

  const mailOptions = {
    from: "justaddtrial@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
}

// Sign Up Page
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try{
    // checking for already register
    const check_result = await db.query("SELECT * FROM users WHERE email = $1",[username]
    );
    if (check_result.rows.length > 0) {
        res.send("Email is already registered. Try log In");
    }else{
        // encripting the password
        bcrypt.hash(password, saltRounds, async (err, hash) => {

          // Condition hashing
          if (err){
              console.log("problem in hashing the password", err);
          }else{

            // storing data
            const result = await db.query(
                "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
                [username, hash]
            );
            const userId = result.rows[0].id;

            // Generate a confirmation token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 3600000);
            
            // Insert token into database
            await db.query('INSERT INTO confirmation_tokens(user_id, token, expires_at) VALUES($1, $2, $3)', [userId, token, expiresAt]);
            const subject = "Email Confirmation"
            const text = `Please confirm your email by clicking the link: http://localhost:3000/confirm/${token}`
            // Send confirmation email
            await sendConfirmationEmail(username, subject, text);
            res.status(201).send('User registered');
          }
        })
    }
    }catch (err) {
        console.log(err);
    } 
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to find the user by email
    const userDetails = await db.query('SELECT * FROM users WHERE email = $1', [username]);

    if (userDetails.rows.length > 0) {
      const user = userDetails.rows[0];
      const storedHashedPassword = user.password;
      const match = await bcrypt.compare(password, storedHashedPassword);
      const active = user.is_active
      if(active){
        if (match) {
          const userId = user.id
          const token = jwt.sign({ userId }, `hifi`, { expiresIn: '1h' });
          res.status(200).json({ userId: userId, message: 'Login successful',token });
        } else {
          res.status(401).send('Invalid credentials');
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
      
    } else {
      res.status(401).send('User not registered');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});
  

// AUTHENTICATION VERIFY
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  jwt.verify(token, `hifi`, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId; // Assuming userId is in the token
    next();
  });
};

// DASHBOARD
app.get('/home/:userId', authenticate, (req, res) => {
  const authenticateUserId = String(req.userId);
  const LogUserId = String(req.params.userId);

  // Check if the authenticated user ID matches the requested user ID
  if (authenticateUserId !== LogUserId) {
    console.log('Access forbidden: User ID mismatch');
    return res.status(403).json({ message: 'Access forbidden' });
  }

  // Return user-specific data
  res.json({ message: `Welcome to your home page, user ${LogUserId}`, authenticateUserId });
});


// CONFORMATION TOKEN
app.post('/confirm/:token', async (req, res) => {
  try{
    const {token} = req.body
    const currentTime = new Date(Date.now() + 0);

    const result = await db.query('SELECT * FROM confirmation_tokens WHERE token = $1',[token])
    const confirmationToken = result.rows[0]

    if (confirmationToken) {
      const time = confirmationToken.expires_at
      if(time > currentTime){
        await db.query('UPDATE users SET is_active = TRUE WHERE id = $1', [confirmationToken.user_id]);
        const emailrow = await db.query("SELECT * FROM users WHERE id = $1",[confirmationToken.user_id]);
        const emaildata = emailrow.rows[0]
        const subject = "Welcome to KeepMee family"
        const text = "We hope you enjoy our services"
        const email = emaildata.email
        await sendConfirmationEmail(email, subject, text)
        const id = confirmationToken.user_id;
        await db.query("DELETE FROM confirmation_tokens WHERE user_id = $1", [id]);
      }else{
        const id = confirmationToken.user_id;
        await db.query("DELETE FROM users WHERE id = $1", [id]);
      }
    }else {
      console.log('incorrect link');
    }
  }catch(err){
    console.error('Error:', err);
  }
});

app.post('/forgotpassword', async (req, res) => {
  const {username}  = req.body;

  try{
    const check_result = await db.query("SELECT * FROM users WHERE email = $1",[username]);

    if (check_result.rows.length > 0) {
      console.log("i found you");
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000);
      const userId = check_result.rows[0].id;
      
      // Insert token into database
      await db.query('INSERT INTO confirmation_tokens(user_id, token, expires_at) VALUES($1, $2, $3)', [userId, token, expiresAt]);
      const subject = "Change Password"
      const text = `Please change your password by clicking the link: http://localhost:3000/changepassword/${token}`
      // Send confirmation email
      await sendConfirmationEmail(username, subject, text);
      res.status(201).send('User registered');
    } else {

      res.status(401).send('Invalid credentials');
    }
  } catch(error){
    console.error('Error during Forgot Password Form Submision:', error);
    res.status(500).send('Server error');
  }
})

app.post('/changepassword/:token', async (req, res) =>{
  try {
    const {token} = req.body;
    const {username} = req.body
    const currentTime = new Date(Date.now() + 0);

    const result = await db.query('SELECT * FROM confirmation_tokens WHERE token = $1',[token])
    const confirmationToken = result.rows[0]

    if (confirmationToken) {
      const time = confirmationToken.expires_at
      if(time > currentTime){
        bcrypt.hash(username, saltRounds, async (err, hash) => {

          // Condition hashing
          if (err){
              console.log("problem in hashing the password", err);
          }else{
            await db.query('UPDATE users SET password = $1 WHERE id = $2', [hash, confirmationToken.user_id]);
            const emailrow = await db.query("SELECT * FROM users WHERE id = $1",[confirmationToken.user_id]);
            const emaildata = emailrow.rows[0]
            const subject = "Security Alert 🚨"
            const text = "Password Changed Sucessfully"
            const email = emaildata.email
            await sendConfirmationEmail(email, subject, text)
            const id = confirmationToken.user_id;
            await db.query("DELETE FROM confirmation_tokens WHERE user_id = $1", [id]);
          }
        })

      }else{
        const id = confirmationToken.user_id;
        await db.query("DELETE FROM users WHERE id = $1", [id]);
      }
    }else {
      console.log('incorrect link');
    }
  }catch(err){
    console.error('Error:', err);
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
