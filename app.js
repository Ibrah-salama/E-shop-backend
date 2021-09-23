const express = require('express');
const dotenv = require('dotenv')
const logger = require('morgan');
const morgan = require('morgan');
const fs = require('fs')

const app = express()
app.use(express.json())

app.use(logger('common', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

app.use(morgan('dev'))

dotenv.config({path:'./config.env'})

const api = process.env.API_URL

app.get(`${api}/products`,(req,res)=>{
    const prod = {
        id:1,
        name:"hh"
    }
    res.send(prod)
})

app.post(`${api}/products`,(req,res)=>{
    const prod = req.body
    console.log(prod)
    res.send(prod)
})




app.listen(3000,(err)=>{
    if(err){
        console.log('Error connecting on port 3000')
    }else{
        console.log(api)
        console.log('Connected successfully on port 3000 ')
    }
})