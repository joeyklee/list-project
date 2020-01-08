/**
* Step 1: Add your node module dependencies
**/
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const config = require('./config');
const PORT = config.PORT;

/**
* Step 2: Connect to the db
**/
require('./db/db');

/**
* Step 3: instantiate the app
**/
const app = express();
const publicPath = path.resolve(__dirname, 'public');

/**
* Step 4: Handle CORS Whitelist URLS
* This step could probably be skipped since 
* our client is hosted from the same origin
* but I'll leave this in here for now!
**/
let whitelist;
if (process.env.NODE_ENV === 'production') {
    whitelist = [
      // add production urls
    ]
} else {
    whitelist = [
        // add development urls
    ]
}

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            // callback(new Error('Not allowed by CORS'))
            callback(null, false)
        }
    },
    credentials:true
}


/**
* Step 5: Set your middleware
**/
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(publicPath));

/**
* Step 6: set the path to your index.html file
**/
app.get("/", (req, res) => {
  res.sendFile('/')
})

// login
app.get("/login", (req, res) => {
  res.sendFile(publicPath + '/login.html')
})
// signup
app.get("/signup", (req, res) => {
  res.sendFile(publicPath + '/signup.html')
})
// reset_password
app.get("/reset_password", (req, res) => {
  res.sendFile(publicPath + '/reset_password.html')
})


/**
* Step 8: Set your posts routes
**/
const postRoutes = require('./routes/posts')
app.use('/api/v1/posts', postRoutes)

/**
* Step 9: Set your user routes
**/
const userRoutes = require('./routes/users')
app.use('/api/v1/users', userRoutes);

/**
* Step 7: create and fire up your server
**/
http.createServer(app).listen(PORT, () => {
  console.log(`see the magic at: http://localhost:${PORT}`)
})