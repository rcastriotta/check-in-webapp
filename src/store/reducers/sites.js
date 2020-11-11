// import actions
import { FETCH_SITES, UPLOADING, ERROR, FETCHING } from '../actions/sites';
import { SIGNOUT } from '../actions/auth';

const initialState = {
    sites: null,
    loading: false,
    uploading: false,
    errorMSG: null,
    fetching: false
}

const sitesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SITES:
            return {...state, sites: action.sites }
        case UPLOADING:
            return {...state, uploading: action.isUploading }
        case FETCHING:
            return {...state, fetching: action.isFetching }
        case ERROR:
            return {...state, errorMSG: action.errorMSG }
        case SIGNOUT:
            return {
                sites: null,
                loading: false,
                uploading: false,
                errorMSG: null,
                fetching: false
            }
        default:
            return state
    }
}

export default sitesReducer;