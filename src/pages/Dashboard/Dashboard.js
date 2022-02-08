import React, {useState} from 'react'
import {useDispatch,useSelector} from "react-redux";
import {TabPanel,TabList,TabContext} from "@mui/lab";
import {Box, Button, Tab,CssBaseline} from "@mui/material";
import {Link} from 'react-router-dom'
import {actionGetData, actionGetNotVaccined, actionSearch} from "../../store/actions/actionDashboard";
import NotVaccineDataGrid from "../../components/DataGrid/NotVaccineDataGrid/NotVaccineDataGrid";
import СustomModal from "../../components/Modal/Modal";
import FormVaccine from "../../components/Forms/FormAddVaccine/FormVaccine";
import Search from "../../components/Search/Search";
import useDebounce from "../../components/hooks/use-debounce";

function Dashboard(){
    const [value,setValue] = useState('1')
    const [open,setOpen] = useState(false)
    const [currentId,setCurrentId] = useState(null)
    const [modalValue,setModalValue] = useState('')
    const [search,setSearch] = useState('')
    const debounceSearch = useDebounce(search,1000)

    const dispatch = useDispatch()
    const page = useSelector(state=>state.dashboard.page)
    const size = useSelector(state=>state.dashboard.size)
    const rowsCount = useSelector(state=>state.dashboard.rows)
    const infoVaccine = useSelector(state=>state.dashboard.info)
    const rows = useSelector(state=>state.dashboard.data)
    const notVaccine = useSelector(state=>state.dashboard.notVaccine)


    React.useEffect(()=>{
        if(debounceSearch === ""){
            dispatch(actionGetData(page,size))
        }
    },[debounceSearch])

    React.useEffect(()=>{
        if(debounceSearch){
            dispatch(actionSearch(debounceSearch))
        }
    },[debounceSearch])

    const getModal=()=>{
        switch (modalValue){
            case 'add':
                return <FormVaccine
                    currentId={currentId}
                />
            case 'info' :
                return <div>
                    {infoVaccine?.length ? (
                        <>
                            <h3>Информация о сотруднике</h3>
                            <div>ФИО:{infoVaccine[0]?.dashboard?.fio}</div>
                            <div>СНИЛС:{infoVaccine[0]?.dashboard?.snils}</div>
                            <React.Fragment>
                                <div>Дата первого компонента:{infoVaccine[0]?.first_date}</div>
                                <div>Дата второго компонента:{infoVaccine[0]?.last_date}</div>
                            </React.Fragment>
                        </>
                    ):(
                        <h1>Нет данных о пользователе😞</h1>
                    )}
                </div>
            default :
                return null
        }
    }

    const onChangePage=(page,value)=>{
        if(value === "not-vaccined"){
            dispatch(actionGetNotVaccined(page,size))
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

    const onGetData=()=>{
        dispatch(actionGetNotVaccined(0,5))
    }

    return (
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
            <TabContext value={value}>
                <TabList onChange={onChangeTab}>
                    <Tab label="Общий список" value="1"/>
                    <Tab label="Должны вакцинироваться" value="2" onClick={onGetData}/>
                </TabList>
                <TabPanel value="1">
                    <Button>
                        <Link to="/add">Добавить сотрудника</Link>
                    </Button>
                    <NotVaccineDataGrid
                        rows={rows}
                        onChangePage={page=>onChangePage(page)}
                        setModalValue={setModalValue}
                        setOpen={setOpen}
                        setCurrentId={setCurrentId}
                        rowsCount={rowsCount}
                        size={size}
                        page={page}
                    />
                </TabPanel>
                <TabPanel value="2">
                    {rows?.length ?
                        (  <NotVaccineDataGrid
                            onChangePage={page=>onChangePage(page,"not-vaccined")}
                            setModalValue={setModalValue}
                            rows={notVaccine}
                            setOpen={setOpen}
                            setCurrentId={setCurrentId}
                            rowsCount={rowsCount}
                            size={size}
                            page={page}
                        />):
                        <div>Нет данных</div>
                    }
                </TabPanel>
            </TabContext>
        </Box>
    )

}

export default Dashboard