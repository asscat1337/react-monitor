import {GET_DEPARTMENT} from "../types/departmentTypes";


const initialState = {
    data:[],
    loading:true,
    message:'',
    error:''
}


function DepartmentReducer(state = initialState,action){
        switch (action.type){
            case GET_DEPARTMENT :
                return {
                    ...state,
                    loading:false,
                    data:action.payload
                }

            default:
                return state

        }
}

export const getDepartment=payload=>({type:GET_DEPARTMENT,payload})

export default DepartmentReducer