// import actions
import { LOGIN, PUSHINFO, SIGNOUT, SIGNUP, SET_NAME, ERROR, LOADING } from '../actions/auth';

const initialState = {
    name: null,
    uid: null,
    email: null,
    creationDate: null,
    isLoading: false,
    errorMSG: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {...state, name: action.name, email: action.email, uid: action.uid, creationDate: action.creationDate }
        case SIGNUP:
            return {...state, name: action.name, email: action.email, uid: action.uid, creationDate: action.creationDate }
        case SIGNOUT:
            return {...state, name: null, email: null, uid: null, creationDate: null }
        case PUSHINFO:
            if (!action.name) {
                return {...state, email: action.email, uid: action.uid, creationDate: action.creationDate }
            }
            return {...state, name: action.name, email: action.email, uid: action.uid, creationDate: action.creationDate }
        case SET_NAME:
            return {...state, name: action.name }
        case LOADING:
            return {...state, isLoading: action.isLoading }
        case ERROR:
            return {...state, errorMSG: action.errorMSG, isLoading: false }
        default:
            return state
    }
}

export default authReducer;