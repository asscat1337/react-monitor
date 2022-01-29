import {Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import CustomDatePicker from "../../DatePicker/CustomDatePicker";
import {actionAddVaccine} from "../../../store/actions/actionDashboard";


function FormVaccine({currentId}){

    const dispatch = useDispatch()

        const schema = yup.object().shape({
            first_date:yup.date().required(),
            last_date:yup.date().required()
        })
    const {register,handleSubmit,control} = useForm({
        resolver:yupResolver(schema)
    })

    const onSubmit=(data)=>{
            dispatch(actionAddVaccine({currentId,...data}))
    }

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <span>Дата первой вакцины</span>
            <Controller
                control={control}
                name="first_date"
                render={({field:{onChange,value}})=>(
                    <CustomDatePicker
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
            <span>Дата второй вакцины</span>
            <Controller
                control={control}
                name="last_date"
                render={({field:{onChange,value}})=>(
                    <CustomDatePicker
                        value={value}
                        onChange={newValue=>onChange(newValue)}
                    />
                )}
            />

            <Button type="submit">
                Добавить дату вакцинации
            </Button>

        </form>
    )
}



export default FormVaccine