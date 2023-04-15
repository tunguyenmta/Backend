const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler')
const Port = process.env.PORT || 5000
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')

connectDB()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const corsConf = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
  
app.use(cors(corsConf));
app.use('/api/user',require('./routes/userRoute'))
// app.use('/api/image', require('./routes/uploadRoute'))
app.use(errorHandler)
app.listen(Port, ()=> console.log(`Server connected on port ${Port}`))