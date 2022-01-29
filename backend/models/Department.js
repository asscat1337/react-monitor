const sequelize = require('../core/config')
const {DataTypes} = require('sequelize')
const Dashboard = require('../models/Dashboard')
const Vaccine = require('../models/Vaccine')



const Department = sequelize.define('department',{
    department_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    title:{
        type:DataTypes.TEXT,
        allowNull: false
    }
},{
    freezeTableName:true,
    timestamps:false
})

Department.associate=(models)=>{
    Department.belongsTo(models.Dashboard,{
        foreignKey:"dashboardId"
    })
}

module.exports = Department