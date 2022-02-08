import {login,logout} from '../reducers/authReducer'
import axios from 'axios'



function actionLogin(data,navigate){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`,data)
            .then(({data})=>{
                dispatch(login(data))
                localStorage.setItem('token',data.accessToken)
                navigate('/dashboard')
            })
            .catch(error=>console.log(error));
    }
}

function actionLogout(){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/auth/logout`)
            .then(()=>{
                dispatch(logout())
            })
            .catch(error=>console.log(error))
    }
}



export {
    actionLogin,
    actionLogout
}