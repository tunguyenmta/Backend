const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler')
const Port = process.env.PORT || 5000
const cors = require('cors')
const app = express();
const passportSetup = require('./middlewares/passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
connectDB()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const corsConf = {
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
    credentials: true
  }
  
app.use(cookieSession({
  name: "session",
  keys: ["tumo"],
}))

app.use(function(req, res, next) {
  if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb) => {
          cb()
      }
  }
  if (req.session && !req.session.save) {
      req.session.save = (cb) => {
          cb()
      }
  }
  next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use(cors(corsConf));
app.use('/api/user',require('./routes/userRoute'))
app.use('/api/game', require('./routes/gameRoute'))
// app.use('/api/image', require('./routes/uploadRoute'))
app.use(errorHandler)
app.listen(Port, ()=> console.log(`Server connected on port ${Port}`))  