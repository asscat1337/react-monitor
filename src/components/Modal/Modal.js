import React from 'react'
import {Modal,Box} from '@mui/material'
import {useDispatch} from "react-redux";
import {actionClearMessage} from "../../store/actions/actionDashboard";

const style = {
    position:'absolute',
    top:'50%',
    left:'50%',
    transform:'translate(-50%,-50%)',
    width:400,
    bgcolor:'background.paper',
    boxShadow:24,
    p:4

}

function СustomModal({open,setOpen,children}){

    const dispatch = useDispatch()

    const handleClose=()=>{
        setOpen(false)
        dispatch(actionClearMessage())
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    {
                        children
                    }
                </Box>
            </Modal>
        </>
    )
}



export default СustomModal