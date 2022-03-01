const express = require('express')
const router = express.Router()
const dashboardController = require('../controller/dashboardController')
const protect = require('../middleware/protected')



router.post('/add',dashboardController.addDataFromDashboard)
router.get('/get-department',dashboardController.getDepartment)
router.get('/not-vaccined',dashboardController.getNotVaccined)
router.get('/get-info',dashboardController.getCurrentInfo)
router.get('/',protect,dashboardController.getData)
router.get('/test',dashboardController.requestLoadFile)
router.post('/first-component',dashboardController.addFirstDate)
router.post('/final-component',dashboardController.addFinalComponent)
router.post('/sick-date',dashboardController.addSickDate)
router.get('/search',dashboardController.search)
router.get('/analytics',dashboardController.analytics)
router.get('/filter',dashboardController.filter)
router.get('/test-json',dashboardController.requestJson)
router.post('/other-date',dashboardController.addOtherDate)


module.exports = router