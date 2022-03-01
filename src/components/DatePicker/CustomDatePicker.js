import {TextField} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ruLocale from 'date-fns/locale/ru'
import {LocalizationProvider,DatePicker} from "@mui/lab";

function CustomDatePicker({value,onChange,sx={}}){
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
            <DatePicker
                value={value}
                onChange={onChange}
                mask={'__.__.____'}
                renderInput={(params)=><TextField {...params} sx={sx}/>}
            />
        </LocalizationProvider>
    )
}




export default CustomDatePicker