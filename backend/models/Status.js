const sequelize = require('../core/config')
const {DataTypes} = require('sequelize')


const Status = sequelize.define('status',{
    status_id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER,
        allowNull:false
    },
    title:{
        allowNull: false,
        type:DataTypes.STRING
    }
},{
    freezeTableName:true,
    timestamps:false
})

module.exports = Status
