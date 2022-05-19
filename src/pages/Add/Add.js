import React from 'react'
import {CssBaseline,Container} from "@mui/material";
import {useSelector,useDispatch} from "react-redux";
import {actionGetDepartment} from "../../store/actions/actionDepartment";
import Context from '../../components/context/context'
const CustomSnackBar = React.lazy(()=>import("../../components/SnackBar/CustomSnackBar"))
const FormAdd = React.lazy(()=>import("../../components/Forms/FormAddEmployee/FormAdd"))


function Add(){
    const {openSnackBar} = React.useContext(Context)
    const dispatch = useDispatch()
    const options = useSelector(state=>state.department.data)
    const message = useSelector(state=>state.dashboard.message)
    const error = useSelector(state=>state.dashboard.error)


    React.useEffect(()=>{
        dispatch(actionGetDepartment())
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
                    <FormAdd options={options}/>
                </Container>
            </>
        </React.Suspense>
    )
}



export default Add