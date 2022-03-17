import {Paper,Button,Box} from "@mui/material"
import {useNavigate} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {actionLogout} from "../../store/actions/actionAuth";
import CustomSwitch from "../Switch/CustomSwitch";

function Header({onChange,checked}){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onLogout = ()=>{
        dispatch(actionLogout())
        navigate('/login')
    }

    return (
        <Box>
            <Paper elevation={4} sx={{display:"flex",justifyContent:"space-between"}}>
                <CustomSwitch
                    onChange={onChange}
                    checked={checked === 'light' ? true:false}
                />

                <Button onClick={onLogout}>
                    Выход
                </Button>
            </Paper>
        </Box>
    )
}

export default Header