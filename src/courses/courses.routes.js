'use strict'

const courseController = require('./courses.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isTeacher } = require('../services/authenticated');

api.get('/', courseController.test);
api.post('/add', ensureAuth , isTeacher , courseController.addCourse);
api.put('/edit/:id', ensureAuth , isTeacher , courseController.editCourse);
api.delete('/delete/:id', ensureAuth , isTeacher , courseController.deleteCourse);

module.exports = api;