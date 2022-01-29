import React from 'react'
import {DataGrid} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import {useSelector,useDispatch} from "react-redux";
import {actionGetNotVaccined} from "../../../store/actions/actionDashboard";
import generateColumn from "../../../helpers/transform-table";



function NotVaccineDataGrid({rows = [],rowsCount,size,page,setOpen,setCurrentId}){
    const dispatch = useDispatch()

    const loading = useSelector(state=>state.dashboard.loading)

    const onClickData=(event,data)=>{
        event.stopPropagation()
        setOpen(true)
        setCurrentId(data.id)
    }

    const columns = [
        { field: 'fio', headerName: 'ФИО',width:250},
        { field: 'position', headerName: 'Должность',width: 150},
        { field: 'isVaccined', headerName: 'Вакцинирован?',width: 150},
        { field: 'department', headerName: 'Отделение',width: 200},
        {
            field:'action',
            headerName:'actions',
            sortable:false,
            width:200,
            disableClickEventBubbling:true,
            renderCell:(params)=>{
                return (
                    <Button onClick={(event)=>onClickData(event,params)}>
                        Добавить вакцину
                    </Button>
                )
            }}
    ]

    React.useEffect(()=>{
        console.log(page)
    },[page])

    const onChangePageSize=(data)=>{
        console.log(data)
    }
    const onChangePage=page=>{
        dispatch(actionGetNotVaccined(page,size))
    }

    return (
        <div style={{height:300,width:'100%'}}>
            <DataGrid
                rowCount={rowsCount}
                pageSize={size}
                onPageSizeChange={(newPage)=>onChangePageSize(newPage)}
                onPageChange={(page)=>onChangePage(page)}
                paginationMode="server"
                rows={rows}
                columns={columns}
                pagination
                loading = {loading}
                rowsPerPageOptions={[10,15,20]}
            />
        </div>
    )
}



export default NotVaccineDataGrid