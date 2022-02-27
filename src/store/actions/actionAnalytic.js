import axios from 'axios'
import {dataAnalytic} from "../reducers/analyticReducer";


function actionGetAnalytic(){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/analytics/get-data`)
            .then(({data})=>dispatch(dataAnalytic(data)))
            .catch(error=>console.log(error))
    }
}



export {
    actionGetAnalytic
}