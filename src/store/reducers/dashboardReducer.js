import {
    GET_DATA,
    ADD_DATA,
    ADD_VACCINE,
    GET_NOT_VACCINED,
    LOADING_DATA,
    GET_INFO,
    SEARCH_DATA,
    ERROR_DASHBOARD,
    SICK_DATE,
    FILTER_DATA,
    CLEAR_MESSAGE,
    OTHER_DATE,
    DELETE_OTHER,
    DELETE_FIRST_COMPONENT,
    DELETE_FINAL_COMPONENT,
    DELETE_SICK_DATE
} from "../types/dashboardTypes";

const initialState = {
    info:[],
    infoVaccine:[],
    message:'',
    error:'',
    loading:true,
    page:0,
    size:5,
    rowsAll:0,
    rowsNotVaccine: 0
}

function dashboardReducer(state = initialState,action){
    switch (action.type) {
        case GET_DATA :
            return {
                ...state,
                data:action.payload.data,
                rowsAll:action.payload.rowsAll,
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
                 notVaccine: state.notVaccine?.filter(current=>{
                     if(action.payload.data.isVaccined === 1){
                         return current.id !== action.payload.data.dashboard_id
                     }else {
                         return current
                     }
                 })
                     .map(item=>{
                     if(item.id === action.payload.data.dashboard_id){
                         return {
                             ...item,
                             isFirstComponent:action.payload.data.isFirstComponent,
                             isVaccined:Number(action.payload.data.isVaccined),
                             vaccine:action.payload.data.vaccine
                         }
                     }
                     return item
                 }),
                data: state.data.map(item=>{
                    if(item.id === action.payload.data.dashboard_id){
                        return {
                            ...item,
                            isFirstComponent:action.payload.data.isFirstComponent,
                            isVaccined:Number(action.payload.data.isVaccined),
                            vaccine:action.payload.data.vaccine
                        }
                    }
                    return item
                }),
               message:action.payload.message
            }
        case GET_NOT_VACCINED :
            return {
                ...state,
                loading:false,
                notVaccine: action.payload.data,
                rowsNotVaccine:action.payload.rowsNotVaccine,
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
        case FILTER_DATA :
            return  {
                ...state,
                data:action.payload
        }
        case ERROR_DASHBOARD :
            return {
                ...state,
                message:action.payload
            }
        case SICK_DATE :
            return {
                ...state,
                data:state.data.map(item=>{
                    if(item.id === action.payload.data.dashboard_id){
                        return {
                            ...item,
                            isSick:action.payload.data.isSick,
                            isVaccined:action.payload.data.isVaccined,
                            vaccine:action.payload.data.vaccine
                        }
                    }
                    return item
                }),
                notVaccine: state.notVaccine?.filter(item=>item.id !== action.payload.data.dashboard_id),
                message:action.payload.message
            }
        case CLEAR_MESSAGE :
            return {
                ...state,
                message:''
            }
        case ERROR_DASHBOARD :
            return {
                ...state,
                message:action.payload.message
            }
        case OTHER_DATE :
            return {
                ...state,
                data:state.data.map(item=>{
                    if(item.id === action.payload.data.dashboard_id){
                        return {
                            ...item,
                            isVaccined:action.payload.data.isVaccined,
                            other_date:action.payload.data.other_date
                        }
                    }
                    return item
                }),
                notVaccine:state.notVaccine.filter(item=>item.id !== action.payload.data.dashboard_id),
                message:action.payload.message
            }
        case DELETE_FIRST_COMPONENT :
            return {
                ...state,
                data:state.data.map(item=>{
                    if(item.id === action.payload.id){
                        return {
                            ...item,
                            vaccine:action.payload.vaccine
                        }
                    }
                    return item
                })
            }
        case DELETE_FINAL_COMPONENT :
            return {
                ...state,
                data:state.data.filter(item=>item.id !== action.payload.id),
                notVaccine: [...state.notVaccine,action.payload]
            }
        case DELETE_SICK_DATE :
            return {
                ...state,
                data:state.data.filter(item=>item.id !==action.payload.id),
                notVaccine: [...state.notVaccine,action.payload]
            }
        case DELETE_OTHER :
            return {
                ...state,
                data:state.data.filter(item=>item.id !== action.payload.id),
                notVaccine: [...state.notVaccine,action.payload]

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
export const sickDate=(payload)=>({type:SICK_DATE,payload})
export const filterData=(payload)=>({type:FILTER_DATA,payload})
export const clearMessage=()=>({type:CLEAR_MESSAGE})
export const otherDate=(payload)=>({type:OTHER_DATE,payload})
export const deleteFirstComponent=(payload)=>({type:DELETE_FIRST_COMPONENT,payload})
export const deleteFinalComponent=(payload)=>({type:DELETE_FINAL_COMPONENT,payload})
export const deleteSickDate=(payload)=>({type:DELETE_SICK_DATE,payload})
export const deleteOtherDate=(payload)=>({type:DELETE_OTHER,payload})
export default dashboardReducer