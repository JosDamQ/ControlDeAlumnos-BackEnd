'use strcit'
//``

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 2651;
const userRoutes = require('../src/users/user.routes');
const courseRoutes = require('../src/courses/courses.routes');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/user', userRoutes);
app.use('/course', courseRoutes);


exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http is running in port ${port}`);
}