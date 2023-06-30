'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }, 
    code: {
        type: String
    },
    grade: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    title: {
        type: String,
        uppercase: true
    },
    course1: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Courses'
    },
    course2: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Courses'
    },
    course3: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Courses'
    },
    role: {
        type: String,
        uppercase: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);