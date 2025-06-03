const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/UserRoute');
const postRoute = require('./routes/PostRoute');
const commentRoute = require('./routes/CommentRoute');
const updateRoute = require('./routes/UpdatesRoute');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

// const mysql = require('mysql');
// const bodyParser = require('body-parser');

const app = express();
// const port = 3000;
app.use(cors({
    origin: 'http://localhost:5173',
     credentials: true 
  }));
  
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use("/users", userRoute);
app.use("/updates", updateRoute);
app.use("/comments", commentRoute);
app.use("/posts", postRoute);




app.use("/", (req, res) =>{
    try {
     
        res.status(200).json("sari");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
