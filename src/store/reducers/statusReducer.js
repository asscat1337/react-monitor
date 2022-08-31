import {GET_STATUS} from "../types/statusType";


const initialState = {
    data:{},
    loading:false,
    error:"",
}


const status=(state=initialState,action)=>{
    switch (action.type){
        case GET_STATUS :
            return {
                data:action.payload,
                loading: true,
                error:""
            }
        default:
            return state
    }
}

export const getStatus=(payload)=>({type:GET_STATUS,payload})

export default status