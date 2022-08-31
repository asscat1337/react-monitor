import React, {useState} from 'react'
import {useDispatch,useSelector} from "react-redux";
import {Box, Button, Tab,CssBaseline} from "@mui/material";
import {Link} from 'react-router-dom'
import {
    actionFilterData,
    actionGetData,
    actionGetNotVaccined,
    actionSearch,
    actionDeleteUser,
} from "../../store/actions/actionDashboard";
import СustomModal from "../../components/Modal/Modal";
import Search from "../../components/Search/Search";
import useDebounce from "../../components/hooks/use-debounce";
import {actionGetAnalytic} from "../../store/actions/actionAnalytic";
import {actionGetDepartment} from "../../store/actions/actionDepartment";
import {AddModalBlock} from "../../components/AddModalBlock/AddModalBlock";
import {ConfirmDelete} from "../../components/ConfirmDelete/ConfirmDelete";
import {SickBlock} from "../../components/SickBlock/SickBlock";
import {UserInfo} from "../../components/UserInfo/UserInfo";
import {asyncGetStatus} from "../../store/actions/actionStatus";
const NotVaccineDataGrid = React.lazy(()=>import("../../components/DataGrid/NotVaccineDataGrid/NotVaccineDataGrid"))
const TabPanel = React.lazy(()=>import('@mui/lab/TabPanel'))
const TabList = React.lazy(()=>import('@mui/lab/TabList'))
const TabContext = React.lazy(()=>import('@mui/lab/TabContext'))
const Chart = React.lazy(()=>import("../../components/Chart/Chart"))



function Dashboard(){
    const [value,setValue] = useState("1")
    const [open,setOpen] = useState(false)
    const [currentId,setCurrentId] = useState(null)
    const [modalValue,setModalValue] = useState('')
    const [search,setSearch] = useState('')
    const [searchText,setSearchText] = useState('')
    const [deleteUser,setDeleteUser] = useState({})
    const debounceSearch = useDebounce(search,1000)

    const dispatch = useDispatch()
    const page = useSelector(state=>state.dashboard.page)
    const size = useSelector(state=>state.dashboard.size)
    const loading = useSelector(state=>state.dashobard?.loading)
    const rowsCountAll = useSelector(state=>state.dashboard.rowsAll)
    const rowsCountNotVaccine = useSelector(state=>state.dashboard.rowsNotVaccine)
    const rows = useSelector(state=>state.dashboard?.data)
    const notVaccine = useSelector(state=>state.dashboard?.notVaccine)
    const vaccined = useSelector(state=>state.analytic?.vaccine)
    const notVaccined = useSelector(state=>state.analytic?.notVaccine)
    const sick = useSelector(state=>state.analytic?.sick)
    const departments = useSelector(state=>state.department?.data)
    const status = useSelector(state=>state.status?.data)

    const findUser = [...notVaccine ?? [],...rows ?? []].filter(item=>{
        return item.id === currentId
    })

    React.useEffect(()=>{
        if(debounceSearch === "" && searchText === ""){
            dispatch(actionGetData(page,size))
        }
        if(searchText){
            dispatch(actionFilterData(searchText))
        }
        if(debounceSearch){
            dispatch(actionSearch(debounceSearch))
        }
    },[debounceSearch,searchText])

    React.useEffect(()=>{
       dispatch(actionGetDepartment())

        if(!status.length){
            dispatch(asyncGetStatus())
        }
    },[])

    const onDeleteDashboard=()=>{
       dispatch(actionDeleteUser(deleteUser))
        setOpen(false)
    }

    const getModal=()=>{
        switch (modalValue){
            case 'add':
              return <AddModalBlock
                    currentId={currentId}
               />
            case 'delete':
                return <ConfirmDelete
                        onDeleteDashboard={onDeleteDashboard}
                        closeModal={()=>setOpen(false)}
                />
            case 'info' :
               return <UserInfo
                        findUser={findUser}
                        departments={departments}
                        status={status}
               />
                return
            case 'sick' :
                return <SickBlock currentId={currentId}/>
            default:
                return null
        }
    }

    const onChangePage=(page,value)=>{
        if(value === "not-vaccined"){
            dispatch(actionGetNotVaccined(page,10))
        }else{
            dispatch(actionGetData(page,size))
        }
    }

    const onChangeTab=(event,newValue)=>{
        setValue(newValue)
    }

    const clearSearch=()=>{
        setSearch('')
    }
    const onGetAnalytics=()=>{
        dispatch(actionGetAnalytic())
    }
    const onGetData=()=>{
        dispatch(actionGetNotVaccined(0,10))
    }

    const onFilterData=React.useCallback((filterModel)=>{
        if (filterModel.items[0].value !==undefined){
           setSearchText(filterModel.items[0].value)
        }
    },[])

    return (
        // <React.Suspense fallback={<div>Загрузка....</div>}>
        <Box sx={{height:400,width:1}}>
            <CssBaseline/>
            {open &&
                <СustomModal
                    open={open}
                    setOpen={setOpen}
                >
                    { getModal()}
                </СustomModal>
            }
            <Search
                value={search}
                onChange={setSearch}
                clearSearch={clearSearch}
            />
            {!loading && (
                <TabContext value={value}>
                    <TabList onChange={onChangeTab}>
                        <Tab label="Общий список" value={"1"}/>
                        <Tab label="Должны вакцинироваться" value={"2"} onClick={onGetData}/>
                        <Tab label="Аналитика" value={"3"}  onClick={onGetAnalytics}/>
                    </TabList>
                    <TabPanel value="1">
                        <Button>
                            <Link to="/add">Добавить сотрудника</Link>
                        </Button>
                        <React.Suspense fallback={<div>Загрузка...</div>}>
                            <NotVaccineDataGrid
                                rows={rows}
                                onChangePage={page=>onChangePage(page)}
                                setModalValue={setModalValue}
                                setOpen={setOpen}
                                setCurrentId={setCurrentId}
                                rowsCount={rowsCountAll}
                                onFilterData={onFilterData}
                                setDeleteUser={setDeleteUser}
                                size={size}
                                page={page}
                            />
                        </React.Suspense>
                    </TabPanel>
                    <TabPanel value="2">
                        <React.Suspense fallback={<div>Загрузка...</div>}>
                            {rows?.length ?
                                (  <NotVaccineDataGrid
                                    onChangePage={page=>onChangePage(page,"not-vaccined")}
                                    setModalValue={setModalValue}
                                    rows={notVaccine}
                                    setOpen={setOpen}
                                    setCurrentId={setCurrentId}
                                    rowsCount={rowsCountNotVaccine}
                                    size={10}
                                    page={page}
                                    setDeleteUser={setDeleteUser}
                                    onFilterData={onFilterData}
                                />):
                                <div>Нет данных</div>
                            }
                        </React.Suspense>
                    </TabPanel>
                    <TabPanel value="3">
                        <Chart
                            vaccine={vaccined}
                            notVaccine={notVaccined}
                            sick={sick}
                        />
                    </TabPanel>
                </TabContext>
            )}
        </Box>
         // </React.Suspense>
    )

}

export default Dashboard