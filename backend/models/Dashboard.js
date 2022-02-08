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
    status:{
        type:DataTypes.TEXT,
        allowNull:false
    }
},{
    freezeTableName:true,
    timestamps:false
})

     Dashboard.hasOne(Department,{foreignKey:'department_id',sourceKey:'departmentId',constraints:false})
      Vaccine.belongsTo(Dashboard,{foreignKey:'userId',sourceKey:'vaccine_id',constraints:false})



module.exports = Dashboard

