const path = require('path')
const fs = require('fs')
const jsdom = require('jsdom')
const {JSDOM} = jsdom
const Department = require('../models/Department')
const Dashboard = require('../models/Dashboard')
const Vaccine = require('../models/Vaccine')
const util = require('util')
const dayjs = require('dayjs')

class FileLoad{
    constructor() {
        this.addDataFromVaccine = this.addDataFromVaccine.bind(this)
    }
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
                        console.log(findDepartmentId)
                        results.push({
                            fio:tr[1].textContent,
                            departmentId:findDepartmentId?.department_id,
                            position:tr[2].textContent,
                            birthday:tr[3].textContent.split('.').reverse().join('-'),
                            snils:tr[4].textContent,
                            status:tr[5].textContent,
                            isSick:0,
                            isFirstComponent:0,
                            isVaccined:0
                        })
                    })
            return results.slice(1)
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

           if(getUser === null) return

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
           const {snils} = data

           const getUser = await this.findCurrentUser(snils)
           if (getUser === null) {
               await Dashboard.create({
                 ...data
               })
           }
       }catch(e){
               console.log(e)
      }
    }

   async callAction(newData){
       for await (const data of newData){
            await this.updateStatus(data)
            await this.addNewEmployee(data)
       }
    }

    async parseFromJson(){
       try{
           const readFile = util.promisify(fs.readFile)

           const data = await readFile(path.resolve('./pdf2json','test.json'),'utf-8')
           return JSON.parse(data)
       }catch(e){
           console.log(e)
       }
    }

    parseDate(data){
        return data.split('.').reverse().join('-')
    }

    async addDataFromVaccine(data){
       try{
           const {snils,last_vaccine,first_vaccine} = data
           if(first_vaccine !==null && last_vaccine !==null){
               const findUser = await this.findCurrentUser(snils)
               if(findUser){
                  const createdVaccine =  await Vaccine.create({
                       first_date:this.parseDate(first_vaccine),
                       last_date:this.parseDate(last_vaccine),
                       expired:dayjs(this.parseDate(last_vaccine)).add(6,'month').toDate(),
                   })
                   await Dashboard.update({
                       isVaccined:1,
                       isFirstComponent:1,
                       vaccineId:createdVaccine.vaccine_id
                   },{
                       where:{
                           dashboard_id:findUser.dashboard_id
                       }
                   })
               }
           }
       }catch (e) {
           console.log(e)
       }
    }
}



module.exports = new FileLoad()