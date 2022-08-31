const {Op, Sequelize} = require('sequelize')
const dayjs = require('dayjs')
const Dashboard = require('../models/Dashboard')
const Vaccine = require('../models/Vaccine')
const Department = require('../models/Department')

class DashboardService {
    async findByPkUsers(data){
        const getUser = await Dashboard.findByPk(data,{
            include:[{
                model:Department,attributes:['title']
            },{
                model:Vaccine
            }],
            raw:true,
            nest:true
        })

        return getUser
    }
    async updateUserWithExpires(){
        try {
            const findUserExpires = await Dashboard.findAll({
                raw:true,
                nest:true,
                include:{
                    model:Vaccine,
                    where:{
                        expired:{
                            [Op.lte]:dayjs().format('YYYY-MM-DD')
                        }
                    }
                }
            })

            for await (const users of findUserExpires){
                await Dashboard.update({
                    isVaccined: 0,
                    isFirstComponent: 0,
                    isSick:0
                },{
                    where:{
                        snils: users.snils
                    }
                })
            }
        }catch (e) {
            console.log(e)
        }
    }

    async getColData(queryParams,options,variable){

       return await Dashboard.findAll({
           where:{
               ...options
           },
           include:[{
               model:Vaccine,
                   where:{
                       ...variable
                   },
                   raw:true,
                   nest:true
           }]
       })
    }

    async updateUserStatus(id,status){
        return await Dashboard.update({
            status
        },{
            where:{
                dashboard_id:id
            }
        })
    }
    async getAnalytics(month){
        const dateDifferent = month ? dayjs().add(month,'month').toDate() : null
        const formatDate = dayjs(dateDifferent).format('YYYY-MM-DD')

        const variable = month ? {
           expired: {
            [Op.gte]:formatDate
           }
        } : null

        const [vaccine,notVaccined,sickVaccine] = await Promise.all([
            this.getColData('isVaccined',{
                    isVaccined:1,
            },variable),
            this.getColData('isVaccined',{
                isVaccined:0,
                isSick:0,
            },variable),
            this.getColData('isSick',{
                isSick:1,
            },variable)
            ]
        )
       return {
           vaccine:vaccine.length,
           notVaccined:notVaccined.length,
           sick:sickVaccine.length
       }
        // const getDataVaccined = await Dashboard.findAll({
        //     attributes:
        //         [Sequelize.fn('COUNT', Sequelize.col('isVaccined'))],
        //     where:{
        //         [Op.or]:{
        //             isVaccined:1,
        //         }
        //     },
        //     raw:true,
        //     nest:true
        // })
        // const getDataNotVaccined = await Dashboard.findAll({
        //     attributes:
        //         [Sequelize.fn('COUNT', Sequelize.col('isVaccined'))],
        //     where:{
        //         isVaccined:0,
        //         isSick:0
        //     },
        //     raw:true,
        //     nest:true
        // })
        //
        // const getDataSick = await Dashboard.findAll({
        //     attributes:[
        //         Sequelize.fn('COUNT',Sequelize.col('isSick'))
        //     ],
        //     where:{
        //         isSick:1
        //     },
        //     raw:true,
        //     nest:true
        // })
    }
}

module.exports = new DashboardService()