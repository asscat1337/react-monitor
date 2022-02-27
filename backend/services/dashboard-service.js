const {Op} = require('sequelize')
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
                    isFirstComponent: 0
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
}

module.exports = new DashboardService()