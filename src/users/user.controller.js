'use strict'
// <> ``

const User = require('./user.model');
const Course = require('../courses/courses.model')
const { validateData, encrypt, checkPassword } = require('../utilis/validate');
const { createToken } = require('../services/jwt')

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.defaultTeacher = async(req, res)=>{
    try{
        let defaultTeacher = {
            name: 'Damian',
            surname: 'Garcia',
            email: 'dgarcia',
            password: '123',
            title: 'kinal.edu.gt',
            code: 'N/A',
            grade: 'N/A',
            role: 'Teacher'
        }
        defaultTeacher.password = await encrypt(defaultTeacher.password);
        let existTeacher = await User.findOne({name: 'Damian'});
        if(existTeacher) return console.log('Default teacher is already created');
        let createdDefault = new User(defaultTeacher);
        await createdDefault.save();
        return console.log('Default teacher created');
    }catch(err){
        console.error(err);
    }
}

//Login

exports.login = async(req, res)=>{
    try{
        let data = req.body;
        let credentials = {
            email: data.email,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({message: msg})
        let user = await User.findOne({email: data.email});
        if(user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user)
            return res.send({message: 'User logged successfully', token});
        }
        return res.status(404).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not logged'});
    }
}

//Student functions

exports.defaultStudent = async(req, res)=>{
    try{
        let defaultStudent = {
            name: 'Josue',
            surname: 'Qiuñonez',
            email: 'jgarcia',
            password: '123',
            title: 'N/A',
            code: '2018163',
            grade: '6to',
            role: 'Student'
        }
        defaultStudent.password = await encrypt(defaultStudent.password);
        let existStudent = await User.findOne({name: 'Josue'});
        if(existStudent) return console.log('Default student is already created');
        let createdDefault = new User(defaultStudent);
        await createdDefault.save();
        return console.log('Default student created');
    }catch(err){
        console.error(err);
    }
}

exports.selectCourse = async(req, res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        let existCourse = await Course.findOne({_id: data.course1});
        let existCourse2 = await Course.findOne({_id: data.course2});
        let existCourse3 = await Course.findOne({_id: data.course3});
        if(!existCourse) return res.status(404).send({message: 'Course not found'});
        if(!existCourse2) return res.status(404).send({message: 'Course not found'});
        if(!existCourse3) return res.status(404).send({message: 'Course not found'});
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        if(data.password || Object.entries(data).length === 0 || data.role) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        if(data.course1 == data.course2 && (data.course1) && (data.course2)) return res.send({message: 'You cannot sign up in a course where you are already sign up'});
        if(data.course1 == data.course3 && (data.course1) && (data.course3)) return res.send({message: 'You cannot sign up in a course where you are already sign up'});
        if(data.course2 == data.course3 && (data.course2) && (data.course3)) return res.send({message: 'You cannot sign up in a course where you are already sign up'});

            let selectCourse = await User.findOneAndUpdate(
                {_id: userId},
                {course1: data.course1,
                course2: data.course2,
                course3: data.course3},
                {new: true}
            )
            if(!selectCourse) return res.send({message: 'Student not found'});
            return res.send({message: 'sign up succesfully', selectCourse});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error sign up'});
    }
}

exports.registerStudent = async(req, res)=>{
    try{
        let data = req.body;
        data.role = 'student';
        data.title = 'N/A';
        data.password = await encrypt(data.password);
        if(data.role === 'student'){
            let params = {
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password,
                code: data.code,
                grade: data.grade,
            }
        let msg = validateData(params);
        if(msg) return res.status(400).send({message: msg});
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({message: 'Account created succesfully'});
        } 
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', error: err.message});
    }
}

exports.viewCourses = async(req,res)=>{
    try{
        let userId = req.params.id;
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        let user = await User.findOne({_id: userId}).populate('course1').populate('course2').populate('course3').lean();
        if(!user) return res.send({message: 'user not found'});
        return res.send({message: 'Acount found', user})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting courses'});
    }
}

exports.editCount = async(req,res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        //data.title = 'N/A'
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        if(data.password || Object.entries(data).length === 0 || data.role || data.title) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdated = await User.findOneAndUpdate(
            {_id: req.user.sub},
            data,
            {new: true}
        )
        if(!userUpdated) return res.status(404).send({message: 'User not found adn not updated'});
        return res.send({message: 'User updated', userUpdated})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updatind data'});
    }
}

exports.deleteUser = async(req,res)=>{
    try{
        let userId = req.params.id;
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        let deleteUser = await User.deleteOne({_id: userId});
        if(deleteUser.deletedCount === 0) return res.status(400).send({message: 'User not found'});
        return res.send({message: 'User deleted'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting data'});
    }
}

//Teacher functions

exports.save = async(req,res)=>{
    try{
        let data = req.body;
        if(data.role == 'teacher'){
            data.code = 'N/A';
            data.grade = 'N/A';
            let params = {
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password,
                title: data.title,
                role: data.role
            }
            let msg = validateData(params);
            if(msg) return res.status(400).send({message: msg});
            data.password = await encrypt(data.password);
            let user = new User(data);
            await user.save();
            return res.send({message: 'Teacher created succesfully'})
        }else if(data.role == 'student'){
            data.title = 'N/A'
            let params = {
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password,
                code: data.code,
                grade: data.grade,
                role: data.role
            }
            let msg = validateData(params);
            if(msg) return res.status(400).send({message: msg});
            data.password = await encrypt(data.password);
            let user = new User(data);
            await user.save();
            return res.send({message: 'Student created succesfully'})
        }else{
            return res.status(401).send({message: 'This role cannot be created'});
        }
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creatring a user'});
    }
}

exports.viweCoursesTeacher = async(req,res)=>{
    try{
        let userId = req.params.id;
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        let courses = await Course.find({user: userId});
        if(!courses) return res.status(404).send({message: 'Course not found'});
        return res.send({message: 'Courses Founds' , courses}); 
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting courses'});
    }
}




