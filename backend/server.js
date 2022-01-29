require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const dashboard = require('./router/dashboardRouter')


app.use(express.static(path.resolve(__dirname,'../build')))
app.use(express.json())
app.use(cors())

app.use('/dashboard',dashboard)

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../build','index.html'))
})


app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT} port`)
})