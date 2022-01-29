const express = require('express')
const router = express.Router()
 const dashboardController = require('../controller/dashboardController')


router.post('/add',dashboardController.addDataFromDashboard)
router.get('/get-department',dashboardController.getDepartment)
router.post('/add-vaccine',dashboardController.addDataVaccine)
router.get('/not-vaccined',dashboardController.getNotVaccined)
router.get('/get-info',dashboardController.getCurrentInfo)
router.get('/',dashboardController.getData)


module.exports = router