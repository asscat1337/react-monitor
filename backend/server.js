require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const path = require('path')
const dashboard = require('./router/dashboardRouter')
const auth = require('./router/authRouter')
const analytics = require('./router/analyticsRouter')
const FileLoad = require('./services/file-load')
const dashboardService = require('./services/dashboard-service')
const schedule = require('node-schedule')

app.use(cookieParser())
app.use(express.static(path.resolve(__dirname,'../build')))
app.use(express.json())
app.use(cors())

app.use('/dashboard',dashboard)
app.use('/auth',auth)
app.use('/analytics',analytics)

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../build','index.html'))
})



const delay =(ms)=> new Promise(resolve => setTimeout(resolve,ms))

const job = schedule.scheduleJob('0 2 * * 0',async ()=>{
    await FileLoad.loadFromPDF()
        .then(async (data)=>{
           await delay(5000)
           await FileLoad.callAction(data)
        })

 })

const job1 = schedule.scheduleJob('00 2 * * *',async()=>{
    await dashboardService.updateUserWithExpires()
})

app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT} port`)
})