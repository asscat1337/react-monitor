import React from 'react'
import {DataGrid, getGridStringOperators, ruRU} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import {useSelector} from "react-redux";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";




function NotVaccineDataGrid({rows = [],rowsCount,size,setOpen,setCurrentId,setModalValue,onChangePage,onFilterData}){
    const loading = useSelector(state=>state.dashboard.loading)

    const onClickData=(event,data)=>{
        event.stopPropagation()
        setOpen(true)
        setCurrentId(data.id)
        setModalValue('add')
    }

    const onClickInfo=(event,params)=>{
        event.stopPropagation()
        setOpen(true)
        setModalValue('info')
        setCurrentId(params.id)

    }

    const onClickSick=(event,params)=>{
        event.stopPropagation()
        setModalValue('sick')
        setOpen(true)
        setCurrentId(params.id)
    }



    const columns = [
        { field: 'fio', headerName: 'ФИО',width:250},
        { field: 'position', headerName: 'Должность',width: 300},
        { field: 'isVaccined',
            headerName: 'Вакцинирован?',
            width: 150,
            renderCell:(params)=>{
               return (
                   <>
                       {params.row.isVaccined === 1 ? "Да" : "Нет"}
                   </>
               )
            }
        },
        {
            field: 'department',
            headerName: 'Отделение',
            width: 300,
            filterOperators:getGridStringOperators().filter(
                operator=>operator.value === 'contains'
            )
        },
        {
            field:'action',
            headerName:'Действия',
            sortable:false,
            width:450,
            disableClickEventBubbling:true,
            renderCell:(params)=>{
                return (
                    <>
                        <Button onClick={(event)=>onClickData(event,params)}>
                            Добавить вакцину
                        </Button>
                        <Button onClick={(event)=>onClickSick(event,params)}>
                            Добавить болезнь
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
            }}
    ]


    return (
        <div style={{height:500,width:'100%'}}>
            <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                rowCount={rowsCount}
                pageSize={size}
                onPageChange={(page)=>onChangePage(page)}
                paginationMode="server"
                filterMode="server"
                onFilterModelChange={onFilterData}
                rows={rows}
                columns={columns}
                pagination
                loading = {loading}
            />
        </div>
    )
}



export default NotVaccineDataGrid