const {Router} = require('express')
const router = Router()
const dashboardController = require('../controller/dashboardController')



router.get('/get-data',dashboardController.analytics)


module.exports = router