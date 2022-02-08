import React from 'react'
import {DataGrid} from "@mui/x-data-grid";
import {Button} from '@mui/material'
import {useDispatch} from "react-redux";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import columns from "../../../helpers/transform-table";
import {actionGetCurrentUserInfo} from "../../../store/actions/actionDashboard";


function VaccineDataGrid({data,setOpen,setCurrentId,setModalValue}){
    const dispatch = useDispatch()
    const onClickData=(event,params)=>{
        setCurrentId(params.id)
        event.stopPropagation()
        setOpen(true)
        setModalValue('add')
    }
    const onClickInfo=(event,params)=>{
        event.stopPropagation()
        setOpen(true)
        setModalValue('info')
        dispatch(actionGetCurrentUserInfo(params.id))
    }

    const transformedColumn = [...columns,{
        field:'action',
                headerName:'actions',
                sortable:false,
                width:220,
                disableClickEventBubbling:true,
                renderCell:(params)=>{
                    return (
                        <>
                            <Button onClick={(event)=>onClickData(event,params)}>
                                Добавить вакцину
                            </Button>
                            <Button
                                aria-label="Иформация"
                                onClick={(event)=>onClickInfo(event,params)}
                                endIcon={
                                    <InfoOutlinedIcon/>
                                }
                            />
                        </>
                    )
                }
    }]

    return (
        <div style={{display:'flex',height:400,width:'100%'}}>
            <div style={{flexGrow:1}}>
                <DataGrid
                    columns={transformedColumn}
                    rows={data}
                />
            </div>
        </div>
    )
}



export default VaccineDataGrid