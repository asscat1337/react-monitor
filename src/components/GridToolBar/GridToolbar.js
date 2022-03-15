import {GridToolbarContainer} from "@mui/x-data-grid";
import {Button} from '@mui/material'
import {generate} from "../../store/actions/actionDashboard";
import DownloadIcon from '@mui/icons-material/Download';


function CustomGridToolBar(){

    const generateData=()=>{
        console.log('123')
        generate()
    }

    return(
        <GridToolbarContainer>
            <Button
                onClick={generateData}
                startIcon={
                    <DownloadIcon/>
                }
            >
                Экспорт
            </Button>
        </GridToolbarContainer>
    )
}



export default CustomGridToolBar