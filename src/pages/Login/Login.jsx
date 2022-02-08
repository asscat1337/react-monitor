import {Grid,CssBaseline,Container,Paper} from '@mui/material'
import FormLogin from "../../components/Forms/FormLogin/FormLogin";
import {useNavigate} from 'react-router-dom'

function Login(){
    const navigate = useNavigate()
    return (
        <Container maxWidth="xs">
            <CssBaseline/>
                <Paper elevation={4} sx={{height:400}}>
                        <h3>Авторизация</h3>
                        <FormLogin navigate={navigate}/>
                </Paper>
        </Container>
    )
}




export default Login