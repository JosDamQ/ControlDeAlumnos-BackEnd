'use strict'

const Course = require('./courses.model');
const User = require('../users/user.model');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.notSignUp = async(req, res)=>{
    try{
        let defCourse = {
            name: 'Not sign up',
            description: 'Your not sign up in a course'
        }
        let existCourse = await Course.findOne({name: 'Not sign up'});
        if(existCourse) return console.log('Course not asigned already crated');
        let createdDefault = new Course(defCourse);
        await createdDefault.save();
        return console.log('Default category Created');
    }catch(err){
        return console.error(err);
    }
}

exports.addCourse = async(req, res)=>{
    try{
        let data = req.body;
        data.user = req.user.sub;
        let newCourse = new Course(data);
        await newCourse.save();
        return res.status(201).send({message: 'Created course'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message:'Error creating a course'});
    }
}


exports.editCourse = async(req, res)=>{
    try{
        let courseId = req.params.id;
        let data = req.body;
        let validate = req.user.sub;
        let teacherId = await Course.findOne({_id:courseId});
        if(!teacherId) return res.send({message: 'Course not found'});
        if(teacherId.user != validate) return res.status(401).send({message: 'Dont have permission to do this action'});
        /*let teacherExist = await User.findOne({_id: data.user});
        if(!teacherExist || teacherExist.role != 'TEACHER') return res.status(404).send({message: 'Teacher not found or not have permisse'});*/
        let courseUpdate = await Course.findOneAndUpdate(
            {_id: courseId},
            {
            name: data.name,
            description: data.description  
            },
            {new: true}
        )
        if(!courseUpdate) return res.send({message: 'Course not found'});
        return res.send({message: 'Course updated: ',courseUpdate});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating the account'});
    }
}

exports.deleteCourse = async(req, res)=>{
    try{
        let courseId = req.params.id;
        let validate = req.user.sub;
        let defaultCourse = await Course.findOne({name: 'Not sign up'});
        let teacherId = await Course.findOne({_id:courseId});
        if(!teacherId) return res.status(404).send({message: 'Course not found'});
        if(teacherId.user != validate) return res.status(401).send({message: 'Dont have permission to do this action'});
        let users = await User.find({role: 'student'});
        for(let user of users){
            if(user.course1 == courseId){
                user.course1 = defaultCourse._id;
                await User.findByIdAndUpdate(
                    {_id: user._id},
                    {course1: user.course1}
                )
            }
            if(user.course2 == courseId){
                user.course2 = defaultCourse._id;
                await User.findByIdAndUpdate(
                    {_id: user._id},
                    {course2: user.course2}
                )
            }
            if(user.course3 == courseId){
                user.course3 = defaultCourse._id;
                await User.findByIdAndUpdate(
                    {_id: user._id},
                    {course3: user.course3}
                )
            }
        }
        let courseDeleted = await Course.findOneAndDelete({_id:courseId});
        if(!courseDeleted) return res.send({message: 'Course not found and not deleted'}); 
        return res.send({message: `Course deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted'});
    }
}