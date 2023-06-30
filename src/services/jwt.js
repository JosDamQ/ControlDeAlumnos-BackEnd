'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = async(user)=>{
    try{
        let payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            code: user.code,
            grade: user.grade,
            email: user.email,
            password: user.password,
            title: user.title,
            course1: user.course1,
            course2: user.course2,
            course3: user.course3,
            role: user.role,
            iat: Math.floor(Date.now()/ 1000), 
            exp: Math.floor(Date.now()/ 1000) + (60 * 120)
        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`);
    }catch(err){
        console.error(err);
        return err;
    }
}