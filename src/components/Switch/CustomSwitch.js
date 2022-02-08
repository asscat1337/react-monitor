import {Switch,FormControlLabel} from '@mui/material'
import {styled} from '@mui/material'


const ChangeThemeSwitch=styled(Switch)(({theme})=>({
    padding: 8,
    '&.MuiSwitch-root':{
        width:66,
        '& .Mui-checked':{
            transform:'translateX(27px)',
            color:'white'
        },
    },
    '& .MuiSwitch-switchBase': {
        '& + .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            // color:'white'
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow:'none',
        width: 20,
        height: 18,
        margin:1
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#cad0d5' : '#CAD0D5FF',
        borderRadius: 20 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '41%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before' : {
            content: '"🌞"',
            left:12
        },
        '&:after':{
            content:'"🌜"',
            right:10
        }
    },
}))


function CustomSwitch({onChange,checked}){
    return (
        <FormControlLabel
            control={<ChangeThemeSwitch onChange={onChange} checked={checked}/>}
            label="Сменить тему"
        />
    )
}


export default CustomSwitch