import {
    AUTH_LOGIN, LOGOUT_USER
} from "../types/authTypes";

const initialState = {
    loading:true,
    error:'',
    user:[],
    isAuth:false
}


function authReducer(state = initialState,action){
    switch (action.type){
        case AUTH_LOGIN :
            return {
                ...state,
                loading:false,
                user:action.payload,
                isAuth:true
            }
        case LOGOUT_USER :
            return {
                ...state,
                user:[],
                isAuth: false
            }
        default :
            return state
    }
}

export const login=payload=>({type:AUTH_LOGIN,payload})
export const logout=()=>({type:LOGOUT_USER})


export default authReducer