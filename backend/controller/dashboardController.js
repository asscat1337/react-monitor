const Dashboard = require('../models/Dashboard')
const Department = require('../models/Department')
const Vaccine = require('../models/Vaccine')
const {Op,Sequelize} = require('sequelize')
const FileLoad = require('../services/file-load')
const dayjs = require('dayjs')
const DashboardService = require('../services/dashboard-service')
const xlsx = require('xlsx')

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
                        model:Department,attributes:['title','department_id'],
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
                    department:item.department,
                    birthday:item.birthday,
                    status:item.status,
                    snils:item.snils,
                    isFirstComponent:item.isFirstComponent,
                    vaccine:item.vaccine
                }
            })
            return res.status(200).json({data:mappedData,rowsAll:data.count})
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
            const {first_date,currentId,vaccineId,componentName} = req.body
            if(vaccineId !== null){
                 await Vaccine.update({
                    first_date,
                    componentName
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
                isSick:0,
                componentName
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

            if(dayjs(last_date).diff(first_date,'week') < 2){
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
                message:'Дата второго компонента успешно добавлена!'
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
                limit:Number(size),
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
            const transformedData = {
                rowsNotVaccine:findUserWhereNotVaccined.count,
                data:[...findUserWhereNotVaccined.rows.map(item=> {
                    return {
                        ...item,
                        department:item?.department?.title,
                        id:item.dashboard_id
                    }
                })

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
                    sick_date:dayjs(sick_date).format('YYYY-MM-DD'),
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
                    message:'Дата болезни успешно добавлена!'
                })
            }


            if((getUser.vaccineId && getUser.vaccine.first_date) || getUser.vaccine.last_date || getUser.vaccine.sick_date){

                await Vaccine.update({
                    sick_date:dayjs(sick_date).format('YYYY-MM-DD')
                    ,expired
                },{
                    where:{
                        vaccine_id:getUser.vaccineId
                    }
                })

                const test = await DashboardService.findByPkUsers(currentId)

                return res.status(200).json({
                    data:test,
                    message:'Дата болезни успешно добавлена!'
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

            const getDataSick = await Dashboard.findAll({
                attributes:[
                    Sequelize.fn('COUNT',Sequelize.col('isSick'))
                ],
                where:{
                    isSick:1
                },
                raw:true,
                nest:true
            })



            return res.status(200).json({
                vaccine:Object.values(getDataVaccined[0])[0],
                notVaccined:Object.values(getDataNotVaccined[0])[0],
                sick:Object.values(getDataSick[0])[0]
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

    async addOtherDate(req,res,next){
        try{
            const {vaccineId,other_date,month,userId,reason} = req.body

            const expired = dayjs(other_date).add(month,'month').toDate()

            if(!vaccineId){
               const createbleData =  await Vaccine.create({
                    other_date,
                    expired,
                    reason
                })
                await Dashboard.update({
                    isVaccined:1,
                    isFirstComponent:1,
                    vaccineId:createbleData.vaccine_id
                },{
                    where:{
                        dashboard_id:userId
                    }
                })
                const returnedUser = await DashboardService.findByPkUsers(userId)
                return res.status(200).json({message:'Дата успешно добавлена!',data:returnedUser})
            }

            await Vaccine.update({
                other_date,
                expired,
                reason
            },{
                where:{
                    vaccine_id:vaccineId
                }
            })
            await Dashboard.update({
                isVaccined:1,
                isFirstComponent:1
            },{
                where:{
                    dashboard_id:userId
                }
            })
            const returnedUser = await DashboardService.findByPkUsers(userId)
            return res.status(200).json({message:'Дата успешно добавлена!',data:returnedUser})
        }catch (e) {
            return res.status(500).json(e)
        }
    }

    async generate(req,res,next){
        try{
            const data = await Dashboard.findAll({
                raw:true,
                nest:true,
                include:[
                    {model:Vaccine},
                    {model:Department,attributes:['title']}
                ]
            })
            const mappedData = data.map(item=>{
                return {
                    fio:item.fio,
                    birthday:item.birthday,
                    snils:item.snils,
                    position:item.position,
                    isVaccined:item.isVaccined,
                    isSick:item.isSick,
                    status:item.status,
                    department:item.department.title,
                    first_date:item.vaccine.first_date,
                    last_date:item.vaccine.last_date,
                    sick_date:item.vaccine.sick_date,
                    expired:item.vaccine.expired,
                    other_date:item.vaccine.other_date,
                    vaccine:item.vaccine.componentName
                }
            })
            const Heading = [['ФИО', 'Дата рождения', 'СНИЛС','Должность',
                'Вакцинирован?','Болел?','Статус','Отделение','Дата первого компонента',
                'Дата второго компонента','Дата болезни','Дата окончания прививки','Другое','Название вакцины']]
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(mappedData,{origin:'A2',skipHeader:true})
            xlsx.utils.sheet_add_aoa(ws,Heading)

            xlsx.utils.book_append_sheet(wb,ws)
            const buffer = xlsx.write(wb,{type:"buffer",bookType:"xlsx"})

            return res.status(200).send(buffer)


        }catch (e) {
            console.log(e)
        }
    }

    async deleteFirstComponent(req,res,next){
        try{
            const {vaccine,id} = req.body[0]
            console.log(vaccine)
             await Vaccine.update({
                first_date:null
            },{
                where:{
                    vaccine_id:vaccine.vaccine_id
                }
            })
           await Dashboard.update({
               isFirstComponent:0,
               isVaccined:0
           },{
               where:{
                   dashboard_id:id
               }
           })
            const getUser = await DashboardService.findByPkUsers(id)

            return res.status(200).json({
                ...getUser,
                id:getUser.dashboard_id,
                title:getUser.department.title
            })

        }catch (e) {
            return res.status(500).json(e)
        }
    }

    async deleteFinalComponent(req,res,next){
        try{
            const {vaccine,id} = req.body[0]
            await Vaccine.update({
                last_date:null
            },{
                where:{
                    vaccine_id:vaccine.vaccine_id
                }
            })
            await Dashboard.update({
                isVaccined:0
            },{
                where:{
                    dashboard_id:id
                }
             })

            const getUser = await DashboardService.findByPkUsers(id)
            return res.status(200).json({
                ...getUser,
                id:getUser.dashboard_id,
                department:getUser.department.title
            })
        }catch (e){
            return res.status(500).json(e)
        }
    }

    async deleteSickDate(req,res,next){
        try{
            const {vaccine,id} = req.body[0]

            await Vaccine.update({
                sick_date:null
            },{
                where:{
                    vaccine_id:vaccine.vaccine_id
                }
            })

            if(vaccine.first_date ===null && vaccine.last_date === null){
                await Dashboard.update({
                    isVaccined:0,
                    isFirstComponent:0
                },{
                    where:{
                        dashboard_id:id
                    }
                })
            }
            const getUser = await DashboardService.findByPkUsers(id)

            return res.status(200).json({
                ...getUser,
                id:getUser.dashboard_id,
                title:getUser.department.title
            })


        }catch (e) {
            return res.status(500).json(e)
        }
    }
    async deleteOtherDate(req,res,next){
        try{
            const {vaccine,id} = req.body[0]
            await Vaccine.update({
                other_date:null,
                reason:null
            },{
                where:{
                    vaccine_id:vaccine.vaccine_id
                }
            })

            if(vaccine.first_date === null && vaccine.last_date === null){
                await Dashboard.update({
                    isVaccined:0,
                    isFirstComponent:0
                },{
                    where:{
                        dashboard_id:id
                    }
                })
            }

            const getUser = await DashboardService.findByPkUsers(id)

            return res.status(200).json({
                ...getUser,
                id:getUser.department_id,
                title:getUser.department.title
            })

        }catch (e) {
            return res.status(500).json(e)
        }
    }

    async addOneComponent(req,res,next){
        try{
            const {vaccineId,userId,dateOne,componentName} = req.body
            
            if(vaccineId){
                await Vaccine.update({
                    last_date:dayjs(dateOne).format('YYYY-MM-DD'),
                    componentName
                },{
                    where:{
                        vaccine_id:vaccineId
                    }
                })
                await Dashboard.update({
                    isVaccined:1
                },{
                    where:{
                        dashboard_id:userId
                    }
                })
                const getUser = await DashboardService.findByPkUsers(userId)

                 return res.status(200).json({
                     data:getUser,
                     message:'Вакцина успешно добавлена!'
                 })
            }

           const createdVaccine =  await Vaccine.create({
                last_date:dayjs(dateOne).format('YYYY-MM-DD'),
                componentName
            })

            await Dashboard.update({
                isVaccined:1,
                isFirstComponent:0,
                isSick:0,
                vaccineId:createdVaccine.vaccine_id
            },{
                where:{
                    dashboard_id:userId
                }
            })

            const getUser = await DashboardService.findByPkUsers(userId)

             return res.status(200).json({
                 data:getUser,
                 message:'Вакцина успешно добавлена!'
             })

        }catch(e){
            console.log(e)
        }

    }
    async deleteDashboard(req,res,next){
        try{
           const {user} = req.query

            await Dashboard.destroy({
                where:{
                    dashboard_id:user
                }
            })

            return res.status(200).json({message:'Запись удалена'})

        }catch (e) {
            return res.status(500).json(e)
        }
    }
    async changeDepartment(req,res,next){
        try{
            const {findUser,newDepartment} = req.body
            const {id} = findUser[0]

            await Dashboard.update({
                departmentId:newDepartment.value
            },{
                where:{
                    dashboard_id:id
                }
            })

            return res.status(200).json({
                message:'Отделение успешно обновлено'
            })
        }catch (e) {
            return res.status(500).json(e)
        }
    }

}


module.exports = new DashboardController()