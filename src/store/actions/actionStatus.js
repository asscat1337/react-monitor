import $api from "../../components/http/http";
import {getStatus} from "../reducers/statusReducer";


const asyncGetStatus=()=>{
    return async (dispatch)=>{
        const {data} = await $api.get('/status/get-status')
        dispatch(getStatus(data))
    }
}

export {
    asyncGetStatus
}