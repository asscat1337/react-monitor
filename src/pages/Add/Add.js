import React from 'react'
import {CssBaseline,Container} from "@mui/material";
import {useSelector,useDispatch} from "react-redux";
import FormAdd from "../../components/Forms/FormAddEmployee/FormAdd";
import {actionGetDepartment} from "../../store/actions/actionDepartment";
import CustomSnackBar from "../../components/SnackBar/CustomSnackBar";
import Context from '../../components/context/context'


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
    )
}



export default Add