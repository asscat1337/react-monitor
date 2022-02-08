import {
    GET_DATA,
    ADD_DATA,
    ADD_VACCINE,
    GET_NOT_VACCINED,
    LOADING_DATA,
    GET_INFO,
    SEARCH_DATA,
    ERROR_DASHBOARD
} from "../types/dashboardTypes";

const initialState = {
    info:[],
    infoVaccine:[],
    message:'',
    error:'',
    loading:true,
    page:0,
    size:5
}

function dashboardReducer(state = initialState,action){
    switch (action.type) {
        case GET_DATA :
            return {
                ...state,
                data:action.payload.data,
                rows:action.payload.rows,
                page:action.payload.page,
                loading:false
            }
        case ADD_DATA :
            return {
                ...state,
                data:[...state.data,action.payload.data],
                message:action.payload.message
            }
        case ADD_VACCINE :
            return {
                ...state,
                 notVaccine: state.notVaccine.filter(current=>{
                     if(action.payload.isVaccined === 1){
                         return current.id !== action.payload.dashboard_id
                     }else {
                         return current
                     }
                 })
                     .map(item=>{
                     if(item.id === action.payload.dashboard_id){
                         return {
                             ...item,
                             isFirstComponent:action.payload.isFirstComponent,
                         }
                     }
                     return item
                 }),
                data: state.data.map(item=>{
                    if(item.id === action.payload.dashboard_id){
                        return {
                            ...item,
                            isFirstComponent:action.payload.isFirstComponent,
                            isVaccined:action.payload.isVaccined
                        }
                    }
                    return item
                })
            }
        case GET_NOT_VACCINED :
            return {
                ...state,
                loading:false,
                notVaccine: action.payload.data,
                rows:action.payload.rows,
                page:action.payload.page
            }
        case LOADING_DATA :
            return {
                ...state,
                loading:true
            }
        case GET_INFO :{
            return {
                ...state,
                info:[action.payload]
            }
        }
        case SEARCH_DATA : {
            return {
                ...state,
                data:action.payload
            }
        }
        case ERROR_DASHBOARD :
            return {
                ...state,
                message:action.payload
            }
        default:
            return state
    }
}

export const getData=payload=>({type:GET_DATA,payload})
export const addData=payload=>({type:ADD_DATA,payload})
export const addVaccine=payload=>({type:ADD_VACCINE,payload})
export const getNotVaccined=payload=>({type:GET_NOT_VACCINED,payload})
export const loadingData=()=>({type:LOADING_DATA})
export const getInfo=(payload)=>({type:GET_INFO,payload})
export const search=(payload)=>({type:SEARCH_DATA,payload})
export const errorData=(payload)=>({type:ERROR_DASHBOARD,payload})

export default dashboardReducer