const {Sequelize} = require('sequelize')
const {DB,DB_PORT,DB_USER,DB_HOST,DB_PASS} = process.env


const sequelize = new Sequelize(DB,DB_USER,DB_PASS,{
    host:DB_HOST,
    dialect:"mysql"
})

async function init(){
    try{
        await sequelize.authenticate()
          await sequelize.sync()
    }catch (e) {
        console.log(e)
    }
}

init()


module.exports = sequelize