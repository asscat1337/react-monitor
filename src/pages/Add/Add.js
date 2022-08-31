import React from 'react'
import {CssBaseline,Container} from "@mui/material";
import {useSelector,useDispatch} from "react-redux";
import {actionGetDepartment} from "../../store/actions/actionDepartment";
import {asyncGetStatus} from "../../store/actions/actionStatus";
import Context from '../../components/context/context'
const CustomSnackBar = React.lazy(()=>import("../../components/SnackBar/CustomSnackBar"))
const FormAdd = React.lazy(()=>import("../../components/Forms/FormAddEmployee/FormAdd"))


function Add(){
    const {openSnackBar} = React.useContext(Context)
    const dispatch = useDispatch()
    const options = useSelector(state=>state.department.data)
    const message = useSelector(state=>state.dashboard.message)
    const error = useSelector(state=>state.dashboard.error)
    const status = useSelector(state=>state.status.data)


    React.useEffect(()=>{
           dispatch(actionGetDepartment())
           dispatch(asyncGetStatus())
    },[])

    return (
        <React.Suspense fallback={<div>Загрузка...</div>}>
            <>
                {
                    openSnackBar &&
                    <CustomSnackBar
                        message={message ?? error}
                        variant="info"
                    />
                }
                <Container maxWidth="sm">
                    <CssBaseline/>
                    <h1>Форма добавления сотрудника</h1>
                    <FormAdd
                        options={options}
                        status={status}
                    />
                </Container>
            </>
        </React.Suspense>
    )
}



export default Add