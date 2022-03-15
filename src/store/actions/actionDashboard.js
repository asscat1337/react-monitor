import {
    getData,
    addData,
    addVaccine,
    getNotVaccined,
    loadingData,
    getInfo,
    search,
    errorData,
    filterData,
    sickDate,
    clearMessage,
    otherDate
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
            .catch(error=>dispatch(errorData(error.response.data.message)))
    }
}

function  actionSearch(data){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/search?query=${data}`)
            .then(({data})=>dispatch(search(data)))
            .catch(error=>console.log(error))
    }
}

 function actionSickDate(data){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/sick-date`,data)
            .then(({data})=>dispatch(sickDate(data)))
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
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/get-info?id=${data.id}`)
            .then(({data})=>dispatch(getInfo(data)))
            .catch(error=>console.log(error))
    }
}

function actionGetNotVaccined(page,size){
    return dispatch=>{
        console.log(page,size)
        dispatch(loadingData())
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/not-vaccined?page=${page}&size=${size}`)
            .then(({data})=>dispatch(getNotVaccined({page,size,...data})))
            .catch(error=>console.log(error))
    }
}

function actionFilterData(filter){
    return dispatch=>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/filter?query=${filter}`)
            .then(({data})=>dispatch(filterData(data)))
    }
}
function actionClearMessage(){
    return dispatch=>{
        dispatch(clearMessage())
    }
}

function actionAddOtherDate(data){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/other-date`,data)
            .then(({data})=>dispatch(otherDate(data)))
            .catch(error=>console.log(error))
    }
}

async function generate(){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/dashboard/generate`)
    const data = await response.blob()
    const link = window.URL.createObjectURL(data)
    const createLink = document.createElement('a')
    createLink.href = link
    createLink.download = 'Список сотрудников.xlsx';
    document.body.appendChild(createLink)
    createLink.click()

}

export {
    actionGetData,
    actionAddData,
    actionAddVaccine,
    actionGetNotVaccined,
    actionGetCurrentUserInfo,
    actionFirstComponent,
    actionFinalComponent,
    actionSearch,
    actionSickDate,
    actionFilterData,
    actionClearMessage,
    actionAddOtherDate,
    generate
}