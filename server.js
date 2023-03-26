const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler')
const Port = process.env.PORT || 5000
const app = express();

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user',require('./routes/userRoute'))
app.use(errorHandler)
app.listen(Port, ()=> console.log(`Server connected on port ${Port}`))