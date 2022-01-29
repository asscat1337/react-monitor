import React from 'react'
import {Modal,Button,Box,Typography} from '@mui/material'

const style = {
    position:'absolute',
    top:'50%',
    left:'50%',
    transform:'translate (-50%,-50%)',
    width:400,
    bgcolor:'background.paper',
    boxShadow:24,
    p:4

}

function СustomModal({open,setOpen,children}){

    const handleClose=()=>setOpen(false)
    const handleOpen=()=>setOpen(true)

    return (
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
    )
}



export default СustomModal