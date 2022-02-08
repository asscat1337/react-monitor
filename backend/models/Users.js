const {DataTypes} = require('sequelize');
const sequelize = require('../core/config')



const Users = sequelize.define('users',{
    users_id:{
        primaryKey:true,
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
    },
    fio:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    login:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    last_sign:{
        type:DataTypes.DATE,
        allowNull:false
    },
    role:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    refreshToken:{
        type:DataTypes.STRING(1000)
    },
    accessToken:{
        type:DataTypes.STRING(1000)
    }

},{
    freezeTableName:true,
    timestamps:false
})


module.exports = Users