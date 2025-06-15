require('./jobs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/UserRoute');
const clientRoute = require('./routes/ClientRoute');
const informationRoute = require('./routes/InformationRoutes');
const commentRoute = require('./routes/CommentRoute');
const updateRoute = require('./routes/UpdatesRoute');
const path = require('path');
require('dotenv').config({ path: '../.env' }); 

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
app.use("/api/users", userRoute);
app.use("/api/updates", updateRoute);
app.use("/api/comments", commentRoute);
app.use("/api/clients", clientRoute);
app.use("/api/information", informationRoute);

// Serve images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

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
