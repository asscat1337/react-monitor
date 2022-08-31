const {get} = require('../services/status')

class StatusController{
    async get(req,res,next){
        try{
            const data = await get()
            return res.status(200).json(data)
        }catch (e) {
            return res.status(500).json({message:'Произошла ошибка при загрузке статуса',error:true})
        }
    }
}

module.exports = new StatusController()