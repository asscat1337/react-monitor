import React, {useState} from 'react'
import {DataGrid,ruRU} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import {useSelector,useDispatch} from "react-redux";
import {actionGetCurrentUserInfo} from "../../../store/actions/actionDashboard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Search from "../../Search/Search";
import escapeRegExp from "../../../helpers/escapeRegExp";




function NotVaccineDataGrid({rows = [],rowsCount,size,setOpen,setCurrentId,setModalValue,onChangePage}){
    const [searchText,setSearchText] = useState('')
    const dispatch = useDispatch()

    const loading = useSelector(state=>state.dashboard.loading)

    const onClickData=(event,data)=>{
        event.stopPropagation()
        setOpen(true)
        setCurrentId(data.id)
        setModalValue('add')
    }

    const onClickInfo=(event,params)=>{
        console.log(params)
        event.stopPropagation()
        setOpen(true)
        setModalValue('info')
        dispatch(actionGetCurrentUserInfo(params.row))

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
            width:250,
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
            }}
    ]

    const onChangePageSize=(data)=>{
        console.log(data)
    }

    const requestSearch=React.useMemo(()=>{
        const searchRegex = new RegExp(escapeRegExp(searchText),'i')
        return rows.filter(row=>Object.keys(row).some(field=> {
            return searchRegex.test(row[field].toString())
        })
        )
    },[searchText,rows])

    return (
        <div style={{height:500,width:'100%'}}>
            <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                // components={{Toolbar:Search}}
                // componentsProps={{
                //     toolbar:{
                //         value:searchText,
                //         onChange:(event)=>setSearchText(event.target.value),
                //         clearSearch:()=>requestSearch('')
                //     }
                // }}
                rowCount={rowsCount}
                pageSize={size}
                onPageSizeChange={(newPage)=>onChangePageSize(newPage)}
                onPageChange={(page)=>onChangePage(page)}
                paginationMode="server"
                rows={requestSearch}
                columns={columns}
                pagination
                loading = {loading}
                rowsPerPageOptions={[10,15,20]}
            />
        </div>
    )
}



export default NotVaccineDataGrid