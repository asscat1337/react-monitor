import {DATA_ANALYTIC} from "../types/analyticTypes";


const initialState = {
    vaccine:0,
    notVaccine:0
}


function analyticReducer(state=initialState,action){
    switch (action.type){
        case DATA_ANALYTIC :
            return {
                vaccine:action.payload.vaccine,
                notVaccine: action.payload.notVaccined,
                sick:action.payload.sick
            }
        default :
            return state
    }
}

export const dataAnalytic=(payload)=>({type:DATA_ANALYTIC,payload})

export default analyticReducer