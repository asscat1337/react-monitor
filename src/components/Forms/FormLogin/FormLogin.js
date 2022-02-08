import React from 'react'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {actionLogin} from "../../../store/actions/actionAuth";
import {useDispatch} from "react-redux";

import {Button,TextField,Grid,Box,FormControlLabel,Checkbox,Stack} from '@mui/material'


function FormLogin({navigate}){

    const [isShow,setIsShow] = React.useState(false)

    const dispatch = useDispatch()
    const schema = yup.object().shape({
        login:yup.string().required(),
        password:yup.string().required()
    })
    const {register,handleSubmit} = useForm({
        resolver:yupResolver(schema)
    })

    const onSubmit=data=>{
        dispatch(actionLogin(data,navigate))
    }

    const onCheckPassword=()=>{
        setIsShow(!isShow)
    }

    return (
        <Grid>
            <Box onSubmit={handleSubmit(onSubmit)} sx={{mt:2}} component="form">
                <Grid>
                    <TextField
                        variant="standard"
                        margin="normal"
                        label="Логин"
                        fullWidth
                        required
                        {...register('login')}
                    />
                    <TextField
                        variant="standard"
                        margin="normal"
                        label="Пароль"
                        type={`${isShow ? 'text' : 'password'}`}
                        fullWidth
                        required
                        {...register('password')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="show-password"
                                value="show"
                                onChange={onCheckPassword}
                            />
                        }
                        label={`${isShow ? 'Скрыть' :'Показать'} пароль `}
                    />
                </Grid>
                <Stack direction="row">
                    <Button
                        type="submit"
                        sx={{mt:3,mb:2}}
                    >
                        Авторизация
                    </Button>
                </Stack>
            </Box>
        </Grid>

    )
}

export default FormLogin