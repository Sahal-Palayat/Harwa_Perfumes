const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Harwa_perfumes');
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')

const express = require('express');
const app = express();

app.use(express.static('public'));


const adminRouter =require('./routes/adminRouter');
const userRouter =require('./routes/userRouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/',userRouter);
app.use('/',adminRouter);


app.listen(7000,()=>console.log('Server running...'))