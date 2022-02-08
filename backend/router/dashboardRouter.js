const express = require('express')
const router = express.Router()
const dashboardController = require('../controller/dashboardController')
const protected = require('../middleware/protected')



router.post('/add',dashboardController.addDataFromDashboard)
router.get('/get-department',dashboardController.getDepartment)
router.post('/add-vaccine',dashboardController.addDataVaccine)
router.get('/not-vaccined',dashboardController.getNotVaccined)
router.get('/get-info',dashboardController.getCurrentInfo)
router.get('/',protected,dashboardController.getData)
router.get('/test',dashboardController.requestLoadFile)
router.post('/first-component',dashboardController.addFirstDate)
router.post('/final-component',dashboardController.addFinalComponent)
router.get('/search',dashboardController.search)


module.exports = router