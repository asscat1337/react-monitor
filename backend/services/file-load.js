const path = require('path')
const fs = require('fs')
const jsdom = require('jsdom')
const {JSDOM} = jsdom
const Department = require('../models/Department')
const Dashboard = require('../models/Dashboard')

class FileLoad{
   async loadFromPDF(){
        try {
            const findDepartment = await Department.findAll({
                raw:true
            })
            const results = []
            const getFile = path.resolve('./pdf2json', 'test', 'test.html')
            const data = fs.readFileSync(getFile,{encoding:'utf-8'})
                    const dom = new JSDOM(data);
                    const table = dom.window.document.getElementsByTagName('table')[5]
                    const td = table.querySelectorAll('tr')
                    td.forEach(item=>{
                        const tr = item.querySelectorAll('td')
                        const findDepartmentId = findDepartment.find(item=>item.title === tr[0].textContent)
                        results.push({
                            fio:tr[1].textContent,
                            departmentId:findDepartmentId.department_id,
                            position:tr[2].textContent,
                            birthday:tr[3].textContent,
                            snils:tr[4].textContent,
                            status:tr[5].textContent
                        })
                    })
            return results
        }
        catch(e){
            console.log(e)
        }
    }

    async findCurrentUser(snils){
       try {
           const getCurrentUser = await Dashboard.findOne({
               where:{
                   snils
               },
               raw:true
           })

           return getCurrentUser

       }catch(e){
           console.log(e)
       }
    }


   async updateStatus(data){
       try{
           const {snils,status} = data

           const getUser = await this.findCurrentUser(snils)

           if(getUser.status !== status){
               await Dashboard.update({status},{
                   where:{
                       snils
                   }
               })
           }

       }catch (e) {
           console.log(e)
       }
    }
    async addNewEmployee(data){
       try {
           const {snils, position, birthday, status, fio, departmentId} = data

           const getUser = await this.findCurrentUser(snils)

           if (getUser === null) {
               await Dashboard.create({
                   fio,
                   snils,
                   position,
                   birthday,
                   status,
                   departmentId
               })
           }
       }catch(e){
               console.log(e)
      }
    }

   async callAction(newData){
       for await (const data of newData){
           this.updateStatus(data)
           this.addNewEmployee(data)
       }
    }
}



module.exports = new FileLoad()