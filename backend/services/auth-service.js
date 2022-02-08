const jsonwebtoken = require('jsonwebtoken')
const Users = require('../models/Users')

class AuthService{
        generateToken(payload){
            const accessToken = jsonwebtoken.sign(payload,process.env.ACCESS_TOKEN,{expiresIn: '24h'})
            const refreshToken = jsonwebtoken.sign(payload,process.env.REFRESH_TOKEN,{expiresIn: '30days'})

            return {
                accessToken,
                refreshToken
            }
        }
        async saveToken(token,userId){
           const {refreshToken,accessToken} = token
            const tokenData = await Users.findByPk(userId)

            if(tokenData.refreshToken){
                await Users.update({refreshToken,accessToken},{
                    where:{
                        users_id:userId
                    }
                })
            }else{
                const newToken = await Users.update({refreshToken,accessToken},{
                    where:{
                        users_id: userId
                    }
                })
                return newToken
            }
        }

       validateRefreshToken(token){
            try{
                const userToken = jsonwebtoken.verify(token,process.env.REFRESH_TOKEN)
                return userToken
            }catch (e) {
                console.log(e)
                return null
            }
        }
        validateAccessToken(token){
            try{
                const userToken = jsonwebtoken.verify(token,process.env.ACCESS_TOKEN)
                return userToken
            }catch (e) {
                return null
            }
        }
}





module.exports = new AuthService()