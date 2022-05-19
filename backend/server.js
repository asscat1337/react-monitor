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
const fs = require('fs')

  app.use(cors({
    origin:'http://localhost:3000',
}))

app.use(cookieParser())
app.use(express.static(path.resolve(__dirname,'../build')))
app.use(express.json())

app.use('/dashboard',dashboard)
app.use('/auth',auth)
app.use('/analytics',analytics)

// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'../build','index.html'))
// })


const delay =(ms)=> new Promise(resolve => setTimeout(resolve,ms))

const job = schedule.scheduleJob('03 13 * * *',async ()=>{
    console.log('start')
    fs.access('./pdf2json',fs.constants.F_OK,async(err)=>{
        if(err) throw new Error()
            await FileLoad.loadFromPDF()
            .then(async (data)=>{
               // await delay(5000)
                await FileLoad.callAction(data)
            })
    })

 })

const job1 = schedule.scheduleJob('50 14 * * *',async()=>{
    await dashboardService.updateUserWithExpires()
})

app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT} port`)
})