import React from 'react'
import {TextField,Button,Input,Box,Autocomplete} from "@mui/material";
// import Select from "react-select";
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import {actionAddData} from "../../../store/actions/actionDashboard";
import {useDispatch} from "react-redux";
import TextMaskField from "../../Inputs/InputMask/InputMask";
import Context from '../../context/context'


function FormAdd({options}){

    const {onOpenSnackBar,openSnackBar} = React.useContext(Context)
    const dispatch = useDispatch()

    const schema = yup.object().shape({
        fio:yup.string().required(),
        department:yup.string(),
        snils:yup.string().required(),
        position:yup.string().required()
    })

    const {register,handleSubmit,control,reset} = useForm({
        resolver:yupResolver(schema)
    })

    const onSubmit = data=>{
        console.log(data)
        dispatch(actionAddData(data))
        onOpenSnackBar()
        reset({})
    }

    return (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="ФИО"
                    required
                    {...register('fio')}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Должность"
                    required
                    {...register('position')}
                />
                <Controller
                    control={control}
                    name="snils"
                    render={({field:{onChange,value}})=>(
                        <Input
                            placeholder="СНИЛС"
                            required
                            fullWidth
                            value={value}
                            onChange={(val)=>onChange(val)}
                            label="СНИЛС"
                            name="snils"
                            required
                            sx={{marginBottom:2,marginTop:2}}
                            inputComponent={TextMaskField}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="department"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            onChange={(event, item) => {
                                onChange(item.label);
                            }}
                            value={value?.label}
                            options={options}
                            getOptionLabel={(item) => item.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Отделение"
                                    margin="normal"
                                    variant="outlined"
                                    required
                                />
                            )}
                        />
                    )}
                />


                <Button type="submit">
                    Добавить
                </Button>
            </Box>
    )
}


export default FormAdd