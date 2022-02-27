import {createStore,combineReducers,applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import {persistStore,persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import {composeWithDevTools} from "redux-devtools-extension";
import dashboardReducer from './reducers/dashboardReducer'
import DepartmentReducer from "./reducers/departmentReducer";
import authReducer from "./reducers/authReducer";
import analyticReducer from "./reducers/analyticReducer";

const persistConfig= {
    key:'root',
    storage
}

const rootReducer = combineReducers({
    dashboard:dashboardReducer,
    department:DepartmentReducer,
    auth:authReducer,
    analytic:analyticReducer
})

const persistedReducer = persistReducer(persistConfig,rootReducer)

const store = createStore(persistedReducer,composeWithDevTools(applyMiddleware(thunk)))

const persistor = persistStore(store)

export {
    store,persistor
}



