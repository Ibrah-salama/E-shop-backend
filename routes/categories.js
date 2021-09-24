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
        res.status(400).json({
            status:"Fail",
            message: err.message
        })
    }
})

router.delete("/:categoryId", async(req,res,next)=>{
    try{
        const categoryId = req.params.categoryId 
        const category = await CategoryModel.findByIdAndDelete({_id : categoryId})
        if(category){ 
            res.status(204).json({
                status:"success",
                message : "Category deleted successfully!"
            })
        }else{ 
            res.status(404).json({
                status:"Fail",
                message : "Category not found!"
            })
        }
    }catch(err){
        res.status(401).json({
            status:"Fail",
            message: err.message
        })
    }



})

module.exports = router 