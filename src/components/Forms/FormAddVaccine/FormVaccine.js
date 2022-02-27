import {Button,Container,Portal} from "@mui/material";
import {useDispatch,useSelector} from "react-redux";
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import CustomDatePicker from "../../DatePicker/CustomDatePicker";
import {actionFinalComponent, actionFirstComponent} from "../../../store/actions/actionDashboard";
import CustomSnackBar from "../../SnackBar/CustomSnackBar";
import Context from "../../context/context";
import React from "react";


function FormVaccine({currentId}) {

    const {onOpenSnackBar} = React.useContext(Context)

    const dispatch = useDispatch()
    const findUser = useSelector(state => {
        const notVaccine = state.dashboard.notVaccine.find(user => user.id === currentId)
        if (notVaccine === undefined) {
            return state.dashboard.data.find(user => user.id === currentId)
        }
        return notVaccine
    })

    const message = useSelector(state => state.dashboard.message)


    const schema = yup.object().shape({
        first_date: yup.date(),
        last_date: yup.date()
    })
    const {control, getValues} = useForm({
        resolver: yupResolver(schema)
    })

    const onClickFirstDate = (event) => {
        event.preventDefault()
        const obj = {
            first_date: getValues("first_date"),
            currentId,
            vaccineId: findUser?.vaccine?.vaccine_id
        }

        dispatch(actionFirstComponent(obj))

        onOpenSnackBar()
    }
    const onClickSecondDate = (event) => {
        event.preventDefault()
        const finalObj = {
            last_date: getValues('last_date'),
            currentId,
            first_date: findUser?.vaccine?.first_date,
            vaccineId: findUser?.vaccine?.vaccine_id
        }


        dispatch(actionFinalComponent(finalObj))

        onOpenSnackBar()
    }


    return (
        <>
            <Container>
                {message && (
                    <Portal>
                        <CustomSnackBar
                            message={message}
                        />
                    </Portal>
                )}
                <h5>Дата первой вакцины</h5>
                <Controller
                    control={control}
                    name="first_date"
                    render={({field: {onChange, value}}) => (
                        <CustomDatePicker
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={findUser?.isFirstComponent === 1 ? true : false}
                    onClick={onClickFirstDate}
                >
                    Добавить первый компонент
                </Button>
                {findUser?.isFirstComponent === 1 && (
                    <>
                        <h5>Дата второй вакцины</h5>
                        <Controller
                            control={control}
                            name="last_date"
                            render={({field: {onChange, value}}) => (
                                <CustomDatePicker
                                    value={value}
                                    onChange={newValue => onChange(newValue)}
                                />
                            )}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={onClickSecondDate}>
                            Добавить второй компонент
                        </Button>
                    </>
                )}
            </Container>
        </>
    )
}

export default FormVaccine