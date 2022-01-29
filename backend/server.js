require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const dashboard = require('./router/dashboardRouter')

app.use(express.json())
app.use(cors())

app.use('/dashboard',dashboard)


app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT} port`)
})