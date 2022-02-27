import React from 'react'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import {Button,Container,Portal} from "@mui/material";
import {useForm,Controller} from "react-hook-form";
import {useDispatch,useSelector} from "react-redux";
import CustomDatePicker from "../../DatePicker/CustomDatePicker";
import CustomSnackBar from "../../SnackBar/CustomSnackBar";
import {actionSickDate} from "../../../store/actions/actionDashboard";
import Context from "../../context/context";


function FormAddSick({currentId}){
    const dispatch = useDispatch()
    const {onOpenSnackBar} = React.useContext(Context)
    const message = useSelector(state=>state.dashboard.message)

    const schema = yup.object().shape({
        sick_date:yup.string().required()
    })

    const {handleSubmit,control} = useForm({
        resolver:yupResolver(schema)
    })

    const onSubmit=data=>{
        dispatch(actionSickDate({...data,currentId}))
        onOpenSnackBar()
    }

    return (
        <Container>
                {message && (
                    <Portal>
                        <CustomSnackBar
                            message={message}
                        />
                    </Portal>
                )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="sick_date"
                    render={({field:{onChange,value}})=>(
                        <CustomDatePicker
                            value={value}
                            onChange={newValue=>onChange(newValue)}
                        />
                    )}
                />
                <Button
                    variant="contained"
                    type="submit"
                >
                    Добавить дату заболевания
                </Button>
            </form>
        </Container>
    )
}


export default FormAddSick