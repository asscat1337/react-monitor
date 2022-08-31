import {Button} from "@mui/material";
import React from "react";


const ConfirmDelete=({onDeleteDashboard,closeModal})=>{
    return (
        <>
            <h5>
                Вы точно хотите удалить?
            </h5>
            <div >
                <Button
                    variant="outlined"
                    onClick={onDeleteDashboard}
                >
                    Удалить
                </Button>
                <Button
                    variant="outlined"
                    onClick={closeModal}
                >
                    Закрыть
                </Button>
            </div>
        </>
    )
}

export {
    ConfirmDelete
}