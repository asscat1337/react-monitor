const {DataTypes} = require('sequelize')
const sequelize = require('../core/config')
const Department = require('./Department')
const Vaccine = require("./Vaccine");


const Dashboard = sequelize.define('dashboard',{
    dashboard_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    fio:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    position:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    isVaccined:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    departmentId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Department,
            key:'department_id'
        }
    }
},{
    freezeTableName:true,
    timestamps:false
})



// Dashboard.associate=models=>{
    Dashboard.hasOne(Department,{foreignKey:'department_id',sourceKey:'departmentId',constraints:false})
    Dashboard.hasOne(Vaccine,{foreignKey:{name:'dashboard_id',type:DataTypes.INTEGER,allowNull:false}})
    Dashboard.belongsTo(Vaccine,{foreignKey:'dashboard_id',constraints:false})
// }



module.exports = Dashboard

