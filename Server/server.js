const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/UserRoute');
const clientRoute = require('./routes/ClientRoute');
const informationRoute = require('./routes/InformationRoutes');
const updateRoute = require('./routes/UpdatesRoute');
const contactRoute = require('./routes/ContactRoute');
const newslettersRoute = require('./routes/NewsletterRoute');
const path = require('path');
require('./jobs');
require('dotenv').config({ path: '../.env' }); 

const app = express();

app.use(cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
     credentials: true 
  }));
  
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/updates", updateRoute);
app.use("/api/clients", clientRoute);
app.use("/api/information", informationRoute);
app.use('/api/contact', contactRoute);
app.use('/api/newsletters', newslettersRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get("/", (req, res) =>{
    try {
     
        res.status(200).json("sari");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});