import {
    Button,
    Container,
    Portal,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from "@mui/material";
import {useDispatch,useSelector} from "react-redux";
import {useForm,Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import CustomDatePicker from "../../DatePicker/CustomDatePicker";
import {actionFinalComponent, actionFirstComponent,actionAddOtherDate} from "../../../store/actions/actionDashboard";
import CustomSnackBar from "../../SnackBar/CustomSnackBar";
import generateArray from "../../../helpers/generateArray";
import dayjs from 'dayjs'
import Context from "../../context/context";
import React from "react";


function FormVaccine({currentId}) {

    const {onOpenSnackBar} = React.useContext(Context)
    const getMonth = generateArray(12)
    const [other,setOther] = React.useState(false)
    const [month,setMonth] = React.useState('')

    const dispatch = useDispatch()
    const findUser = useSelector(state => {
        const notVaccine = state.dashboard?.notVaccine?.find(user => user.id === currentId)
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

    const onChangeOther=()=>{
        setOther(!other)
    }

    const onClickFirstDate = (event) => {
        event.preventDefault()
        const obj = {
            first_date: dayjs(getValues("first_date")).format('YYYY-MM-DD'),
            currentId,
            vaccineId: findUser?.vaccine?.vaccine_id
        }
         dispatch(actionFirstComponent(obj))

        onOpenSnackBar()
    }
    const onClickSecondDate = (event) => {
        event.preventDefault()
        const finalObj = {
            last_date: dayjs(getValues('last_date')).format('YYYY-MM-DD'),
            currentId,
            first_date: findUser?.vaccine?.first_date,
            vaccineId: findUser?.vaccine?.vaccine_id,
            userId:findUser?.dashboard_id
        }

         dispatch(actionFinalComponent(finalObj))

        onOpenSnackBar()
    }

    const onClickAddOther=(event)=>{
        event.preventDefault()
        const otherObject= {
            other_date:dayjs(getValues('other_date')).format('YYYY-MM-DD'),
            month:month,
            vaccineId:findUser?.vaccine?.vaccine_id,
            userId:findUser?.id
        }
        dispatch(actionAddOtherDate(otherObject))

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
                {!other && (
                    <>
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
                  </>
                )}
                {other && (
                    <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
                        <h5>Другое</h5>
                        <Controller
                            control={control}
                            name="other_date"
                            render={({field: {onChange, value}}) => (
                                <CustomDatePicker
                                    sx={{m:1}}
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                        <FormControl sx={{m:1}}>
                            <InputLabel id="month">Месяц</InputLabel>
                            <Select
                               autoWidth
                                labelId="month"
                                id="month"
                                value={month}
                                label="Месяц"
                                name="month"
                                onChange={e=>setMonth(e.target.value)}
                            >
                                {getMonth.map(item=>(
                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button sx={{m:1}}
                            type="submit"
                            variant="contained"
                            onClick={onClickAddOther}
                        >
                            Добавить
                        </Button>
                    </Box>
                )}
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox onChange={onChangeOther}/>}
                        label={"Другое"}
                   />
                </FormGroup>
            </Container>
        </>
    )
}

export default FormVaccine