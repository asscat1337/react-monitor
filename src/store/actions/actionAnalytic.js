import axios from 'axios'
import {dataAnalytic} from "../reducers/analyticReducer";
import $api from "../../components/http/http";


function actionGetAnalytic(){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/analytics/get-data`)
            .then(({data})=>dispatch(dataAnalytic(data)))
            .catch(error=>console.log(error))
    }
}
function actionGetAnalyticMonth(month){
    return async (dispatch)=>{
        await $api.get('/analytics/get-data',{
            params:{
                month
            }
        })
            .then(({data})=>dispatch(dataAnalytic(data)))
            .catch(error=>console.log(error))
    }
}


export {
    actionGetAnalytic,
    actionGetAnalyticMonth
}