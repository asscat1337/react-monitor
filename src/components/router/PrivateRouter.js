import {useSelector} from "react-redux";
import {Navigate,useLocation} from "react-router-dom";



function PrivateRouter({component:Component}){
    const location = useLocation()
    const isAuth = useSelector(state=>state.auth.isAuth)

    console.log(isAuth)

    if(isAuth){
        return <Component/>
    }

    return <Navigate
        to="/login"
        state={{path:location.pathname}}
    />
}



export default PrivateRouter