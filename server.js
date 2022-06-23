
require('dotenv').config({path : './config.env'});
const express = require('express');
const app = express();
const morgan = require("morgan");
const helment = require("helmet");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const connectDB = require('./database/db');

connectDB();

// middleware
app.use(cors({credentials : true}));
app.use(morgan("dev"));
app.use(helment());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const userRouter = require('./routes/users');
const quizRouter = require('./routes/quiz'); 

// map URL starts:
app.use('/api/users', userRouter); 
app.use('/api/quiz', quizRouter); 
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;