import Header from './components/Header/Header'
import Dashboard from "./pages/Dashboard/Dashboard";
import Add from './pages/Add/Add'
import {Routes,Route} from 'react-router-dom'
import Login from "./pages/Login/Login";

function App() {
  return (
    <div className="App">
        <Header/>
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/add" element={<Add/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    </div>
  );
}

export default App;
