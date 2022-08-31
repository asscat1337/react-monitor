const {Router} = require('express')
const router = Router()

const statusController = require('../controller/statusController')

router.get('/get-status',statusController.get)



module.exports = router