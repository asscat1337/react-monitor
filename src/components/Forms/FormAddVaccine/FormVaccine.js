import {Button,Box,Container} from "@mui/material";
import {useDispatch,useSelector} from "react-redux";
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import CustomDatePicker from "../../DatePicker/CustomDatePicker";
import {actionAddVaccine, actionFinalComponent, actionFirstComponent} from "../../../store/actions/actionDashboard";


function FormVaccine({currentId}){

    const dispatch = useDispatch()
    const findUser = useSelector(state=>state.dashboard.notVaccine?.find(user=>user.id === currentId))

    console.log(currentId)
        const schema = yup.object().shape({
            first_date:yup.date(),
            last_date:yup.date()
        })
    const {control,getValues} = useForm({
        resolver:yupResolver(schema)
    })

    const onClickFirstDate = (event)=>{
        event.preventDefault()
        const obj = {
            first_date:getValues("first_date"),
            currentId
        }

        dispatch(actionFirstComponent(obj))
    }
    const onClickSecondDate=(event)=>{
        const firstDate = getValues("first_date")
        const lastDate = getValues("last_date")

        console.log(firstDate,lastDate)
        // event.preventDefault()
        // const finalObj = {
        //     last_date:getValues('last_date'),
        //     currentId
        // }
        // dispatch(actionFinalComponent(finalObj))
    }
    return (
        <Container>
            {findUser?.isFirstComponent === 0 && (
                <>
                    <h5>Дата первой вакцины</h5>
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
                <Button type="submit" onClick={onClickFirstDate}>
                    Добавить первый компонент
                </Button>
                </>
            )}
            {findUser?.isFirstComponent === 1 && (
                <>
                    <h5>Дата второй вакцины</h5>
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
                    <Button type="submit" onClick={onClickSecondDate}>
                        Добавить второй компонент
                    </Button>
                </>
            )}


        </Container>
    )
}



export default FormVaccine