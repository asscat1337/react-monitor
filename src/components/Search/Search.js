import {Box,TextField,IconButton} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function Search({value,onChange,clearSearch}){

    const changeValue=e=>{
        onChange(e.target.value)
    }


    return(
       <Box sx={{p:0.5,pb:0}}>
           <TextField
             variant="standard"
             placeholder="Поиск..."
             value={value}
             onChange={changeValue}
             InputProps={{
                 startAdornment: <SearchIcon/>,
                 endAdornment :(
                    <IconButton
                        style={{visibility:value ? 'visible' : 'none'}}
                        onClick={clearSearch}
                    >
                        <ClearIcon/>
                    </IconButton>
                 )
             }}
           />
       </Box>
    )
}



export default Search