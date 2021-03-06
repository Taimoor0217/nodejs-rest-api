const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Authorize = require('../helpers/auth').Authorize
// Bring in Models
let Course = require('../models/course');
let User = require('../models/user');

// List of courses
router.get('/', function(req, res){
    Course
    .findAll({
        attributes: {
            exclude: ["createdAt" , "updatedAt" , "userId" , "User.id"],
        },
        include:[{
            model: User,
            attributes: {
                exclude: ["password" , "id" , "createdAt" , "updatedAt"]
            }
        }]
    })
    .then(data=>{
        res.status(200).json({
            courses: data
        })
    })
    .catch(err=>{
        res.status(400).json({
            message: "Something went wrong in fetching the course from the database"
        })
        console.log(err)
    })
});


router.get('/:id', function(req, res){
    Course
    .findAll({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ["createdAt" , "updatedAt" , "userId" , "User.id"],
        },
        include:[{
            model: User,
            attributes: {
                exclude: ["password" , "id" , "createdAt" , "updatedAt"]
            }
        }]
    })
    .then(data=>{
        if (data.length){
            res.status(200).json({
                courses: data
            })
        }else{
            res.status(400).json({
                message: "The requested course could not be found."
            })
        }
    })
    .catch(err=>{
        res.status(400).json({
            message: "Something went wrong in fetching the course from the database"
        })
        console.log(err)
    })
});
router.post('/' ,Authorize,  function(req , res){
    //authorization to be added
    //add the user to be the current user
    data = req.body
    if(!data.title || !data.description){
        res.status(400).json({
            message: "Course title or description cannot be empty"
        })
    }else{
        Course
        .create(data)
        .then(d =>{
            console.log("Course created sucessfully: ", d)
            res.status(201).location('/')
            res.end()
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                message: "Could not create the course with given attributes."
            })
        })

    }
})

router.delete('/:id' , Authorize , function(req , res){
    //authorization to be added
    Course
    .destroy({
        where:{
            id: req.params.id
        }
    })
    .then(()=>{
        console.log("Course sucessfully deleted")
        res.status(204).end()
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).send({
            message: "Could not delete the course"
        })
    })
})

router.put('/:id' ,Authorize , function(req , res){
    // console.log("PUT", req.body)
    //add atuthetication , check attributes
    const data = req.body
    if(!data.title || !data.description){
        res.status(400).json({
            message: "Course title or description cannot be empty"
        })
    }else{
        Course
        .update(req.body , {
            where: {
                id: req.params.id
            }
        })
        .then((data)=>{
            console.log("COUSRE UPDATE SUCCESSFULLY ", data)
            res.status(204).end()
        })
        .catch(err=>{
            res.status(400).json({
                message: "Course could not be updated"
            })
        })
    }

})

module.exports = router;