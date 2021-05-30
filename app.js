
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');

const app = express();

const session = require('express-session');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
    {secret: 'SECRET-KEY', 
    resave: true, 
    saveUninitialized: false,
    cookie: { path: '/', httpOnly: false, secure: false, maxAge: 72 * 60 * 60 * 1000 }
    }));

app.use('/', indexRouter);

module.exports = app;
