const Dashboard = require('../models/Dashboard')
const Department = require('../models/Department')
const Vaccine = require('../models/Vaccine')
const {Op} = require('sequelize')
const FileLoad = require('../services/file-load')
const dayjs = require('dayjs')

class DashboardController {
    async addDataFromDashboard(req,res,next){
        try{
            const {fio,department,position,snils} = req.body

            const findBySnils = await Dashboard.findOne({
                where:{
                    snils
                },
                raw:true
            })

            if(findBySnils){
                return res.status(400).json({message:'Данный пользователь со СНИЛС уже существует!'})
            }

            const addedData = await Dashboard.create({
                fio,
                departmentId:department,
                position,
                isVaccined:0,
                status:'Работает',
                snils
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
                   data:{
                       id:findAddedUser.dashboard_id,
                       fio:findAddedUser.fio,
                       position:findAddedUser.position,
                       isVaccined:findAddedUser.isVaccined,
                       department:findAddedUser.department.title,
                   },
                   message:'Пользователь успешно добавлен!'
               })
           }
        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async getData(req,res,next){
        try{
            const {page,size} = req.query
           const data =  await Dashboard.findAndCountAll({
                include:[
                    {
                        model:Department,attributes:['title'],
                    }
                ],
               limit:Number(size),
               offset:Number(page) * Number(size),
                raw:true,
                nest:true
            })
            console.log(data.rows)
          const mappedData =  data.rows.map(item=>{
                return {
                    fio:item.fio,
                    position:item.position,
                    isVaccined:item.isVaccined,
                    id:item.dashboard_id,
                    department:item.department.title,
                    snils:item.snils,
                    isFirstComponent:item.isFirstComponent
                }
            })
            return res.status(200).json({data:mappedData,rows:data.count})
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


    async addFirstDate(req,res,next){
        try{
            const {first_date,currentId} = req.body
            const createFirstDate = await Vaccine.create({
                first_date,
                dashboard_id:currentId,
                userId:currentId
            })

            if(createFirstDate){
                await Dashboard.update({
                    isFirstComponent:1
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })
            }

            const getUser = await Dashboard.findByPk(currentId,{
                raw:true
            })

            return res.status(200).json(getUser)

        }catch (e){
            return res.status(500).send(e)
        }
    }
    async addFinalComponent(req,res,next){
        try{
            const {last_date,currentId} = req.body
            const expired = dayjs().add(6,'month').toDate()
             await Vaccine.update({
                last_date,expired
            },{where:{
                    userId:currentId
                }
            })
             await Dashboard.update({
                    isVaccined:1
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })
            const getUser = await Dashboard.findByPk(currentId,{
                raw:true
            })

            return res.status(200).json(getUser)

        }catch(e){
            return res.status(500).json(e)
        }
    }
    async addDataVaccine(req,res,next){
        // try{
        //     const {last_date,first_date,currentId} = req.body
        //     const expired = dayjs().add(6,'month').toDate()
        //     const createdVaccine = await Vaccine.create({
        //         first_date,
        //         last_date,
        //         dashboard_id:currentId,
        //         expired:expired,
        //         isVaccined:1,
        //         userId:currentId
        //     })
        //     if(createdVaccine){
        //         await Dashboard.update({
        //             isVaccined:1
        //         },{
        //             where:{
        //                 dashboard_id:currentId
        //             }
        //         })
        //         const getCurrentUser = await Dashboard.findByPk(currentId,{
        //             include:{
        //                 model:Department,attributes:['title']
        //             }
        //         })
        //
        //         return res.status(200).json({
        //             id:getCurrentUser.dashboard_id,
        //             fio:getCurrentUser.fio,
        //             position:getCurrentUser.position,
        //             isVaccined:getCurrentUser.isVaccined,
        //             department:getCurrentUser.department.title
        //         })
        //     }
        //
        // }catch (e){
        //     console.log(e)
        //     return res.status(500).json(e)
        // }
    }
    async getNotVaccined(req,res,next){
        try{
            const {page,size} = req.query

            const findUserWhereNotVaccined = await Dashboard.findAndCountAll({
                offset:Number(page)*Number(size),
                limit:Number(size),
                include:{
                    model:Department,attributes:['title']
                },
                where:{
                    isVaccined:0
                },
                raw:true,
                nest:true
            })
            const findUsersExpires = await Vaccine.findAndCountAll({
                offset:Number(page)*Number(size),
                limit:Number(size),
                raw:true,
                nest:true,
                where:{
                    expired:{
                        [Op.lte]:dayjs().format('YYYY-MM-DD')
                    }
                }
            })

            const transformedData = {
                count:findUserWhereNotVaccined.count + findUsersExpires.count,
                rows:[...findUserWhereNotVaccined.rows,...findUsersExpires.rows]
            }
            console.log(transformedData)
            const mappedData = transformedData.rows.map(item=>{
                return {
                    fio:item.fio,
                    position:item.position,
                    isVaccined:item.isVaccined,
                    id:item.dashboard_id,
                    department:item.department.title,
                    snils:item.snils,
                    isFirstComponent:item.isFirstComponent
                }
            })

             return res.status(200).json({data:mappedData,rows:transformedData.count})
        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async search(req,res,next){
        try{
            const {query} = req.query
            console.log(query)
            const variable = query !== "" ?
                     {
                        where:{
                            [Op.or]:{
                                fio:{
                                    [Op.like]:`%${query}%`
                                },
                                snils:{
                                    [Op.like]:`%${query}%`
                                }
                            }
                        }
                    } :  null
            const searchValue = await Dashboard.findAll({
                ...variable,
                include:{
                    model:Department,attributes:['title']
                },
                raw:true,
                nest:true,
            })

            return res.status(200).json(searchValue.map(item=>{
                return {...item,id:item.dashboard_id,department:item.department.title}
            }))

        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async getCurrentInfo(req,res,next){
        try{
            const {id} = req.query
            const findCurrentData = await Vaccine.findOne({
                where:{
                    userId:id
                },
                raw:true,
                nest:true,
                include:{
                    model:Dashboard
                }
            })
            return res.status(200).json(findCurrentData)

        }catch(e){
            return res.status(500).json(e)
        }
    }

    async requestLoadFile(req,res,next){
        try{
            const data =  await FileLoad.loadFromPDF()
            data.map(async (item)=>{
               await Dashboard.create({
                   fio:item.fio,
                   snils:item.snils,
                   position:item.position,
                   departmentId:item.departmentId,
                   isVaccined:0,
                   status:item.status
               })
           })
        return  res.status(200).send('Пользователи успешно добавлены')
        }catch (e) {
            console.log(e)
        }
    }

}


module.exports = new DashboardController()