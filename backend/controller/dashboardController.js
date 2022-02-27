const Dashboard = require('../models/Dashboard')
const Department = require('../models/Department')
const Vaccine = require('../models/Vaccine')
const {Op,Sequelize} = require('sequelize')
const FileLoad = require('../services/file-load')
const dayjs = require('dayjs')
const DashboardService = require('../services/dashboard-service')

class DashboardController {

    constructor() {
        this.addSickDate = this.addSickDate.bind(this)
    }

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
                isFirstComponent:0,
                isSick:0,
                status:'Работа',
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
                    },
                    {
                        model:Vaccine
                    }
                ],
               limit:Number(size),
               offset:Number(page) * Number(size),
                raw:true,
                nest:true
            })
          const mappedData =  data.rows.map(item=>{
                return {
                    fio:item.fio,
                    position:item.position,
                    isVaccined:item.isVaccined,
                    id:item.dashboard_id,
                    department:item.department.title,
                    birthday:item.birthday,
                    snils:item.snils,
                    isFirstComponent:item.isFirstComponent,
                    vaccine:item.vaccine
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
            const {first_date,currentId,vaccineId} = req.body
            if(vaccineId !== null){
                 await Vaccine.update({
                    first_date,
                },{
                    where:{
                        vaccine_id:vaccineId
                    }
                })
                await Dashboard.update({
                    isFirstComponent:1
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })
                const findUpdatedUser = await Dashboard.findByPk(currentId,{
                    include:{
                        model:Vaccine
                    },
                    raw:true,
                    nest:true
                })

                return res.status(200).json({
                    data:{...findUpdatedUser,isVaccined:Number(findUpdatedUser.isVaccined)},
                    message:'Дата первого компонента успешно добавлена'
                })
            }


            const createFirstDate = await Vaccine.create({
                first_date,
                isSick:0
            })


            if(createFirstDate){
                await Dashboard.update({
                    isFirstComponent:1,
                     vaccineId:createFirstDate.vaccine_id
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })
            }

            const getUser = await Dashboard.findByPk(currentId,{
                raw:true,
                nest:true,
                include:{
                    model:Vaccine
                }
            })
            return res.status(200).json({
                data:getUser,
                message:'Дата первого компонента успешно добавлена!'
            })

        }catch (e){
            return res.status(500).send(e)
        }
    }
    async addFinalComponent(req,res,next){
        try{
            const {last_date,first_date,vaccineId,currentId} = req.body


            const expired = dayjs(last_date).add(6,'month').toDate()

            if(dayjs(last_date).diff(first_date,'week') < 3){
                return res.status(400).json({message:'Неверно выбрана дата второго компонента'})
            }

             await Vaccine.update({
                last_date,expired
            },{
                 where:{
                    vaccine_id:vaccineId
                }
            })
             await Dashboard.update({
                    isVaccined:1,
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })
            const getUser = await Dashboard.findByPk(currentId,{
                raw:true,
                nest:true,
                include:{
                    model:Vaccine
                }
            })


            return res.status(200).json({
                data:getUser,
                message:'Дата второго компонента успешно добавлено!'
            })

        }catch(e){
            return res.status(500).json(e)
        }
    }

    async getNotVaccined(req,res,next){
        try{
            const {page,size} = req.query

            const findUserWhereNotVaccined = await Dashboard.findAndCountAll({
                offset:Number(page)*Number(size),
                limit:Number(size) / 2,
                where:{
                    isVaccined:0,
                    isSick:0
                },
                include:[{
                    model:Department,attributes:['title']
                    },
                    {
                        model:Vaccine
                    }
                ],
                raw:true,
                nest:true
            })

            // const getDataFromExpires = await Dashboard.findAndCountAll({
            //     offset:Number(page)*Number(size),
            //     limit:Number(size) / 2,
            //     include:[{
            //         model:Vaccine,
            //         where:{
            //             expired:{
            //                 [Op.lte]:dayjs().format('YYYY-MM-DD')
            //             }
            //         }
            //     },{
            //         model:Department,attributes:['title']
            //     }],
            //     raw:true,
            //     nest:true
            // })
            const transformedData = {
                rows:findUserWhereNotVaccined.count,
                data:[...findUserWhereNotVaccined.rows.map(item=> {
                    return {
                        ...item,
                        department:item?.department?.title,
                        id:item.dashboard_id
                    }
                })
                //     ,...getDataFromExpires.rows.map(item=>{
                //     return {
                //         ...item,
                //         department:item?.department?.title,
                //         id:item.dashboard_id
                //     }
                // }
                // )
                ]

            }

            return res.status(200).json(transformedData)

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
                include:[
                    {
                        model:Department,attributes:['title'],
                    },
                    {
                        model:Vaccine
                    }
                ],
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
            const delay=(ms)=> new Promise(resolve => setTimeout(resolve,ms))

         const data = await FileLoad.loadFromPDF()

         const filteredData = data.reduce((acc,current)=>{
             if(!acc.find(({snils})=>snils === current.snils)){
                  acc.push(current)
             }
             return acc
         },[])

          await delay(10000)

          await FileLoad.callAction(filteredData)

         return  res.status(200).send(filteredData)
        }catch (e) {
            console.log(e)
        }
    }


     parseToDate(date){
        return dayjs(date).format('YYYY-MM-DD')
    }

    async addSickDate(req,res,next){
        try{
            const {sick_date,currentId} = req.body
            const expired = dayjs(this.parseToDate(sick_date)).add(6,'month').toDate()

            const getUser = await DashboardService.findByPkUsers(currentId)

            await Dashboard.update({
                isSick:1,
                isVaccined:1
            },{
                where:{
                    dashboard_id:currentId
                }
            })
            if(getUser.vaccineId === null){
               const updateVaccineSickUser = await Vaccine.create({
                    sick_date,
                    expired
                })
                await Dashboard.update({
                    vaccineId:updateVaccineSickUser.vaccine_id,
                    isSick:1,
                    isVaccined:1
                },{
                    where:{
                        dashboard_id:currentId
                    }
                })
                const findUser = await DashboardService.findByPkUsers(currentId)
                return res.status(200).json({
                    data:findUser,
                    message:'Дата болезни успешно добавлено!'
                })
            }


            if(getUser.vaccineId && getUser.vaccine.first_date || getUser.vaccine.last_date || getUser.vaccine.sick_date){

                await Vaccine.update({
                    sick_date,expired
                },{
                    where:{
                        vaccine_id:getUser.vaccineId
                    }
                })

                const test = await DashboardService.findByPkUsers(currentId)

                return res.status(200).json({
                    data:test,
                    message:'Дата болезни успешно добавлено!'
                })
            }

        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }
    async analytics(req,res,next){
        try{
            const getDataVaccined = await Dashboard.findAll({
                attributes:
                    [Sequelize.fn('COUNT', Sequelize.col('isVaccined'))],
                where:{
                    [Op.or]:{
                        isVaccined:1,
                        isSick:1
                    }
                },
                raw:true,
                nest:true
            })
            const getDataNotVaccined = await Dashboard.findAll({
                    attributes:
                        [Sequelize.fn('COUNT', Sequelize.col('isVaccined'))],
                    where:{
                        isVaccined:0,
                        isSick:0
                    },
                    raw:true,
                    nest:true
                })
            // const getDataFromExpires = await Dashboard.findAll({
            //     include:{
            //         model:Vaccine,
            //         where:{
            //             expired:{
            //                 [Op.lte]:dayjs().format('YYYY-MM-DD')
            //             }
            //         }
            //     },
            //     raw:true,
            //     nest:true
            // })
            return res.status(200).json({
                vaccine:Object.values(getDataVaccined[0])[0],
                notVaccined:Object.values(getDataNotVaccined[0])[0]
            })
        }catch(e){
            console.log(e)
            return res.status(500).json({message:e})
        }
    }

    async filter(req,res,next){
        try{
            const {query} = req.query

            const findOneDepartment = await Department.findOne({
                where:{
                    title:{
                        [Op.like]:`%${query}%`
                    }
                }
            })
            const findUsersByDepartment = await Dashboard.findAll({
                where:{
                    departmentId:findOneDepartment.department_id
                },
                include:{
                    model:Department,attributes:['title']
                },
                raw:true,
                nest:true
            })

            return res.status(200).json(findUsersByDepartment.map(item=>{
                return {
                    ...item,
                    id:item.dashboard_id,
                    department:item.department.title
                }
                }
            ))

        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async requestJson(req,res,next){
        try {
           const data =  await FileLoad.parseFromJson()
            const test = data.reduce((acc,current)=>{
                if(!acc.find(item=>item.snils === current)){
                    acc.push(current)
                }
                return acc
            },[])

           for await (const item of test){
                await FileLoad.addDataFromVaccine(item)
           }
        }catch (e) {
            console.log(e)
        }
    }


}


module.exports = new DashboardController()