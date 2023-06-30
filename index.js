'use strict'

require('dotenv').config();
const mongoConfig = require('./configs/mongo');
const app = require('./configs/app');
const UserController = require('./src/users/user.controller');
const CourseController = require('./src/courses/courses.controller');

mongoConfig.connect();
app.initServer();
UserController.defaultTeacher();
UserController.defaultStudent();
CourseController.notSignUp();