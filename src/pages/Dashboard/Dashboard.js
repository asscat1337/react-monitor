import React, {useState} from 'react'
import {useDispatch,useSelector} from "react-redux";
import {TabPanel,TabList,TabContext} from "@mui/lab";
import {Button,Tab} from "@mui/material";
import {Link} from 'react-router-dom'
import {actionGetData,actionGetNotVaccined} from "../../store/actions/actionDashboard";
import VaccineDataGrid from "../../components/DataGrid/VaccineDataGrid/VaccineDataGrid";
import NotVaccineDataGrid from "../../components/DataGrid/NotVaccineDataGrid/NotVaccineDataGrid";
import СustomModal from "../../components/Modal/Modal";
import FormVaccine from "../../components/Forms/FormAddVaccine/FormVaccine";

function Dashboard(){
    const [value,setValue] = useState('1')
    const [open,setOpen] = useState(false)
    const [currentId,setCurrentId] = useState(null)
    const [modalValue,setModalValue] = useState('')

    const dispatch = useDispatch()
    const dashboardData = useSelector(state=>state.dashboard.data)
    const notVaccined = useSelector(state=>state.dashboard.notVaccined)
    const page = useSelector(state=>state.dashboard.page)
    const size = useSelector(state=>state.dashboard.size)
    const rowsCount = useSelector(state=>state.dashboard.rows)
    const infoVaccine = useSelector(state=>state.dashboard?.info)

    const getModal=()=>{
        switch (modalValue){
            case 'add':
                return <FormVaccine currentId={currentId}/>
            case 'info' :
                return <div>
                    Информация о юзере
                    <div>фио:{infoVaccine.user?.fio}</div>
                    {infoVaccine.vaccine?.map(item=>(
                        <React.Fragment key={item.vaccine_id}>
                            <div>Дата первого компонента:{item?.first_date}</div>
                            <div>Дата второго компонента:{item?.last_date}</div>
                        </React.Fragment>
                    )
                        )}
                </div>
            default :
                return null
        }
    }


    React.useEffect(()=>{
        dispatch(actionGetData(page,size))
    },[])

    const onChangeTab=(event,newValue)=>{
        setValue(newValue)
    }

    const onGetData=()=>{
        dispatch(actionGetNotVaccined(page,size))
    }

    return (
        <div>
            {open &&
                <СustomModal
                    open={open}
                    setOpen={setOpen}
                >
                    { getModal()}
                </СustomModal>
            }
            <TabContext value={value}>
                <TabList onChange={onChangeTab}>
                    <Tab label="Общий список" value="1"/>
                    <Tab label="Должны чипироваться" value="2" onClick={onGetData}/>
                </TabList>
                <TabPanel value="1">
                    <Button>
                        <Link to="/add">Добавить сотрудника</Link>
                    </Button>
                    <VaccineDataGrid
                        data={dashboardData}
                        setOpen={setOpen}
                        setCurrentId={setCurrentId}
                        setModalValue={setModalValue}
                    />
                </TabPanel>
                <TabPanel value="2">
                    {notVaccined.length ?
                        (  <NotVaccineDataGrid
                            rows={notVaccined}
                            rowsCount={rowsCount}
                            size={size}
                            page={page}
                            setOpen={setOpen}
                            setCurrentId={setCurrentId}
                            setModalValue={setModalValue}
                        />):
                        <div>Нет данных</div>
                    }
                </TabPanel>
            </TabContext>
        </div>
    )

}

export default Dashboard