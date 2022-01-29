import {
    getData,
    addData,
    addVaccine,
    getNotVaccined,
    loadingData, getInfo
} from "../reducers/dashboardReducer";
import axios from "axios";

function actionGetData(){
        return dispatch=>{
            axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard`)
                .then(({data})=>dispatch(getData(data)))
                .catch(error=>console.log(error))
        }
}

function actionAddData(newData){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/add`,newData)
            .then(({data})=>dispatch(addData(data)))
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

function actionGetCurrentUserInfo(id){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/get-info?id=${id}`)
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
    actionGetCurrentUserInfo
}