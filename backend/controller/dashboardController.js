const Dashboard = require('../models/Dashboard')
const Department = require('../models/Department')
const Vaccine = require('../models/Vaccine')

class DashboardController {
    async addDataFromDashboard(req,res,next){
        try{
            const {fio,department,position} = req.body
            const addedData = await Dashboard.create({
                fio,departmentId:department,position,isVaccined:0
            },{
                raw:true
            })
            const findAddedUser = await Dashboard.findByPk(addedData.dashboard_id,{
                raw:true,
                nest:true,
                include:{
                    model:Department,attributes:['title']
                }
            })
           if(addedData){
               return res.status(200).json({
                   id:findAddedUser.dashboard_id,
                   fio:findAddedUser.fio,
                   position:findAddedUser.position,
                   isVaccined:findAddedUser.isVaccined,
                   department:findAddedUser.department.title
               })
           }
        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async getData(req,res,next){
        try{
           const data =  await Dashboard.findAll({
               where:{
                   isVaccined:1
               },
                include:{
                    model:Department,attributes:['title']
                },
                raw:true,
                nest:true
            })
          const mappedData =  data.map(item=>{
                return {
                    fio:item.fio,
                    position:item.position,
                    isVaccined:item.isVaccined,
                    id:item.dashboard_id,
                    department:item.department.title
                }
            })
            return res.status(200).json(mappedData)
        }catch (e){
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async getDepartment(req,res,next){
        try{
            const departmentData = await Department.findAll({
                raw:true,
            })

            const mappedDepartment = departmentData.map(item=>{
                return {
                    value:item.department_id,
                    label:item.title
                }
            })

            return res.status(200).json(mappedDepartment)

        }catch (e) {
            return res.status(500).json(e)
        }
    }

    async addDataVaccine(req,res,next){
        try{
            const {last_date,first_date,currentId} = req.body
            const createdVaccine = await Vaccine.create({
                first_date,last_date,dashboard_id:currentId
            })
            if(createdVaccine){
                await Dashboard.update({
                    isVaccined:1
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })

                const getCurrentUser = await Dashboard.findByPk(currentId,{
                    include:{
                        model:Department,attributes:['title']
                    }
                })

                return res.status(200).json({
                    id:getCurrentUser.dashboard_id,
                    fio:getCurrentUser.fio,
                    position:getCurrentUser.position,
                    isVaccined:getCurrentUser.isVaccined,
                    department:getCurrentUser.department.title
                })
            }

        }catch (e){
            return res.status(500).json(e)
        }
    }
    async getNotVaccined(req,res,next){
        try{
            const {page,size} = req.query
           const getNotVaccinedData =  await Dashboard.findAndCountAll({
                where:{
                    isVaccined:0
                },
                offset:Number(page) * Number(size),
                limit:Number(size),
                include:{
                    model:Department,attributes:['title']
                },
                raw:true,
                nest:true
            })
            console.log(getNotVaccinedData)
            const mappedData = getNotVaccinedData.rows.map(item=>{
                return {
                    fio:item.fio,
                    position:item.position,
                    isVaccined:item.isVaccined,
                    id:item.dashboard_id,
                    department:item.department.title
                }
            })

            return res.status(200).json({data:mappedData,rows:getNotVaccinedData.count})
        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async getCurrentInfo(req,res,next){
        try{
            const {id} = req.query
            const findCurrentData = await Dashboard.findByPk(id,{
                raw:true
            })
            const findVaccineData = await Vaccine.findAll({
                where:{
                    dashboard_id:findCurrentData.dashboard_id
                },
                raw:true
            })

            return res.status(200).json({
                user:findCurrentData,
                vaccine:findVaccineData
            })

        }catch(e){
            return res.status(500).json(e)
        }
    }

}


module.exports = new DashboardController()