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
    otherDate,
    deleteSickDate,
    deleteOtherDate,
    deleteFinalComponent,
    deleteFirstComponent,
    addOneComponent, deleteDashboard
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

function actionDeleteFirstComponent(payload){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/delete-first`,payload)
            .then(({data})=>dispatch(deleteFirstComponent(data)))
            .catch(error=>console.log(error))
    }
}

function actionDeleteFinalComponent(payload){
    return dispatch=>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/dashboard/delete-final`,{data:payload})
            .then(({data})=>dispatch(deleteFinalComponent(data)))
            .catch(error=>console.log(error))
    }
}

function actionDeleteSick(payload){
    return dispatch=>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/dashboard/delete-sick`,{data:payload})
            .then(({data})=>dispatch(deleteOtherDate(data)))
            .catch(error=>console.log(error))
    }
}

function actionDeleteOther(payload){
    return dispatch=>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/dashboard/delete-other`,{data:payload})
            .then(({data})=>dispatch(deleteOtherDate(data)))
            .catch(error=>console.log(error))
    }
}

function actionAddOneComponent(payload){
    return dispatch=>{
        axios.post(`${process.env.REACT_APP_BASE_URL}/dashboard/one-component`,payload)
            .then(({data})=>dispatch(addOneComponent(data)))
            .catch(error=>console.log(error))
    }
}
function actionDeleteUser(payload){
    return dispatch=>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/dashboard/delete-dashboard`,{
            params:{
                user:payload.id
            }
        })
            .then(()=>dispatch(deleteDashboard(payload.id)))
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
    actionSearch,
    actionSickDate,
    actionFilterData,
    actionClearMessage,
    actionAddOtherDate,
    generate,
    actionDeleteFirstComponent,
    actionDeleteSick,
    actionDeleteFinalComponent,
    actionDeleteOther,
    actionAddOneComponent,
    actionDeleteUser
}