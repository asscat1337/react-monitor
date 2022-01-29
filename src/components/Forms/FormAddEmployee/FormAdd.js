import {TextField,Button} from "@mui/material";
import Select from "react-select";
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import {actionAddData} from "../../../store/actions/actionDashboard";
import {useDispatch} from "react-redux";


function FormAdd({options}){

    const dispatch = useDispatch()

    const schema = yup.object().shape({
        fio:yup.string().required(),
        department:yup.string().required(),
        position:yup.string().required()
    })

    const {register,handleSubmit,control} = useForm({
        resolver:yupResolver(schema)
    })

    const onSubmit = data=>{
        dispatch(actionAddData(data))
    }

    return (
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="ФИО"
                    required
                    {...register('fio')}
                />
                <TextField
                    label="Должность"
                    required
                    {...register('position')}
                />
                <Controller
                    control={control}
                    name="department"
                    render={({field:{onChange}})=>(
                        <Select
                            onChange={val=>onChange(val.value)}
                            options={options}
                        />
                    )}
                />

                <Button type="submit">
                    Добавить
                </Button>
            </form>
    )
}


export default FormAdd