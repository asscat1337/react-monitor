import React from 'react'
import Header from './components/Header/Header'
import Dashboard from "./pages/Dashboard/Dashboard";
import Add from './pages/Add/Add'
import {Routes,Route,useLocation} from 'react-router-dom'
import PrivateRouter from "./components/router/PrivateRouter";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import {ThemeProvider,createTheme} from "@mui/material";
import Context from "./components/context/context";


function App() {
    const location = useLocation()
    const [mode,setMode] = React.useState(localStorage.getItem('theme'))
    const theme  = createTheme({
        palette:{
            mode:mode ?? "light"
        }
    })

    React.useEffect(()=>{
        if(!mode){
            localStorage.setItem('theme','light')
        }
    },[mode])
    const [openSnackBar,setOpenSnackBar] = React.useState(false)

    const onOpenSnackBar=()=>{
        setOpenSnackBar(true)
    }

    const onCloseSnackBar=()=>{
        setOpenSnackBar(false)
    }
    const onChangeTheme = ()=>{
        setMode(prev=>prev === 'light' ? 'dark' : 'light')
        localStorage.setItem('theme',mode === 'light' ? 'dark':'light')
    }


  return (
      <ThemeProvider theme={theme}>
          <Context.Provider value={{onCloseSnackBar,onOpenSnackBar,openSnackBar}}>
              <div className="App">
                  {!location.pathname.includes('login') &&
                  <Header
                      onChange={onChangeTheme}
                      checked={mode}
                  />
                  }
                  <Routes>
                      <Route path="/" element={
                          <PrivateRouter component={Dashboard}/>
                      }/>
                      <Route path="/add" element={
                          <PrivateRouter component={Add}/>
                      }/>
                      <Route path="/login" element={<Login/>}/>
                      <Route path="*" element={<NotFound/>}/>
                  </Routes>
              </div>
          </Context.Provider>

      </ThemeProvider>
  );
}

export default App;
