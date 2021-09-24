const express = require('express')
const CategoryModel = require('../models/category')
const router = express.Router()

router.get('/', async(req,res,next)=>{
    
    const categories = await CategoryModel.find()
    if(!categories){
        res.status(500).json({
            status: Fail 
        })
    }
    res.status(200).json({
        status:'success',
        data : categories
    })
})

router.post("/", async(req,res,next)=>{
    try{ 
        const category = req.body 
        const newCategory = await CategoryModel.create(category)
        if(newCategory){
            res.status(201).json({
                status:"success",
                data: newCategory
            })
        }
    }catch(err){
        res.status(500).json({
            status:"Fail",
            message: err.message
        })
    }
})

router.delete("/:categoryName", async(req,res,next)=>{
    try{
        const categoryName = req.params.categoryName 
        await CategoryModel.deleteOne({categoryName : categoryName})
        res.status(204).end()
    }catch(err){
        res.status(401).json({
            status:"Fail",
            message: err.message
        })
    }



})

module.exports = router 