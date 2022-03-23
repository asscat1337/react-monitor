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
    },
    last_date:{
        type:DataTypes.DATEONLY,
    },
    sick_date:{
        type:DataTypes.DATEONLY
    },
    expired:{
        type:DataTypes.DATEONLY,
    },
    other_date:{
        type:DataTypes.DATEONLY
    },
    isVaccined: {
        type: DataTypes.BOOLEAN,
    },
    componentName:{
        type:DataTypes.TEXT
    },
    reason:{
        type:DataTypes.TEXT
    }
},{
    timestamps:false,
    freezeTableName:true
})
Vaccine.associate=models=>{
    Vaccine.belongsTo(models.Dashboard,{foreignKey:'vaccineId',constraints:false,onDelete:'cascade'})
}


module.exports = Vaccine