import React from 'react'
import {useSelector,useDispatch} from "react-redux";
import FormAdd from "../../components/Forms/FormAddEmployee/FormAdd";
import {actionGetDepartment} from "../../store/actions/actionDepartment";


function Add(){
    const dispatch = useDispatch()
    const options = useSelector(state=>state.department.data)


    React.useEffect(()=>{
        dispatch(actionGetDepartment())
    },[])

    return (
        <>
            <h1>Форма добавления сотрудника</h1>
            <FormAdd options={options}/>
        </>
    )
}



export default Add