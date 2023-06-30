'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: `Doesn´t contain headers "AUTHORIZATION"`});
    }else{
        try{
           let token = req.headers.authorization.replace(/['"]+/g, '');
           var payload = jwt.decode(token, `${process.env.SECRET_KEY}`);
           if(Math.floor(Date.now()/ 1000) >= payload.exp){
            return res.status(401).send({message: 'Expired token'});
           }
        }catch(err){
            console.error(err);
            return res.status(400).send({message: 'Expired token'});
        }
        req.user = payload;
        next();
    }
}

exports.isTeacher = async(req, res, next)=>{
    try{
        let user = req.user;
        if(user.role !== 'TEACHER') return res.status(403).send({message: 'Your not a teacher. Your not authorized to do this action'});
        next();
    }catch(err){
        console.error(err);
        return res.status(403).send({message: 'Your not a teacher. Your not authorized to do this action'});
    }
}

exports.isStudent = async(req, res, next)=>{
    try{
        let user = req.user;
        if(user.role !== 'STUDENT') return res.status(403).send({message: 'Your not a student. Your not authorized to do this action'});
        next();
    }catch(err){
        console.error(err);
        return res.status(403).send({message: 'Your not a student. Your not authorized to do this action'})
    }
}