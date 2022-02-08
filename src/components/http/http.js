import axios from 'axios'


const $api = axios.create({
    baseURL:process.env.REACT_APP_BASE_URL
})

$api.interceptors.request.use(config=>{
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use(config=>{
    return config
},error => {

})

export default $api