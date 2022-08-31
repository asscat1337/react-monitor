import {useDispatch, useSelector} from "react-redux";
import {Autocomplete, Button, Portal, TextField} from "@mui/material";
import dayjs from "dayjs";
import React, {useContext, useState} from "react";
import {
    actionChangeDepartment, actionChangeStatus,
    actionDeleteFinalComponent,
    actionDeleteFirstComponent, actionDeleteOther, actionDeleteSick
} from "../../store/actions/actionDashboard";
import Context from "../context/context";
import CustomSnackBar from "../SnackBar/CustomSnackBar";


const UserInfo=({
                    departments,
                    findUser,
                    status
})=>{
    const {openSnackBar,onOpenSnackBar} = useContext(Context)
    const message = useSelector(state=>state.dashboard?.message)
    const dispatch = useDispatch()

    const [changeDepartment,setChangeDepartment] = useState(false)
    const [newStatus,setNewStatus] = useState("")
    const [changeStatus,setChangeStatus] = useState(false)
    const [newDepartment,setNewDepartment] = useState({})

    const onDeleteLastComponent=()=>{
        dispatch(actionDeleteFinalComponent(findUser))
    }

    const onDeleteSick=()=>{
        dispatch(actionDeleteSick(findUser))
    }
    const onDeleteOther=()=>{
        dispatch(actionDeleteOther(findUser))
    }
    const onDeleteFirstComponent=()=>{
        dispatch(actionDeleteFirstComponent(findUser))
    }
    const onToggleDepartment=()=>{
        setChangeDepartment(!changeDepartment)
    }
    const onChangeDepartment=()=>{
        dispatch(actionChangeDepartment({findUser,newDepartment}))
    }
    const handleChange=(event,value)=>{
        setNewDepartment(value)
    }
    const handleChangeStatus=(event,value)=>{
        setNewStatus(value)
    }
    const onChangeStatus=()=>{
        const data = {
            id:findUser[0].id,
            status:newStatus.label
        }
       dispatch(actionChangeStatus(data))
        onOpenSnackBar()
    }
    return (
        <div>
            {openSnackBar && (
                <Portal>
                    <CustomSnackBar
                        message={message}
                    />
                </Portal>
            )}
            {findUser.length ? (
                <>
                    <h3>Информация о сотруднике</h3>
                    <div>ФИО:{findUser[0].fio}</div>
                    <div>СНИЛС:{findUser[0].snils}</div>
                    <div>
                        <span>Текущий статус:{findUser[0].status}</span>
                        <Button onClick={()=>setChangeStatus(!changeStatus)}>
                            Изменить статус
                        </Button>
                    </div>
                    {changeStatus && (
                        <div>
                            <Autocomplete
                                renderInput={(params)=>(
                                    <TextField label="Статус" {...params}/>
                                )}
                                onChange={handleChangeStatus}
                                options={status}
                                />
                            <Button onClick={onChangeStatus}>
                                Изменить
                            </Button>
                        </div>
                    )}
                    <div>Дата рождения:{dayjs(findUser[0].birthday).format('DD-MM-YYYY')}</div>
                    <React.Fragment>
                        {findUser[0].vaccine?.componentName &&
                        <div>
                            <span>Название вакцины:{findUser[0]?.vaccine?.componentName}</span>
                        </div>
                        }
                        {findUser[0].vaccine?.first_date &&
                        <div>
                                            <span>
                                                Дата первого компонента:{dayjs(findUser[0]?.vaccine?.first_date).format('DD-MM-YYYY')}
                                            </span>
                            <Button onClick={onDeleteFirstComponent}>
                                Удалить
                            </Button>
                        </div>
                        }
                        {
                            findUser[0].vaccine?.last_date &&
                            (<div>
                                            <span>
                                                   Дата второго компонента:{dayjs(findUser[0]?.vaccine.last_date).format('DD-MM-YYYY')}
                                            </span>
                                <Button onClick={onDeleteLastComponent}>
                                    Удалить
                                </Button>
                            </div>)
                        }
                        {
                            findUser[0].vaccine?.sick_date &&
                            (<div>
                                <span> Дата заболевания:{dayjs(findUser[0]?.vaccine.sick_date).format('DD-MM-YYYY')}</span>
                                <Button onClick={onDeleteSick}>
                                    Удалить
                                </Button>
                            </div>)
                        }
                        {
                            findUser[0].vaccine?.other_date &&
                            (<div>
                                            <span>
                                                Дата медотвода:{dayjs(findUser[0]?.vaccine.other_date).format('DD-MM-YYYY')}
                                            </span>
                                <Button onClick={onDeleteOther}>
                                    Удалить
                                </Button>
                            </div>)
                        }
                        {
                            findUser[0].vaccine?.reason && (
                                <div>
                                    <span>Причина:{findUser[0]?.vaccine.reason}</span>
                                </div>
                            )
                        }
                        <Button onClick={onToggleDepartment}>
                            Изменить отделение
                        </Button>
                        {changeDepartment && (
                            <div>
                                <Autocomplete
                                    renderInput={(params)=>(
                                        <TextField {...params}/>
                                    )}
                                    getOptionLabel={(option=>option.label)}
                                    options={departments}
                                    onChange={handleChange}
                                />
                                <Button onClick={onChangeDepartment}>
                                    Подтвердить
                                </Button>
                            </div>
                        )}
                    </React.Fragment>
                </>
            ):(
                <h1>Нет данных о пользователе😞</h1>
            )}
        </div>
    )
}

export {
    UserInfo
}