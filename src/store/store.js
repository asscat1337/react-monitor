import {createStore,combineReducers,applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {composeWithDevTools} from "redux-devtools-extension";
import dashboardReducer from './reducers/dashboardReducer'
import DepartmentReducer from "./reducers/departmentReducer";

const rootReducer = combineReducers({
    dashboard:dashboardReducer,
    department:DepartmentReducer
})

const store = createStore(rootReducer,composeWithDevTools(applyMiddleware(thunk)))


export default store



