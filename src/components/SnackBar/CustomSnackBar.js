import React from "react";
import {Stack,Snackbar,CssBaseline} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import Context from "../context/context";


const Alert = React.forwardRef((props,ref)=>{
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function CustomSnackBar({variant="info",message = ""}){
    const {openSnackBar,onCloseSnackBar} = React.useContext(Context)
    return(
        <>
            <Stack spacing={2} sx={{width:'100%'}}>
                <CssBaseline/>
                <Snackbar
                    autoHideDuration={6000}
                    open={openSnackBar}
                    onClose={onCloseSnackBar}
                    anchorOrigin={{
                        vertical:"top",
                        horizontal:'right'
                    }}
                >
                    <Alert severity={variant} onClose={onCloseSnackBar}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    )
}


export default CustomSnackBar