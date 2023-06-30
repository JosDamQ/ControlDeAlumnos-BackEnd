'use strict'

const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    description: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Courses', courseSchema);