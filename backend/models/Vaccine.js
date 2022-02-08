const {DataTypes} = require('sequelize')
const sequelize = require('../core/config')
const Dashboard = require('./Dashboard')


const Vaccine = sequelize.define('vaccine',{
    vaccine_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    first_date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    last_date:{
        type:DataTypes.DATEONLY,
    },
    expired:{
        type:DataTypes.DATEONLY,
    },
    isVaccined:{
        type:DataTypes.BOOLEAN,
    },
    userId:{
        type:DataTypes.INTEGER,
        reference:{
            model:Dashboard,
            key:'dashboard_id'
        }
    }
},{
    timestamps:false,
    freezeTableName:true
})
Dashboard.associate=models=>{
    Dashboard.hasMany(models.Vaccine,{foreignKey:'dashboard_id',sourceKey:'vaccine_id',constraints:false})
}


module.exports = Vaccine