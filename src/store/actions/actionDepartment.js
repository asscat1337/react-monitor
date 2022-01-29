import {getDepartment} from "../reducers/departmentReducer";
import axios from "axios";

function actionGetDepartment(){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/get-department`)
            .then(({data})=>dispatch(getDepartment(data)))
            .catch(error=>console.log(error))
    }
}



export {
    actionGetDepartment
}