const bcrypt = require('bcrypt')
const dayjs = require('dayjs')
const AuthService = require('../services/auth-service')
const Users = require('../models/Users')
const UserDto = require('../dto/user-dto')

class AuthController{
    async login(req,res,next){
        const {login,password} = req.body

        const candidate = await Users.findOne({
            where:{
                login
            }
        })
        const hashedPassword = await bcrypt.compare(password,candidate.password)

        if(!hashedPassword){
            return res.status(400).json({message:'Неверный пароль!'})
        }
        if(!candidate){
            return res.status(400).json({message:'Такого пользователя не существует!'})
        }
        const user = new UserDto(candidate)
        const tokens = AuthService.generateToken({...user})
        await AuthService.saveToken(tokens,user.id)
        res.cookie('refreshToken',tokens.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})

        return res.json({
            ...tokens,
            user
        })
    }

    async register(req,res,next){
        try{
            const {login,password,fio} = req.body

            const checkUser = await Users.findOne({
                where:{
                    login
                }
            })
            if (checkUser){
                return res.status(400).json({'message':'Такой пользователь уже существует'})
            }
            const generatePassword = await bcrypt.hash(password,3)
            const createNewUser = await Users.create({
                fio,
                login,
                password:generatePassword,
                last_sign:dayjs().format('YYYY-MM-DD'),
                role:1
            })

            const userDto = new UserDto(createNewUser)
            const generateToken = AuthService.generateToken({...userDto})
            await AuthService.saveToken(generateToken,userDto.id)
            res.cookie('refreshToken',generateToken.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})

            return res.json({
                ...generateToken,
                user:userDto
            })


        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }

    }

    async refresh(req,res,next){
        try {
            const {refreshToken} = req.cookies

            if(!refreshToken){
                return res.status(500)
            }

            const userData = AuthService.validateRefreshToken(refreshToken)
            const tokenFromDB = await Users.findOne({
                where:{
                    refreshToken
                }
            })

            if(!userData || !tokenFromDB){
                return res.status(500).json({message:'Произошла ошибка'})
            }
            const findById = await Users.findByPk(userData.id)
            const userDto = new UserDto(findById)
             const tokens = AuthService.generateToken({...userDto})
             await AuthService.saveToken({refreshToken,accessToken:tokens.accessToken},userDto.id)

            return res.json({
                ...tokens,
                user:userDto
            })
        }catch (e) {
            return res.status(500).json(e)
        }
    }
    
    async logout(req,res,next){
        try{
            res.clearCookie("refreshToken")
            
            return res.status(200).send("Logout")
        }catch (e) {
            return res.status(500).json(e)
        }
    }
}


module.exports = new AuthController()