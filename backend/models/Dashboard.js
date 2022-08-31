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
    birthday:{
        type:DataTypes.DATEONLY,
        // allowNull:false
    },
    snils:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    position:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    departmentId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
        references:{
            model:Department,
            key:'department_id'
        }
    },
    isVaccined:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    isFirstComponent:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    isSick:{
        type:DataTypes.BOOLEAN,
    },
    vaccineId:{
        type:DataTypes.INTEGER,
        references: {
            model:Vaccine,
            key:'vaccine_id'
        }
    },
    status:{
        type:DataTypes.TEXT,
        allowNull:false
    }
},{
    freezeTableName:true,
    timestamps:false
})

      Dashboard.hasOne(Department,{foreignKey:'department_id',sourceKey:'departmentId',constraints:false})
      Dashboard.hasOne(Vaccine,{foreignKey:'vaccine_id',sourceKey:'vaccineId',constraints:false})



module.exports = Dashboard

