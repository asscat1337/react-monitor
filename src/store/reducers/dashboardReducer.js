import {
    GET_DATA,
    ADD_DATA,
    ADD_VACCINE, GET_NOT_VACCINED, LOADING_DATA, GET_INFO
} from "../types/dashboardTypes";

const initialState = {
    notVaccined:[],
    info:[],
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
                data:action.payload,
                loading:false
            }
        case ADD_DATA :
            return {
                ...state,
                data:[...state.data,action.payload]
            }
        case ADD_VACCINE :
            return {
                ...state,
               data: [...state.data,action.payload],
                notVaccined: state.notVaccined.filter(item=>item.id !== action.payload.id)
            }
        case GET_NOT_VACCINED :
            return {
                ...state,
                loading:false,
                notVaccined: action.payload.data,
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
                info:action.payload
            }
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

export default dashboardReducer