const Status = require('../models/Status')



const get = async()=>{
    const data = await Status.findAll()
    const mappedData=data.map(item=>{
        return {
            id:item.status_id,
            label:item.title
        }
    })
    return mappedData
}
const create = async(item)=>{
    const {title} = item
    const data = await Status.create({
        title
    })
    return data
}


module.exports = {
    get,
    create
}
