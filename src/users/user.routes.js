'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isTeacher, isStudent } = require('../services/authenticated');

api.get('/', userController.test);
api.post('/registerStudent', userController.registerStudent);
api.post('/save', ensureAuth , isTeacher , userController.save);
api.put('/signUp/:id', ensureAuth , isStudent , userController.selectCourse);
api.post('/login', userController.login);
api.put('/edit/:id', ensureAuth , userController.editCount);
api.delete('/delete/:id', ensureAuth , userController.deleteUser);
api.get('/view/:id', ensureAuth , userController.viewCourses);
api.get('/getCoursesTeacher/:id', ensureAuth , userController.viweCoursesTeacher)

module.exports = api;