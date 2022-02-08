import {
    getData,
    addData,
    addVaccine,
    getNotVaccined,
    loadingData,
    getInfo,
    search,
    errorData
} from "../reducers/dashboardReducer";
import axios from "axios";
import $api from "../../components/http/http";

function actionGetData(page,size){
        return dispatch=>{
            $api.get(`${process.env.REACT_APP_BASE_URL}/dashboard?page=${page}&size=${size}`)
                .then(({data})=>dispatch(getData({page,size,...data})))
                .catch(error=>console.log(error))
        }
}

function actionAddData(newData){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/add`,newData)
            .then(({data})=>dispatch(addData(data)))
            .catch(error=>{
                dispatch(errorData(error.response.data.message))
            })
    }

}

function actionFirstComponent(data){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/first-component`,data)
            .then(({data})=>dispatch(addVaccine(data)))
            .catch(error=>console.log(error))
    }

}

function actionFinalComponent(data){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/final-component`,data)
            .then(({data})=>dispatch(addVaccine(data)))
            .catch(error=>console.log(error))
    }
}

function  actionSearch(data){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/search?query=${data}`)
            .then(({data})=>dispatch(search(data)))
            .catch(error=>console.log(error))
    }
}

function actionAddVaccine(newData){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/add-vaccine`,newData)
            .then(({data})=>dispatch(addVaccine(data)))
            .catch(error=>console.log(error))
    }
}

function actionGetCurrentUserInfo(data){
    console.log(data)
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/get-info?id=${data.id}`)
            .then(({data})=>dispatch(getInfo(data)))
            .catch(error=>console.log(error))
    }
}

function actionGetNotVaccined(page,size){
    return dispatch=>{
        dispatch(loadingData())
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/not-vaccined?page=${page}&size=${size}`)
            .then(({data})=>dispatch(getNotVaccined({page,size,...data})))
            .catch(error=>console.log(error))
    }
}


export {
    actionGetData,
    actionAddData,
    actionAddVaccine,
    actionGetNotVaccined,
    actionGetCurrentUserInfo,
    actionFirstComponent,
    actionFinalComponent,
    actionSearch
}