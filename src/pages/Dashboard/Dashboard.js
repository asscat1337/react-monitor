import React, {useState} from 'react'
import {useDispatch,useSelector} from "react-redux";
// import {TabPanel,TabList,TabContext} from "@mui/lab";
import {Autocomplete, TextField} from "@mui/material";
import {Box, Button, Tab,CssBaseline} from "@mui/material";
import {Link} from 'react-router-dom'
import dayjs from "dayjs";
import {
    actionDeleteFinalComponent,
    actionDeleteFirstComponent,
    actionDeleteOther,
    actionDeleteSick,
    actionFilterData,
    actionGetData,
    actionGetNotVaccined,
    actionSearch,
    actionDeleteUser,
    actionChangeDepartment
} from "../../store/actions/actionDashboard";
import СustomModal from "../../components/Modal/Modal";
import FormVaccine from "../../components/Forms/FormAddVaccine/FormVaccine";
import FormAddSick from "../../components/Forms/FormAddSick/FormAddSick";
import Search from "../../components/Search/Search";
import useDebounce from "../../components/hooks/use-debounce";
import {actionGetAnalytic} from "../../store/actions/actionAnalytic";
import {actionGetDepartment} from "../../store/actions/actionDepartment";
const NotVaccineDataGrid = React.lazy(()=>import("../../components/DataGrid/NotVaccineDataGrid/NotVaccineDataGrid"))
const TabPanel = React.lazy(()=>import('@mui/lab/TabPanel'))
const TabList = React.lazy(()=>import('@mui/lab/TabList'))
const TabContext = React.lazy(()=>import('@mui/lab/TabContext'))
const Chart = React.lazy(()=>import("../../components/Chart/Chart"))



function Dashboard(){
    const [value,setValue] = useState('1')
    const [open,setOpen] = useState(false)
    const [changeDepartment,setChangeDepartment] = useState(false)
    const [currentId,setCurrentId] = useState(null)
    const [newDepartment,setNewDepartment] = useState({})
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
    },[])


    const onDeleteFirstComponent=()=>{
        dispatch(actionDeleteFirstComponent(findUser))
    }

    const onDeleteLastComponent=()=>{
        dispatch(actionDeleteFinalComponent(findUser))
    }

    const onDeleteSick=()=>{
        dispatch(actionDeleteSick(findUser))
    }
    const onDeleteOther=()=>{
        dispatch(actionDeleteOther(findUser))
    }
    const onDeleteDashboard=()=>{
       dispatch(actionDeleteUser(deleteUser))
        setOpen(false)
    }
    const onToggleDepartment=()=>{
       setChangeDepartment(!changeDepartment)
    }
    const onChangeDepartment=()=>{
       dispatch(actionChangeDepartment({findUser,newDepartment}))
    }
    const handleChange=(event,value)=>{
        setNewDepartment(value)
    }

    const getModal=()=>{
        switch (modalValue){
            case 'add':
                return <FormVaccine
                            currentId={currentId}
                        />
            case 'delete':
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
                                onClick={()=>setOpen(false)}
                            >
                                Закрыть
                            </Button>
                        </div>
                    </>
                )
            case 'info' :
                return <div>
                    {findUser.length ? (
                        <>
                            <h3>Информация о сотруднике</h3>
                            <div>ФИО:{findUser[0].fio}</div>
                            <div>СНИЛС:{findUser[0].snils}</div>
                            <div>Текущий статус:{findUser[0].status}</div>
                            <div>Дата рождения:{dayjs(findUser[0].birthday).format('DD-MM-YYYY')}</div>
                                <React.Fragment>
                                    {findUser[0].vaccine?.componentName &&
                                        <div>
                                            <span>Название вакцины:{findUser[0]?.vaccine?.componentName}</span>
                                        </div>
                                    }
                                    {findUser[0].vaccine?.first_date &&
                                        <div>
                                            <span>
                                                Дата первого компонента:{dayjs(findUser[0]?.vaccine?.first_date).format('DD-MM-YYYY')}
                                            </span>
                                            <Button onClick={onDeleteFirstComponent}>
                                                Удалить
                                            </Button>
                                        </div>
                                    }
                                    {
                                        findUser[0].vaccine?.last_date &&
                                        (<div>
                                            <span>
                                                   Дата второго компонента:{dayjs(findUser[0]?.vaccine.last_date).format('DD-MM-YYYY')}
                                            </span>
                                            <Button onClick={onDeleteLastComponent}>
                                                Удалить
                                            </Button>
                                        </div>)
                                    }
                                    {
                                        findUser[0].vaccine?.sick_date &&
                                        (<div>
                                            <span> Дата заболевания:{dayjs(findUser[0]?.vaccine.sick_date).format('DD-MM-YYYY')}</span>
                                            <Button onClick={onDeleteSick}>
                                                Удалить
                                            </Button>
                                        </div>)
                                    }
                                    {
                                        findUser[0].vaccine?.other_date &&
                                        (<div>
                                            <span>
                                                Дата медотвода:{dayjs(findUser[0]?.vaccine.other_date).format('DD-MM-YYYY')}
                                            </span>
                                            <Button onClick={onDeleteOther}>
                                                Удалить
                                            </Button>
                                        </div>)
                                    }
                                    {
                                        findUser[0].vaccine?.reason && (
                                            <div>
                                                <span>Причина:{findUser[0]?.vaccine.reason}</span>
                                            </div>
                                        )
                                    }
                                    <Button onClick={onToggleDepartment}>
                                        Изменить отделение
                                    </Button>
                                    {changeDepartment && (
                                        <div>
                                            <Autocomplete
                                                renderInput={(params)=>(
                                                    <TextField {...params}/>
                                                )}
                                                getOptionLabel={(option=>option.label)}
                                                options={departments}
                                                onChange={handleChange}
                                            />
                                            <Button onClick={onChangeDepartment}>
                                                Подтвердить
                                            </Button>
                                        </div>
                                    )}
                                </React.Fragment>
                        </>
                    ):(
                        <h1>Нет данных о пользователе😞</h1>
                    )}
                </div>
            case 'sick' :
                return (
                    <>
                        <div>Болезнь</div>
                           <FormAddSick
                               currentId={currentId}
                        />
                    </>
                )
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
                        <Tab label="Общий список" value="1"/>
                        <Tab label="Должны вакцинироваться" value="2" onClick={onGetData}/>
                        <Tab label="Аналитика" value="3"  onClick={onGetAnalytics}/>
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