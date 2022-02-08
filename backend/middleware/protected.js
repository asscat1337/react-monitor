const AuthService = require('../services/auth-service')
module.exports = function (req,res,next){
    try {
        const headers = req.headers.authorization
        if(!headers){
            return res.status(401).send('UnAuthorized')
        }
        const spittedHeaders = headers.split(' ')[1]

        if(!spittedHeaders){
            return res.status(401).send('UnAuthorized')
        }

        const checkToken = AuthService.validateAccessToken(spittedHeaders)

        if(!checkToken){
            return res.status(401).send('UnAuthorized')
        }

        req.user = checkToken
        next()

    }catch (e) {
        return res.status(500).json(e)
    }
}