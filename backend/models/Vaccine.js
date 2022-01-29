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
        allowNull:false
    },
},{
    timestamps:false,
    freezeTableName:true
})

// Vaccine.associate=models=>{

    //Vaccine.hasOne(Dashboard,{foreignKey:'dashboard_id',sourceKey:'userId',constraints:false})
// }


module.exports = Vaccine